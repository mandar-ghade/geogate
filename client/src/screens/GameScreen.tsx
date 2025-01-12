import { GameMap } from "../components/GameMap";
import { GenRandomNodeButton } from "../components/GenRandomNodeButton";
import { useLocation } from "../hooks/useLocation";
import { useResourceNodes } from "../hooks/useResourceNodes";
import { useUserStore } from "../stores/userStore";
import { ScreenHandler } from "../types";


export function GameScreen({ setScreen }: { setScreen: ScreenHandler }) {
  const { position } = useLocation();
  const { nodes, refreshNodes } = useResourceNodes(position, {
    updateInterval: 5_000,
  });

  const username = useUserStore((state) => state.username);
  const setUsername = useUserStore((state) => state.setUsername);
  if (!username) {
    console.error("Username not valid while GameScreen is active");
    setScreen("login");
  }

  if (!position) {
    return <h2 className="text-xl font-bold m-2">Locating Position...</h2>;
  }

  return (
    <>
      <div className="flex flex-row gap-1 m-1">
        <GenRandomNodeButton position={position} refreshNodes={refreshNodes} />
        <button
          className="bg-zinc-600 px-4 py-1 rounded hover:bg-zinc-500"
          onClick={() => {
            setUsername(null);
            setScreen("login");
          }}
        >
          Logout
        </button>
        {/* User label for development */}
        <p className="p-1 text-zinc-400">
          User: {username ? username : "No user"}
        </p>
      </div>
      <GameMap position={position} nodes={nodes} />
    </>
  );
}
