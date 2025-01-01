import { ResourceNode } from "./types";

export async function fetchResourceNodes(
  lat: number, lon: number,
): Promise<ResourceNode[]> {
  const url = `http://localhost:8000/api/nodes?lat=${lat}&lon=${lon}&radius=${100}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch resource nodes: ${response.statusText}`);
    }
    const data: ResourceNode[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching resource nodes:", error);
    return [];
  }
};

