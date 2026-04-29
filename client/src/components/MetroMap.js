import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { stations } from "../data/stations";
import { metroLines } from "../data/metroLines";
import "leaflet/dist/leaflet.css";

export default function MetroMap({ startStation, endStation, routeStationNames, routeSegments }) {
  const startIndex = stations.findIndex((item) => item.name === startStation);
  const endIndex = stations.findIndex((item) => item.name === endStation);

  const routeStations =
    routeStationNames && routeStationNames.length >= 2
      ? routeStationNames
          .map((name) => stations.find((s) => s.name === name))
          .filter(Boolean)
      : startIndex >= 0 && endIndex >= 0
      ? stations.slice(Math.min(startIndex, endIndex), Math.max(startIndex, endIndex) + 1)
      : stations;

  const polyline = routeStations.map((station) => [station.lat, station.lng]);
  const routeStationSet = new Set(routeStations.map((s) => s.name));

  const makeStationIcon = (kind) => {
    const html = `<div class="station-dot station-dot--${kind}"></div>`;
    return L.divIcon({
      className: "station-marker",
      html,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
      popupAnchor: [0, -10],
    });
  };

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

          {/* Draw the metro network lines in different colors (background). */}
          {metroLines.map((line) => {
            const lineStations = line.stations
              .map((name) => stations.find((s) => s.name === name))
              .filter(Boolean);
            if (lineStations.length < 2) return null;

            return (
              <Polyline
                key={line.id}
                positions={lineStations.map((s) => [s.lat, s.lng])}
                pathOptions={{ color: line.color, weight: 4, opacity: 0.28 }}
              />
            );
          })}

          {stations.map((station) => (
            <Marker
              key={station.name}
              position={[station.lat, station.lng]}
              icon={makeStationIcon(
                station.name === startStation ? "start" : station.name === endStation ? "end" : routeStationSet.has(station.name) ? "route" : "base"
              )}
            >
              <Popup>{station.name}</Popup>
            </Marker>
          ))}

          {/* Route highlight: if shortest-path segments are available, draw them per line color. */}
          {routeSegments && routeSegments.length ? (
            routeSegments.map((seg, idx) => {
              const segStations = seg.stations
                .map((name) => stations.find((s) => s.name === name))
                .filter(Boolean);
              if (segStations.length < 2) return null;
              return (
                <Polyline
                  key={`${seg.lineId}-${idx}`}
                  positions={segStations.map((s) => [s.lat, s.lng])}
                  pathOptions={{ color: seg.color || "#49a6ff", weight: 6, opacity: 0.95 }}
                />
              );
            })
          ) : (
            <Polyline positions={polyline} pathOptions={{ color: "#49a6ff", weight: 5 }} />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
