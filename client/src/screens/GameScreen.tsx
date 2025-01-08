import { GameMap } from "../components/GameMap";
import { GenRandomNodeButton } from "../components/GenRandomNodeButton";
import { useLocation } from "../hooks/useLocation";
import { useResourceNodes } from "../hooks/useResourceNodes";
import { ScreenHandler } from "../types";


export function GameScreen({ setScreen }: { setScreen: ScreenHandler }) {
  const { position } = useLocation();
  const { nodes, refreshNodes } = useResourceNodes(position, {
    updateInterval: 5_000,
  });

  if (!position) {
    return <h2 className="text-xl font-bold m-2">Locating Position...</h2>;
  }

  return (
    <>
      <div className="flex flex-row gap-1 m-1">
        <GenRandomNodeButton position={position} refreshNodes={refreshNodes} />
        <button
          className="bg-zinc-600 px-4 py-1 rounded"
          onClick={() => setScreen("login")}
        >
          Logout
        </button>
      </div>
      <GameMap position={position} nodes={nodes} />
    </>
  );
}
