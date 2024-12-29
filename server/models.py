from enum import Enum
from pydantic import BaseModel, Field
from util import to_camel_case

class NodeType(str, Enum):
    TREE = "tree"
    ROCK_BASIC = "rockBasic"
    ROCK_COPPER = "rockCopper"
    ROCK_IRON = "rockIron"


NODE_TYPE_WEIGHTS = {
    NodeType.TREE: 100,
    NodeType.ROCK_BASIC: 40,
    NodeType.ROCK_COPPER: 25,
    NodeType.ROCK_IRON: 15,
}


class ResourceNode(BaseModel):
    id: int
    node_type: NodeType
    lat: float = Field(ge=-90, le=90)  # -90 <= lat <= 90
    lon: float = Field(ge=-180, le=180)  # -180 <= lon <= 180

    class Config:
        alias_generator = to_camel_case
        populate_by_name = True
