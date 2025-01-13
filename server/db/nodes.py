from asyncpg import Connection
from fastapi import HTTPException
from models import Coords, NodeType, ResourceNode


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
