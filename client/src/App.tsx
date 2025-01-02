import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';
import { useEffect, useState } from 'react';
import { userIcon, getResourceIcon } from "./icons"
import { fetchResourceNodes, insertResourceNode } from './queries';
import { Coords, getRandomNodeType, ResourceNode } from "./types"

import 'leaflet/dist/leaflet.css';
import './App.css';
import { getRandomCoordinates } from './util';
import { useLocation } from './hooks/useLocation';
import { useResourceNodes } from './hooks/useResourceNodes';

export default function App() {
  const { position } = useLocation();
  const { nodes, refreshNodes } = useResourceNodes(position, {
    updateInterval: 5_000,
  });

  if (!position) {
    return <h2>Locating Position...</h2>;
  }

  async function insertRandomNode() {
    if (position === null) return;
    const coords = getRandomCoordinates(position, 100);
    const nodeType = getRandomNodeType();
    console.log(`Creating a ${nodeType} node at (${coords.lat}, ${coords.lon})`);
    const nodeId = await insertResourceNode(coords, nodeType);
    if (nodeId === null) {
      console.error('No returned node id');
    } else {
      console.log(`Successfully inserted node (id: ${nodeId})`);
      await refreshNodes();
    }
  }

  return (
    <>
      <button onClick={insertRandomNode}>Generate New Node</button>
      <GameMap position={position} nodes={nodes} />
    </>
  );
}

async function copyCoordsToClipboard(coords: Coords) {
  const coordsMsg = `${coords.lat}, ${coords.lon}`;
  await navigator.clipboard.writeText(coordsMsg);
}

function GameMap(props: {
  position: Coords, nodes: ResourceNode[]
}) {
  const { position, nodes } = props;

  return (
    <MapContainer
      style={{height: "100vh"}}
      center={[position.lat, position.lon]}
      zoom={17}
      dragging={false}
      zoomControl={false}
      doubleClickZoom={false}
      scrollWheelZoom={false}
      keyboard={false}
      boxZoom={false}
      touchZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater center={position} />
      <Marker position={[position.lat, position.lon]} icon={userIcon}>
        <Popup>
          User<br/>
          lat: {position.lat.toFixed(5)}{" "}
          lon: {position.lon.toFixed(5)}
          <br/>
          <button onClick={async () => {
            await copyCoordsToClipboard(position);
          }}>
            Copy to Clipboard
          </button>
        </Popup>
      </Marker>
      {nodes.map((node, idx) => (
        <Marker
          position={[node.coords.lat, node.coords.lon]}
          icon={getResourceIcon(node.nodeType)}
          key={idx}
        >
          <Popup>
            {node.nodeType}<br/>
            lat: {node.coords.lat.toFixed(5)}{" "}
            lon: {node.coords.lon.toFixed(5)}
            <br/>
            <button onClick={async () => {
              await copyCoordsToClipboard(node.coords);
            }}>
              Copy to Clipboard
            </button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

function MapUpdater({ center }: { center: Coords }) {
  const map = useMap(); // gets the closest parent <MapContainer />
  useEffect(() => {
    map.setView([center.lat, center.lon]);
  }, [center, map]);
  return null;
}
