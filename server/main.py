import base64
import hashlib
import random
import secrets

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from asyncpg import Pool
from contextlib import asynccontextmanager
from datetime import timezone, datetime, timedelta
from fastapi import FastAPI, HTTPException, Response
from pydantic import BaseModel

from db.connection import get_db_pool
from db.queries import create_auth_session, get_nodes_within_radius, get_user_password_hash, insert_resource_node, insert_user
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


class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/api/login")
async def login(request: LoginRequest, response: Response):
    try:
        async with app.state.db_pool.acquire() as conn:
            # Get user credentials
            user_info = await get_user_password_hash(conn, request.username)
            if not user_info:
                raise HTTPException(status_code=401,
                                    detail="Invalid credentials")
            
            user_id, password_hash = user_info
            
            # Verify password
            try:
                ph.verify(password_hash, request.password)
            except VerifyMismatchError:
                raise HTTPException(status_code=401,
                                    detail="Invalid credentials")
            
            # Generate session token
            session_token = secrets.token_urlsafe(32)
            token_hash = base64.b64encode(
                hashlib.sha256(session_token.encode()).digest()
            ).decode()
            
            # Store session
            session_length = timedelta(days=30)
            expires_at = datetime.now(timezone.utc) + session_length
            await create_auth_session(conn, user_id, token_hash, expires_at)
            
            # Set cookie
            response.set_cookie(
                key="session_token",
                value=session_token,
                httponly=True,
                secure=False,  # Allow HTTP for DEVELOPMENT ONLY
                samesite="lax",  # Preserved when navigating from external domain
                max_age=session_length.seconds,
            )
            
            return {
                "message": "Logged in successfully",
                "userId": user_id,
            }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
