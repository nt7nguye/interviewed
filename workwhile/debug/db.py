import os
from typing import Any
import logging
import aiosqlite

# Database connection
logger = logging.getLogger("uvicorn")

class Database:
    def __init__(self, db_path: str = 'workwhile.db', sql_logging: bool = False) -> None:
        self.conn: aiosqlite.Connection | None = None
        self.db_path = db_path
        self.sql_logging = os.environ.get('VERBOSE_SQL_LOGGING', 'false').lower() == 'true'

    @staticmethod
    def dict_factory(cursor, row):
        fields = [column[0] for column in cursor.description]
        return {key: value for key, value in zip(fields, row)}

    async def connect(self) -> None:
        # Connect to the SQLite database
        self.conn = await aiosqlite.connect(self.db_path)
        self.conn.row_factory = self.dict_factory
        await self.conn.execute("PRAGMA foreign_keys = ON")
        logger.info(f"Connected to database: {self.db_path}")

    async def disconnect(self) -> None:
        if self.conn:
            await self.conn.close()

    async def execute(self, query: str, *args: Any) -> str:
        async with self.conn.execute(query, args) as cursor:
            await self.conn.commit()
            return f"Affected {cursor.rowcount} rows"

    async def fetch(self, query: str, *args: Any) -> list[dict]:
        if self.sql_logging:
            logger.info(f"Fetching SQL: {query}, Args: {args}")
        async with self.conn.execute(query, args) as cursor:
            return await cursor.fetchall()

    async def fetchone(self, query: str, *args: Any) -> dict | None:
        if self.sql_logging:
            logger.info(f"Fetching row SQL: {query}, Args: {args}")
        async with self.conn.execute(query, args) as cursor:
            return await cursor.fetchone()
