import random
from contextlib import asynccontextmanager
from asyncpg import Pool
from fastapi import FastAPI

from db.connection import get_db_pool
from db.queries import get_nodes_within_radius
from models import NodeType, ResourceNode, NODE_TYPE_WEIGHTS
from middleware import init_middleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    db_pool = await get_db_pool()
    app.state.db_pool = db_pool
    try:
        yield
    finally:
        await db_pool.close()


app = FastAPI(lifespan=lifespan)
init_middleware(app)


def get_random_node_type() -> NodeType:
    types = list(NODE_TYPE_WEIGHTS.keys())
    weights = list(NODE_TYPE_WEIGHTS.values())
    return random.choices(types, weights=weights, k=1)[0]


@app.get("/api")
async def get_root():
    return {"message": "This is an API"}


@app.get("/api/nodes")
async def get_nodes(lat: float, lon: float) -> list[ResourceNode]:
    pool: Pool = app.state.db_pool
    radius = 1000  # 1km
    nodes = await get_nodes_within_radius(pool, lat, lon, radius)
    print(f"Fetched {len(nodes)} nodes around ({lat}, {lon})")
    return nodes
