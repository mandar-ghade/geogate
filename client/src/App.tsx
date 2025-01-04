import { useState } from "react";
import { Screen } from "./types";
import { MapScreen } from "./screens/MapScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { RegisterScreen } from "./screens/RegisterScreen";
import "./App.css";

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");

  if (screen === "register") {
    return <RegisterScreen setScreen={setScreen}/>;
  }

  if (screen === "login") {
    return <LoginScreen setScreen={setScreen}/>;
  }

  if (screen === "game") {
    return <MapScreen setScreen={setScreen} />;
  }
}
