import random
from argon2 import PasswordHasher
from contextlib import asynccontextmanager
from asyncpg import Pool
from fastapi import FastAPI

from db.connection import get_db_pool
from db.queries import get_nodes_within_radius, insert_resource_node, insert_user
from models import Coords, NodeCreate, NodeType, ResourceNode, NODE_TYPE_WEIGHTS, User, UserCreate
from middleware import init_middleware

ph = PasswordHasher()


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
    coords = Coords(lat=lat, lon=lon)
    radius = 1000  # 1km
    pool: Pool = app.state.db_pool
    async with pool.acquire() as conn:
        nodes = await get_nodes_within_radius(conn, coords, radius)
    print(f"Fetched {len(nodes)} nodes around {coords}")
    return nodes


@app.post("/api/nodes")
async def post_node(body: NodeCreate):
    pool: Pool = app.state.db_pool
    async with pool.acquire() as conn:
        node_id = await insert_resource_node(conn, body.node_type, body.coords)
    print(f"Inserted node (id={node_id}) at {body.coords}")
    return {"id": node_id}


@app.post("/api/register")
async def register_user(user: UserCreate) -> User:
    pool: Pool = app.state.db_pool
    password_hash = ph.hash(user.password)
    async with pool.acquire() as conn:
        new_user = await insert_user(
            conn, user.username, password_hash, user.email
        )
    return new_user
