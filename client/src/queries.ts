import { NodeType, ResourceNode } from "./types";

export async function fetchResourceNodes(
  lat: number, lon: number,
): Promise<ResourceNode[] | null> {
  const url = `http://localhost:8000/api/nodes?lat=${lat}&lon=${lon}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch resource nodes: ${response.statusText}`);
    }
    const data: ResourceNode[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching resource nodes:", error);
    return null;
  }
};

export async function insertResourceNode(
  lat: number,
  lon: number,
  nodeType: NodeType,
): Promise<number | null> {
  const url = `http://localhost:8000/api/nodes`;
  const body = JSON.stringify({ lat, lon, nodeType });
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
    if (!response.ok) {
      throw new Error(`Failed to insert resource node: ${response.statusText}`);
    }
    const data: { id: number } = await response.json();
    return data.id;
  } catch (error) {
    console.error("Error inserting resource node:", error);
    return null;
  }
}
