#!/usr/bin/env uv run
import pdb
import uvicorn
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import Annotated
from db import Database
from configuration import TimingMiddleware, logger, get_lifespan

db = Database()

app: FastAPI = FastAPI(lifespan=get_lifespan(db))
app.add_middleware(TimingMiddleware)


class ShiftResponse(BaseModel):
    shifts: list[dict]


# TODO: Investigate performance issues with this endpoint.
# FIX: Fix N+1 query with a join
@app.get("/backend/shifts", response_model=ShiftResponse)
async def get_shifts() -> ShiftResponse:
    query: str = """
        SELECT s.id, s.lat, s.long, s.name, s.shift_start, s.shift_end, s.workers_requested, s.workers_scheduled, sp.pay
        FROM shifts s JOIN shift_pay sp ON s.id = sp.shift_id
    """
    shifts = await db.fetch(query)
    return ShiftResponse(shifts=shifts)


class AvailableShiftsResponse(BaseModel):
    available_shifts: list[dict]


# TODO: Figure out why this doesn't seem to be returning the right shifts
# Example call with min_pay query param specified: http://localhost:8000/backend/shifts/available?min_pay=29
@app.get("/backend/shifts/available", response_model=AvailableShiftsResponse)
async def get_available_shifts(
    min_pay: Annotated[float, Query(description="Minimum pay rate for shifts")],
) -> AvailableShiftsResponse:
    query = f"""
    SELECT s.*, sp.pay
    FROM shifts s
    JOIN shift_pay sp ON s.id = sp.shift_id
    WHERE s.workers_scheduled < s.workers_requested AND sp.pay >= {min_pay}
    """
    shifts = await db.fetch(query)

    # available_shifts = []
    # for shift in shifts:
    #     if shift['workers_scheduled'] >= shift['workers_scheduled'] and shift['pay'] >= min_pay:
    #         available_shifts.append(shift)

    return AvailableShiftsResponse(available_shifts=shifts)


class UserPreferencesResponse(BaseModel):
    user_id: int
    sort_preference: str


# TODO: Figure out why this throws 500s sometimess
# 
@app.get("/backend/user_preferences/{user_id}", response_model=UserPreferencesResponse)
async def get_user_preferences(user_id: int):
    query: str = """
        SELECT users.id, users.status, user_preferences.sort_preference
        FROM users
        LEFT OUTER JOIN user_preferences ON users.id = user_preferences.user_id
        WHERE users.id = $1
    """
    user_row = await db.fetchone(query, user_id)
    # pdb.set_trace()

    if not user_row or user_row["status"] == "deleted":
        raise HTTPException(status_code=404, detail="User not found")

    sort_preference = user_row["sort_preference"]

    user_preferences = UserPreferencesResponse(
        user_id=user_row["id"], sort_preference=sort_preference or "pay"
    )

    return user_preferences


if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, log_config=None, reload=True)
