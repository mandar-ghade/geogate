import { useState } from "react";
import { ScreenHandler } from "../types";

export function LoginScreen({ setScreen }: { setScreen: ScreenHandler }) {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",  // Important for cookies
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }

      setScreen("game");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
      <h2 className="text-lg font-bold">Login:</h2>
      
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <input
        type="text"
        placeholder="username"
        value={formData.username}
        onChange={(e) => {
          setFormData(prev => ({ ...prev, username: e.target.value }));
        }}
        className="px-2 py-1 rounded text-zinc-800"
        required
      />
      <input
        type="password"
        placeholder="password"
        value={formData.password}
        onChange={(e) => {
          setFormData(prev => ({ ...prev, password: e.target.value }));
        }}
        className="px-2 py-1 rounded text-zinc-800"
        required
      />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-zinc-600 px-4 py-1 rounded hover:bg-zinc-500 disabled:opacity-50"
      >
        {isLoading ? "Loading..." : "Login"}
      </button>
      
      <button
        type="button"
        onClick={() => setScreen("register")}
        className="text-sm text-zinc-400 hover:text-zinc-300"
      >
        Need an account? Register
      </button>
    </form>
  );
}
