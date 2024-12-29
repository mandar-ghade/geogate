from asyncpg import Pool
from models import ResourceNode


async def get_nodes_within_radius(
    pool: Pool, latitude: float, longitude: float, radius: float
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
    async with pool.acquire() as conn:
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
