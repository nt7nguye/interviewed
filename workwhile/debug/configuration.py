import logging
import time
from rich.console import Console
from rich.logging import RichHandler
import uvicorn
import starlette
import fastapi
from fastapi import FastAPI, Request
from starlette.middleware.base import BaseHTTPMiddleware
from contextlib import asynccontextmanager
from typing import Callable, AsyncContextManager

from bootstrap_db import create_tables, populate_sample_data
from db import Database

# Configure rich console and logging
console = Console()
logging.basicConfig(
    level="INFO",
    format="%(message)s",
    datefmt="[%X]",
    handlers=[RichHandler(console=console, rich_tracebacks=True, tracebacks_show_locals=True, tracebacks_suppress=[uvicorn, starlette, fastapi])]
)
logger = logging.getLogger("uvicorn")

class TimingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        logger.info(f"Request to {request.url.path} took {process_time:.2f} seconds")
        return response

def get_lifespan(db: Database) -> Callable[[FastAPI], AsyncContextManager]:
    @asynccontextmanager
    async def lifespan(app: FastAPI):
        # On startup
        await db.connect()
        await create_tables(db, drop_existing=False)
        await populate_sample_data(db)
        yield
        # On shutdown
        await db.disconnect()

    return lifespan
