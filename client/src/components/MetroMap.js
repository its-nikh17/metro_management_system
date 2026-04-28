import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import { stations } from "../data/stations";
import "leaflet/dist/leaflet.css";

export default function MetroMap({ startStation, endStation }) {
  const startIndex = stations.findIndex((item) => item.name === startStation);
  const endIndex = stations.findIndex((item) => item.name === endStation);

  const routeStations =
    startIndex >= 0 && endIndex >= 0
      ? stations.slice(Math.min(startIndex, endIndex), Math.max(startIndex, endIndex) + 1)
      : stations;

  const polyline = routeStations.map((station) => [station.lat, station.lng]);

  return (
    <div className="card">
      <h3>Live Metro Route Map</h3>
      <p className="muted">
        Delhi Metro interactive map with selected route highlighting.
      </p>
      <div style={{ height: "340px", borderRadius: "12px", overflow: "hidden" }}>
        <MapContainer center={[28.6139, 77.209]} zoom={11} scrollWheelZoom style={{ height: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {stations.map((station) => (
            <Marker key={station.name} position={[station.lat, station.lng]}>
              <Popup>{station.name}</Popup>
            </Marker>
          ))}
          <Polyline positions={polyline} pathOptions={{ color: "#49a6ff", weight: 5 }} />
        </MapContainer>
      </div>
    </div>
  );
}
