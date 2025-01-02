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

export default function App() {
  const { position: userPos } = useLocation();
  const [nodes, setNodes] = useState<ResourceNode[]>([]);

  async function loadResourceNodes() {
    if (!userPos) return;
    console.log(`Fetching coords ${userPos.lat}, ${userPos.lon}`);
    const newNodes = await fetchResourceNodes(userPos);
    if (!newNodes) {
      setNodes([]);
    } else {
      setNodes(newNodes);
    }
  }

  useEffect(() => {
    loadResourceNodes();
  }, [userPos]);


  if (!userPos) {
    return <h2>Locating Position...</h2>;
  }

  async function insertRandomNode() {
    if (userPos === null) return;
    const coords = getRandomCoordinates(userPos, 100);
    const nodeType = getRandomNodeType();
    console.log(`Creating a ${nodeType} node at (${coords.lat}, ${coords.lon})`);
    const nodeId = await insertResourceNode(coords, nodeType);
    if (nodeId === null) {
      console.error('No returned node id');
    } else {
      console.log(`Successfully inserted node (id: ${nodeId})`);
    }
  }

  return (
    <>
      <button onClick={insertRandomNode}>Generate New Node</button>
      <GameMap userPos={userPos} nodes={nodes} />
    </>
  );
}

async function copyCoordsToClipboard(coords: Coords) {
  const coordsMsg = `${coords.lat}, ${coords.lon}`;
  await navigator.clipboard.writeText(coordsMsg);
}

function GameMap(props: {
  userPos: Coords, nodes: ResourceNode[]
}) {
  const { userPos, nodes } = props;

  return (
    <MapContainer
      style={{height: "100vh"}}
      center={[userPos.lat, userPos.lon]}
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
      <MapUpdater center={userPos} />
      <Marker position={[userPos.lat, userPos.lon]} icon={userIcon}>
        <Popup>
          User<br/>
          lat: {userPos.lat.toFixed(5)}{" "}
          lon: {userPos.lon.toFixed(5)}
          <br/>
          <button onClick={async () => {
            await copyCoordsToClipboard(userPos);
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
