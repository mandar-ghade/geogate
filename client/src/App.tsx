import { useLocation } from './hooks/useLocation';
import { useResourceNodes } from './hooks/useResourceNodes';
import { GenRandomNodeButton } from './components/GenRandomNodeButton';
import { GameMap } from './components/GameMap';
import './App.css';

export default function App() {
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
      <GameMap position={position} nodes={nodes} />
    </>
  );
}
