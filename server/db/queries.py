from asyncpg import Connection
from models import NodeType, ResourceNode


async def get_nodes_within_radius(
    conn: Connection, latitude: float, longitude: float, radius: float
):
    """Radius is in meters."""
    query = """
    SELECT
        id,
        node_type,
        ST_Y(location::geometry) AS latitude,
        ST_X(location::geometry) AS longitude,
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
    # print(f"{latitude=}")
    # print(f"{longitude=}")
    # print(f"{radius=}")
    rows = await conn.fetch(query, longitude, latitude, radius)
    # print(rows)
    return [
        ResourceNode(
            id=row["id"],
            node_type=row["node_type"],
            lat=row["latitude"],
            lon=row["longitude"],
            # created_at=row["created_at"],
        )
        for row in rows
    ]


async def insert_resource_node(
    conn: Connection, node_type: NodeType, latitude: float, longitude: float
) -> int:
    """Inserts a new resource node into the database and
    returns the ID of the newly created resource node.
    """
    print(f"Inserted node at ({latitude}, {longitude})")
    query = """
    INSERT INTO resource_nodes (node_type, location)
    VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326))
    RETURNING id;
    """
    res = await conn.fetchval(query, node_type.value, longitude, latitude)
    if not isinstance(res, int):
        raise ValueError(f"Unexpected return on insertion: {res}")
    return res
