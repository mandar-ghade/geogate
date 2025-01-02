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
import { getRandomNodeType, ResourceNode } from "./types"

import 'leaflet/dist/leaflet.css';
import './App.css';
import { getRandomCoordinates } from './util';

export default function App() {
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [nodes, setNodes] = useState<ResourceNode[]>([]);

  async function loadResourceNodes() {
      if (!userPos) return;
      const [lat, lon] = userPos;
      console.log(`Fetching coords ${lat}, ${lon}`);
      const newNodes = await fetchResourceNodes(lat, lon);
      if (!newNodes) {
        setNodes([]);
      } else {
        setNodes(newNodes);
      }
  }

  useEffect(() => {
    loadResourceNodes();
  }, [userPos]);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        console.log("User location:", [pos.coords.latitude,
                                       pos.coords.longitude])
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
      },
      (error) => {
        console.error("Geolocation error:", error);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 },
    );

    return () => navigator.geolocation.clearWatch(watchId); // cleanup
  }, []);

  if (!userPos) {
    return <h2>Locating Position...</h2>;
  }

  async function insertRandomNode() {
    if (userPos === null) return;
    const { lat, lon } = getRandomCoordinates(...userPos, 100);
    const nodeType = getRandomNodeType();
    console.log(`Creating a ${nodeType} node at (${lat}, ${lon})`);
    const newNodeId = await insertResourceNode(lat, lon, nodeType);
    if (newNodeId === null) {
      console.error('No returned node id');
    } else {
      console.log(`Successfully inserted node (id: ${newNodeId})`);
    }
  }

  return (
    <>
      <button onClick={insertRandomNode}>Generate New Node</button>
      <GameMap userPos={userPos} nodes={nodes} />
    </>
  );
}

async function copyCoordsToClipboard(lat: number, lon: number) {
  const coordsMsg = `${lat}, ${lon}`;
  await navigator.clipboard.writeText(coordsMsg);
}

function GameMap(props: {
  userPos: [number, number],
  nodes: ResourceNode[],
}) {
  const { userPos, nodes } = props;
  // console.log("userPos:", userPos);
  return (
    <MapContainer
      style={{height: "100vh"}}
      center={userPos}
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
      <Marker position={userPos} icon={userIcon}>
        <Popup>
          User<br/>
          lat: {userPos[0].toFixed(5)}{" "}
          lon: {userPos[1].toFixed(5)}
          <br/>
          <button onClick={async () => {
            await copyCoordsToClipboard(userPos[0], userPos[1]);
          }}>
            Copy to Clipboard
          </button>
        </Popup>
      </Marker>
      {nodes.map((node, idx) => (
        <Marker
          position={[node.lat, node.lon]}
          icon={getResourceIcon(node.nodeType)}
          key={idx}
        >
          <Popup>
            {node.nodeType}<br/>
            lat: {node.lat.toFixed(5)}{" "}
            lon: {node.lon.toFixed(5)}
            <br/>
            <button onClick={async () => {
              await copyCoordsToClipboard(node.lat, node.lon);
            }}>
              Copy to Clipboard
            </button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap(); // gets the closest parent <MapContainer />
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}
