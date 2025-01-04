import { GameMap } from "../components/GameMap";
import { GenRandomNodeButton } from "../components/GenRandomNodeButton";
import { useLocation } from "../hooks/useLocation";
import { useResourceNodes } from "../hooks/useResourceNodes";
import { ScreenHandler } from "../types";


export function MapScreen({ setScreen }: { setScreen: ScreenHandler }) {
  const { position } = useLocation();
  const { nodes, refreshNodes } = useResourceNodes(position, {
    updateInterval: 5_000,
  });

  if (!position) {
    return <h2>Locating Position...</h2>;
  }

  return (
    <>
      <GenRandomNodeButton position={position} refreshNodes={refreshNodes} />
      <button onClick={() => setScreen("login")}>Logout</button>
      <GameMap position={position} nodes={nodes} />
    </>
  );
}
