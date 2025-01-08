import { ScreenHandler } from "../types";

export function LoginScreen({ setScreen }: { setScreen: ScreenHandler }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <h2 className="text-lg font-bold">Login:</h2>
      <input
        type="text" placeholder="user"
        className="px-2 py-1 rounded"
      />
      <input
        type="text" placeholder="password"
        className="px-2 py-1 rounded"
      />
      <button
        className="bg-zinc-600 px-4 py-1 rounded"
        onClick={() => setScreen("game")}
      >
        Submit
      </button>
      <button
        className="bg-zinc-600 px-4 py-1 rounded"
        onClick={() => setScreen("register")}
      >
        Create Account
      </button>
    </div>
  );
}
