import { insertResourceNode } from "../queries";
import { Coords, getRandomNodeType } from "../types";
import { getRandomCoordinates } from "../util";

export function GenRandomNodeButton({ position, refreshNodes }: {
  position: Coords,
  refreshNodes: () => Promise<void>,
}) {
  async function insertRandomNode() {
    if (position === null) return;
    const radius = 200 // meters
    const coords = getRandomCoordinates(position, radius);
    const nodeType = getRandomNodeType();
    console.log(`Creating a ${nodeType} node at (${coords.lat}, ${coords.lon})`);
    const nodeId = await insertResourceNode(coords, nodeType);
    if (nodeId === null) {
      console.error('No returned node id');
    } else {
      console.log(`Successfully inserted node (id: ${nodeId})`);
      await refreshNodes();
    }
  }

  return (
      <button
        className="border border-black px-4 py-1 rounded"
        onClick={insertRandomNode}
      >
        Generate New Node
      </button>
  );
}
