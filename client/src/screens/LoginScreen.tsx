import { ScreenHandler } from "../types";

export function LoginScreen({ setScreen }: { setScreen: ScreenHandler }) {
  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "10px"}}>
      <h2 style={{marginBottom: 0}}>Login:</h2>
      <input type="text" placeholder="user"/>
      <input type="text" placeholder="password"/>
      <button onClick={() => setScreen("game")}>Submit</button>
      <button onClick={() => setScreen("register")}>Create Account</button>
    </div>
  );
}
