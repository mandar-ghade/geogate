import { ScreenHandler } from "../types";

export function RegisterScreen({ setScreen }: { setScreen: ScreenHandler }) {
  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "10px"}}>
      <h2 style={{marginBottom: 0}}>Register:</h2>
      <input type="text" placeholder="user"/>
      <input type="text" placeholder="password"/>
      <button onClick={() => setScreen("login")}>Submit</button>
    </div>
  );
}
