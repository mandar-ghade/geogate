import { useUserStore } from "../stores/userStore";
import { ScreenHandler } from "../types";

export function LogoutButton({ setScreen }: { setScreen: ScreenHandler }) {
  const resetUser = useUserStore((store) => store.reset);

  async function handleLogout() {
    try {
      const response = await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        credentials: "include", // Include session_token cookie
      });
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      // Reset app state
      resetUser();
      setScreen("login");
      console.log("Logged out successfully");
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  return (
    <button
      className="bg-zinc-600 px-4 py-1 rounded hover:bg-zinc-500"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}
