import { Icon } from "leaflet";
import { NodeType } from "./types";

// https://www.flaticon.com/free-icon/rhombus_10239023?term=diamond+shape&page=1&position=25&origin=search&related_id=10239023
export const userIcon = new Icon({
  iconUrl: "/icons/diamond.png",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  className: "cursor-default",
});

// https://www.flaticon.com/free-icon/pine-tree_3575006?term=tree&page=1&position=53&origin=search&related_id=3575006
export const treeNodeIcon = new Icon({
  iconUrl: "/icons/pine-tree.png",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  className: "cursor-default",
});

// https://www.flaticon.com/free-icon/stone_7996088?term=rock&page=1&position=5&origin=search&related_id=7996088
export const stoneNodeIcon = new Icon({
  iconUrl: "/icons/stone.png",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  className: "cursor-default",
});

// https://www.flaticon.com/free-icon/ore_8235456?term=ore&page=1&position=3&origin=search&related_id=8235456
export const copperNodeIcon = new Icon({
  iconUrl: "/icons/copper-ore.png",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  className: "cursor-default",
});

// https://www.flaticon.com/free-icon/ore_9410491?term=ore&page=1&position=12&origin=search&related_id=9410491
export const ironNodeIcon = new Icon({
  iconUrl: "/icons/iron-ore.png",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  className: "cursor-default",
});

export function getResourceIcon(nodeType: NodeType) {
  switch (nodeType) {
    case NodeType.TREE:
      return treeNodeIcon;
    case NodeType.ROCK_BASIC:
      return stoneNodeIcon;
    case NodeType.ROCK_COPPER:
      return copperNodeIcon;
    case NodeType.ROCK_IRON:
      return ironNodeIcon;
  }
}

