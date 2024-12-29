import asyncpg
from config import Config


async def get_db_pool() -> asyncpg.Pool:
    """Initialize and return a database connection pool."""
    return await asyncpg.create_pool(
        user=Config.DB_USER,
        password=Config.DB_PASSWORD,
        database=Config.DB_NAME,
        host=Config.DB_HOST,
        port=Config.DB_PORT,
    )
