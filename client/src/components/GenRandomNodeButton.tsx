import { insertResourceNode } from "../queries";
import { useUserStore } from "../stores/userStore";
import { getRandomNodeType } from "../types";
import { getRandomCoordinates } from "../util";

export function GenRandomNodeButton({ refreshNodes }: {
  refreshNodes: () => Promise<void>,
}) {
  const position = useUserStore((store) => store.position);

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
        className="bg-zinc-600 px-4 py-1 rounded hover:bg-zinc-500"
        onClick={insertRandomNode}
      >
        Generate New Node
      </button>
  );
}
