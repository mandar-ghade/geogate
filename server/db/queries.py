from typing import Optional
from asyncpg import Connection
import asyncpg
from fastapi import HTTPException
from models import Coords, NodeType, ResourceNode, User


async def get_nodes_within_radius(
    conn: Connection, coords: Coords, radius: float
):
    """Radius is in meters."""
    query = """
    SELECT
        id,
        node_type,
        ST_Y(location::geometry) AS lat,
        ST_X(location::geometry) AS lon,
        created_at
    FROM
        resource_nodes
    WHERE
        ST_DWithin(
            location,
            ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
            $3
        );
    """
    rows = await conn.fetch(query, coords.lon, coords.lat, radius)
    return [
        ResourceNode(
            id=row["id"],
            nodeType=row["node_type"],
            coords=Coords(lat=row["lat"],
                          lon=row["lon"]),
            # created_at=row["created_at"],
        )
        for row in rows
    ]


async def insert_resource_node(
    conn: Connection, node_type: NodeType, coords: Coords
) -> int:
    """Inserts a new resource node into the database and
    returns the ID of the newly created resource node.
    """
    query = """
    INSERT INTO resource_nodes (node_type, location)
    VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326))
    RETURNING id;
    """
    res = await conn.fetchval(query, node_type.value, coords.lon, coords.lat)
    if not isinstance(res, int):
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected return on insertion: {res}",
        )
    return res


async def insert_user(
        conn: Connection, username: str, password_hash, email: Optional[str]
) -> User:
    query = """
    INSERT INTO users (username, password_hash, email)
    VALUES ($1, $2, $3)
    RETURNING id, username, email, created_at
    """
    try:
        user_row = await conn.fetchrow(query, username, password_hash, email)
    except asyncpg.UniqueViolationError:
        raise HTTPException(
            status_code=400,
            detail="Username or email already used",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    if user_row is None:
        print("Failed to create user")
        raise HTTPException(
            status_code=500,
            detail="Failed to create user",
        )
    return User.model_validate(dict(user_row))
