import random
from contextlib import asynccontextmanager
from asyncpg import Pool
from fastapi import FastAPI

from db.connection import get_db_pool
from db.queries import get_nodes_within_radius, insert_resource_node
from models import NodeInsertBody, NodeType, ResourceNode, NODE_TYPE_WEIGHTS
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


def parse_node_type(type_str: str) -> NodeType:
    NODE_TYPE_WEIGHTS.keys()
    return NodeType(type_str)


@app.get("/api")
async def get_root():
    return {"message": "This is an API"}


@app.get("/api/nodes")
async def get_nodes(lat: float, lon: float) -> list[ResourceNode]:
    radius = 1000  # 1km
    pool: Pool = app.state.db_pool
    async with pool.acquire() as conn:
        nodes = await get_nodes_within_radius(conn, lat, lon, radius)
    print(f"Fetched {len(nodes)} nodes around ({lat}, {lon})")
    return nodes


@app.post("/api/nodes")
async def post_node(body: NodeInsertBody):
    if body.node_type not in NODE_TYPE_WEIGHTS.keys():
        return {"error": f"Unknown node type '{body.node_type}'"}
    pool: Pool = app.state.db_pool
    async with pool.acquire() as conn:
        node_id = await insert_resource_node(
            conn, NodeType(body.node_type), body.lat, body.lon
        )
    print(f"Inserted node with (id: {node_id})")
    return {"id": node_id}
