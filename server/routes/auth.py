import base64
import hashlib
import secrets
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from asyncpg import Pool
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, HTTPException, Request, Response
from pydantic import BaseModel
from typing import Optional
from db.auth import create_auth_session, get_user_password_hash, insert_user
from models import User

router = APIRouter()
ph = PasswordHasher()


class UserCreate(BaseModel):
    username: str
    password: str
    email: Optional[str] = None


@router.post("/register")
async def register_user(user: UserCreate, request: Request) -> User:
    pool: Pool = request.app.state.db_pool
    password_hash = ph.hash(user.password)
    async with pool.acquire() as conn:
        new_user = await insert_user(
            conn, user.username, password_hash, user.email
        )
    return new_user


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
async def login(login_req: LoginRequest, request: Request, response: Response):
    try:
        async with request.app.state.db_pool.acquire() as conn:
            # Get user credentials
            user_info = await get_user_password_hash(conn, login_req.username)
            if not user_info:
                raise HTTPException(status_code=401,
                                    detail="Invalid credentials")
            
            user_id, password_hash = user_info
            
            # Verify password
            try:
                ph.verify(password_hash, login_req.password)
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
