# Requirements:
#
# Create a new bank account with an initial deposit amount. A single customer may have multiple bank accounts.
# Transfer amounts between any two accounts, including those owned by different customers.
# Retrieve balances for a given account.
# Retrieve transfer history for a given account.
# There is no need to implement authentication
# Balances should never be zero

from datetime import datetime
import pdb
import uuid
from typing import List
from fastapi import FastAPI, HTTPException, Depends
from sqlmodel import SQLModel, Session, create_engine, select
from tigerbeetle.client import time

from .types import (
    AccountResponse,
    CreateCustomerBody,
    CustomerResponse,
    TransferBody,
    TransferResponse,
    CreateAccountBody,
)
from .models import Customer, Account
from .tb_client import (
    create_tb_account,
    create_tb_transfer,
    get_account_balances,
    get_account_transfer_history,
    get_tb_transfer,
)


DATABASE_URL = "sqlite:///banking.db"
engine = create_engine(DATABASE_URL)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


app = FastAPI(title="Banking API")


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.post("/customers/", response_model=CustomerResponse)
async def create_customer(
    body: CreateCustomerBody, session: Session = Depends(get_session)
) -> Customer:
    customer = Customer(id=str(uuid.uuid4()), name=body.name)
    session.add(customer)
    session.commit()
    session.refresh(customer)
    return customer


@app.get("/customers/", response_model=List[CustomerResponse])
async def get_customers(
    session: Session = Depends(get_session),
) -> List[CustomerResponse]:
    # Query
    customers = session.exec(select(Customer)).all()

    # Serialize

    # Get balances and join in the response
    balances = get_account_balances(
        [
            account.tb_account_id
            for customer in customers
            for account in customer.accounts
        ]
    )

    response = []
    for customer in customers:
        customer_response: CustomerResponse = CustomerResponse.model_validate(customer)
        customer_response.accounts = []

        for account in customer.accounts:
            account_response = AccountResponse.model_validate(account)
            account_response.balance = balances[account.tb_account_id]
            customer_response.accounts.append(account_response)
        response.append(customer_response)
    return response


@app.get("/customers/{customer_id}/", response_model=CustomerResponse)
async def get_customer(
    customer_id: str, session: Session = Depends(get_session)
) -> CustomerResponse:
    # Query
    customer = session.get(Customer, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    # Serialize
    response = CustomerResponse.model_validate(customer)

    # Get balances and join in the response
    balances = get_account_balances(
        [account.tb_account_id for account in customer.accounts]
    )
    for account in response.accounts:
        account.balance = balances[account.tb_account_id]
    return response


@app.post("/accounts/", response_model=AccountResponse)
async def create_account(
    body: CreateAccountBody, session: Session = Depends(get_session)
) -> Account:
    # Query
    customer = session.get(Customer, body.customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    # Ensure initial balance is positive
    if body.balance <= 0:
        raise HTTPException(
            status_code=400, detail="Initial balance must be greater than zero"
        )

    # OK the commit logic here is really ugly but this is the only transaction that
    # involves writing to both postgres and tigerbeetle
    sql_account_id = str(uuid.uuid4())
    # Use a hash of the UUID as the TigerBeetle account ID
    tb_account_id = abs(hash(sql_account_id)) % (2**31)

    account = Account(
        id=sql_account_id,
        customer_id=body.customer_id,
        tb_account_id=tb_account_id,
    )
    session.add(account)
    session.commit()
    session.refresh(account)

    # Always commit postgres first, tigerbeetle does not allow removing accounts
    try:
        create_tb_account(tb_account_id, body.balance)
    except Exception as e:
        # Ideally we also handle account error vs. initial deposit error as 2 separate errors
        # But we're faking the genesis transaction anyway so its abstracted away here
        # Anyway, rollback postgres account
        session.delete(account)
        session.commit()
        raise HTTPException(status_code=400, detail=str(e))

    # Serialize
    response = AccountResponse.model_validate(account)
    response.balance = body.balance
    return response


@app.get("/accounts/", response_model=List[AccountResponse])
async def get_accounts(
    session: Session = Depends(get_session),
) -> List[AccountResponse]:
    accounts = session.exec(select(Account)).all()

    balances = get_account_balances([account.tb_account_id for account in accounts])
    response = []
    for account in accounts:
        account_response = AccountResponse.model_validate(account)
        account_response.balance = balances[account.tb_account_id]
        response.append(account_response)
    return response


@app.get("/accounts/{account_id}", response_model=AccountResponse)
async def get_account(
    account_id: str, session: Session = Depends(get_session)
) -> AccountResponse:
    account = session.get(Account, account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    # Serialize
    response = AccountResponse.model_validate(account)

    # Get balance
    balances = get_account_balances([account.tb_account_id])
    response.balance = balances[account.tb_account_id]
    return response


@app.post("/transfers/", response_model=TransferResponse)
async def create_transfer(
    body: TransferBody, session: Session = Depends(get_session)
) -> TransferResponse:
    # Verify accounts exist
    from_account = session.get(Account, body.from_account_id)
    if not from_account:
        raise HTTPException(status_code=404, detail="From account not found")
    to_account = session.get(Account, body.to_account_id)
    if not to_account:
        raise HTTPException(status_code=404, detail="To account not found")

    # Tigerbeetle handles the balance :stonks:
    id = abs(hash(uuid.uuid4())) % (2**31)
    try:
        transfer = create_tb_transfer(
            id=id,
            debit_account_id=from_account.tb_account_id,
            credit_account_id=to_account.tb_account_id,
            amount=body.amount,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    return TransferResponse(
        id=id,
        from_account_id=from_account.id,
        to_account_id=to_account.id,
        amount=body.amount,
        timestamp=transfer.timestamp,
    )


@app.get("/transfers/{transfer_id}", response_model=TransferResponse)
async def get_transfer(
    transfer_id: int, session: Session = Depends(get_session)
) -> TransferResponse:
    transfer = get_tb_transfer(transfer_id)
    from_account = session.exec(
        select(Account).where(Account.tb_account_id == transfer.debit_account_id)
    ).first()
    # If the account is deleted, we should return a 404
    if not from_account:
        raise HTTPException(status_code=404)
    to_account = session.exec(
        select(Account).where(Account.tb_account_id == transfer.credit_account_id)
    ).first()
    if not to_account:
        raise HTTPException(status_code=404)

    return TransferResponse(
        id=transfer.id,
        from_account_id=from_account.id,
        to_account_id=to_account.id,
        amount=transfer.amount,
        timestamp=transfer.timestamp,
    )


@app.get("/accounts/{account_id}/transfers", response_model=List[TransferResponse])
async def get_account_transfers(
    account_id: str, session: Session = Depends(get_session)
) -> List[TransferResponse]:
    # Verify account exists
    account = session.get(Account, account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    transfers = get_account_transfer_history(account.tb_account_id)
    if not transfers:
        return []

    # Get all unique account IDs from transfers
    debit_account_ids = {t.debit_account_id for t in transfers}
    credit_account_ids = {t.credit_account_id for t in transfers}
    all_account_ids = list(debit_account_ids | credit_account_ids)

    # Query all accounts at once
    accounts = session.exec(
        select(Account).where(Account.tb_account_id.in_(all_account_ids))
    ).all()
    account_map = {account.tb_account_id: account.id for account in accounts}
    return [
        TransferResponse(
            id=transfer.id,
            from_account_id=account_map[transfer.debit_account_id],
            to_account_id=account_map[transfer.credit_account_id],
            amount=transfer.amount,
            timestamp=transfer.timestamp,
        )
        for transfer in transfers
    ]
