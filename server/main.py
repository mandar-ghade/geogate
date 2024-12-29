import random
from fastapi import FastAPI
from models import NodeType, ResourceNode, NODE_TYPE_WEIGHTS
from middleware import init_middleware

app = FastAPI()
init_middleware(app)


def get_random_node_type() -> NodeType:
    types = list(NODE_TYPE_WEIGHTS.keys())
    weights = list(NODE_TYPE_WEIGHTS.values())
    return random.choices(types, weights=weights, k=1)[0]


@app.get("/api")
async def get_root():
    return {"message": "This is an API"}


@app.get("/api/nodes")
async def get_nodes(lat: float, lon: float, radius: float) -> list[ResourceNode]:
    # Convert from meters to degrees latitude/longitude
    lat_offset = radius / 111_111
    lon_offset = radius / 111_321
    # Mock data
    return [
        ResourceNode(
            id=int(random.randint(0, 1000000)),
            node_type=get_random_node_type(),
            lat=lat + lat_offset*(random.random()-0.5)*2,
            lon=lon + lon_offset*(random.random()-0.5)*2,
        )
        for _ in range(10)
    ]
