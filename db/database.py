import asyncpg
from fastapi import APIRouter

Router = APIRouter()


DB_CONFIG = {
    "host": SENA_HOST,
    "port": 6543,
    "database": "postgres",
    "user": SENA_USER,
    "password": SENA_PWD,
    "ssl": "require",
}

pool: asyncpg.Pool | None = None


async def startup():
    global pool
    pool = await asyncpg.create_pool(
        host=DB_CONFIG["host"],
        port=DB_CONFIG["port"],
        database=DB_CONFIG["database"],
        user=DB_CONFIG["user"],
        password=DB_CONFIG["password"],
        ssl=DB_CONFIG["ssl"],
        min_size=1,
        max_size=5,
        statement_cache_size=0
    )


async def shutdown():
    global pool
    if pool:
        await pool.close()

