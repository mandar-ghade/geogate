import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { Coords, ResourceNode } from "../types";
import { getResourceIcon, userIcon } from "../icons";
import { useEffect } from "react";
import 'leaflet/dist/leaflet.css';

async function copyCoordsToClipboard(coords: Coords) {
  const coordsMsg = `${coords.lat}, ${coords.lon}`;
  await navigator.clipboard.writeText(coordsMsg);
}

export function GameMap(props: {
  position: Coords, nodes: ResourceNode[]
}) {
  const { position, nodes } = props;

  return (
    <MapContainer
      className="h-full"
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
