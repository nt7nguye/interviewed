#!/usr/bin/env uv run

import random
from datetime import datetime, timedelta
import asyncio
from db import Database

async def create_tables(db: Database, drop_existing: bool = False) -> None:
    if drop_existing:
        await db.execute('DROP TABLE IF EXISTS shift_pay')
        await db.execute('DROP TABLE IF EXISTS shifts')
        await db.execute('DROP TABLE IF EXISTS user_preferences')
        await db.execute('DROP TABLE IF EXISTS users')
        await db.execute('DROP TABLE IF EXISTS shift_categories')

    await db.execute('''
        CREATE TABLE IF NOT EXISTS shifts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lat REAL,
            long REAL,
            name TEXT,
            shift_start TIMESTAMP,
            shift_end TIMESTAMP,
            workers_requested INTEGER,
            workers_scheduled INTEGER
        )
    ''')
    await db.execute('''
        CREATE TABLE IF NOT EXISTS shift_pay (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            shift_id INTEGER REFERENCES shifts(id),
            pay REAL
        )
    ''')
    await db.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            status TEXT CHECK (status IN ('active', 'deleted'))
        )
    ''')
    await db.execute('''
        CREATE TABLE IF NOT EXISTS user_preferences (
            user_id INTEGER REFERENCES users(id),
            sort_preference TEXT
        )
    ''')
    await db.execute('''
        CREATE TABLE IF NOT EXISTS shift_categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
        )
    ''')

async def populate_sample_data(db: Database) -> None:
    shift_data = await db.fetchone('SELECT COUNT(*) as count FROM shifts')

    if shift_data['count'] == 0:
        for i in range(1, 5001):
            shift_start = datetime.now() + timedelta(days=random.randint(1, 30))
            shift_end = shift_start + timedelta(hours=8)
            shift_id = (await db.fetchone('''
                INSERT INTO shifts (lat, long, name, shift_start, shift_end, workers_requested, workers_scheduled)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id
            ''', 37.77 + random.random() * 0.01, -122.41 + random.random() * 0.01, f"Company {i}", shift_start, shift_end, random.randint(1, 10), random.randint(0, 5)))['id']

            await db.execute('''
                INSERT INTO shift_pay (shift_id, pay)
                VALUES ($1, $2)
            ''', shift_id, round(random.uniform(15, 30), 2))

    user_data = await db.fetchone('SELECT COUNT(*) as count FROM users')
    if user_data['count'] == 0:
        for i in range(1, 51):
            await db.execute('''
                INSERT INTO users (status)
                VALUES ($1)
            ''', 'active')

        for i in range(51, 101):
            await db.execute('''
                INSERT INTO users (status)
                VALUES ($1)
            ''', 'deleted')

        for i in range(101, 401):
            await db.execute('''
                INSERT INTO users (status)
                VALUES ($1)
            ''', random.choice(['active', 'deleted']))

        for i in range(401, 501):
            await db.execute('''
                INSERT INTO users (status)
                VALUES ($1)
            ''', 'active')

    user_pref_data = await db.fetchone('SELECT COUNT(*) as count FROM user_preferences')
    if user_pref_data['count'] == 0:
        for i in range(1, 101):
            await db.execute('''
                INSERT INTO user_preferences (user_id, sort_preference)
                VALUES ($1, $2)
            ''', i, random.choice(["pay", "starts_soonest", "starts_latest"]))

async def bootstrap_database(db_path: str = 'workwhile.db'):
    db = Database(db_path)
    await db.connect()
    
    try:
        await create_tables(db)
        await populate_sample_data(db)
        print("Database bootstrapped successfully.")
    finally:
        await db.disconnect()

if __name__ == "__main__":
    asyncio.run(bootstrap_database())
