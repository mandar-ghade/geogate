import { useEffect } from "react";
import { GameMap } from "../components/GameMap";
import { GenRandomNodeButton } from "../components/GenRandomNodeButton";
import { useLocation } from "../hooks/useLocation";
import { useUserStore } from "../stores/userStore";
import { ScreenHandler } from "../types";
import { useNodeStore } from "../stores/nodeStore";
import { LogoutButton } from "../components/LogoutButton";


export function GameScreen({ setScreen }: { setScreen: ScreenHandler }) {
  const { position } = useLocation();

  const username = useUserStore((state) => state.username);
  const userId = useUserStore((state) => state.userId);
  const setPosition = useUserStore((state) => state.setPosition);

  const fetchNodes = useNodeStore((state) => state.fetchNodes);

  if (!username) {
    console.error("Username not valid while GameScreen is active");
    setScreen("login");
  }

  // Update stored position when position changes
  useEffect(() => {
    // Don't update if it wasn't null and is now?
    setPosition(position);
  }, [position, setPosition]);

  // Fetch nodes when position changes (this effectively is a timer)
  useEffect(() => {
    fetchNodes(position);
  }, [position, fetchNodes]);

  if (!position) {
    return <h2 className="text-xl font-bold m-2">Locating Position...</h2>;
  }

  return (
    <>
      <div className="flex flex-row gap-1 m-1">
        <GenRandomNodeButton />
        <LogoutButton setScreen={setScreen} />
        {/* User label for development */}
        <p className="p-1 text-zinc-400">
          User: {username ? username : "No user"} ({userId ? userId : "No id"})
        </p>
      </div>
      <GameMap />
    </>
  );
}
