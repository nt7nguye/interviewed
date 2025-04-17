# type: ignore (ugly - overriding stdlib types)

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


class CreateCustomerBody(BaseModel):
    name: str


class AccountResponse(BaseModel):
    # We don't serialize the tb_account_id ever
    id: str
    customer_id: str
    balance: int = 0

    class Config:
        from_attributes = True
        extra = "ignore"


class CustomerResponse(BaseModel):
    id: str
    name: str
    created_at: datetime
    accounts: List[AccountResponse]

    class Config:
        from_attributes = True


class CreateAccountBody(BaseModel):
    customer_id: str
    balance: int


class TransferBody(BaseModel):
    from_account_id: str
    to_account_id: str
    amount: int


class TransferResponse(BaseModel):
    id: int
    from_account_id: str
    to_account_id: str
    amount: int
    timestamp: int
