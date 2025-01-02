import { useCallback, useEffect, useState } from "react";
import { Coords, ResourceNode } from "../types";
import { fetchResourceNodes } from "../queries";

type UseResourceNodesOptions = {
  updateInterval?: number, // in milliseconds
  enableAutoUpdate?: boolean,
}

export function useResourceNodes(
  userPos: Coords | null,
  options: UseResourceNodesOptions = {}
) {
  const {
    updateInterval = 5_000, // default to 5 seconds
    enableAutoUpdate = true, // update with given interval
  } = options;

  const [nodes, setNodes] = useState<ResourceNode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadResourceNodes = useCallback(async () => {
    if (!userPos) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching coords ${userPos.lat}, ${userPos.lon}`);
      const newNodes = await fetchResourceNodes(userPos);
      setNodes(newNodes || []);
    } catch (err) {
      console.error('Error fetching resource nodes:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch nodes'));
      setNodes([]);
    } finally {
      setIsLoading(false);
    }
  }, [userPos]);

  // Initial load
  useEffect(() => {
    loadResourceNodes();
  }, [loadResourceNodes]);

  // Auto updates
  useEffect(() => {
    if (!enableAutoUpdate) return;

    const intervalId = setInterval(() => {
      loadResourceNodes();
    }, updateInterval);

    return () => clearInterval(intervalId);
  }, [loadResourceNodes, updateInterval, enableAutoUpdate]);

  return { 
    nodes, 
    isLoading, 
    error, 
    refreshNodes: loadResourceNodes 
  };
}
