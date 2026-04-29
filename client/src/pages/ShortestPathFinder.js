import { useMemo, useState } from "react";
import { stationNames } from "../data/stations";
import MetroMap from "../components/MetroMap";
import { findShortestPath } from "../lib/shortestPath";

export default function ShortestPathFinder() {
  const initialStart = stationNames[0];
  const initialEnd = stationNames[1];

  const initialRoute =
    findShortestPath({ startStation: initialStart, endStation: initialEnd }) || {
      path: [],
      stops: 0,
      distanceKm: 0,
      segments: [],
    };

  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(initialEnd);
  const [error, setError] = useState("");
  const [route, setRoute] = useState(initialRoute);

  const startEndInvalid = useMemo(() => start === end, [start, end]);

  const calculate = (event) => {
    event.preventDefault();
    setError("");

    if (startEndInvalid) {
      setError("Start and destination cannot be the same.");
      return;
    }

    const result = findShortestPath({ startStation: start, endStation: end });
    if (!result) {
      setError("No route found between these stations.");
      setRoute({ path: [], stops: 0, distanceKm: 0, segments: [] });
      return;
    }

    setRoute(result);
  };

  return (
    <section className="grid grid-2">
      <div className="card">
        <h2>Shortest Path Finder</h2>
        <p className="muted">Find the shortest route between two Delhi Metro stations.</p>

        <form className="form" onSubmit={calculate}>
          <select value={start} onChange={(event) => setStart(event.target.value)}>
            {stationNames.map((station) => (
              <option key={station} value={station}>
                {station}
              </option>
            ))}
          </select>

          <select value={end} onChange={(event) => setEnd(event.target.value)}>
            {stationNames.map((station) => (
              <option key={station} value={station}>
                {station}
              </option>
            ))}
          </select>

          <button className="btn btn-primary" type="submit">
            Find Route
          </button>

          {error ? <p style={{ color: "var(--danger)" }}>{error}</p> : null}
        </form>

        {route.path.length ? (
          <div style={{ marginTop: "1rem" }}>
            <div className="ticket-block">
              <strong>Route ({route.stops} stops)</strong>
              <p className="muted">Approx distance: {route.distanceKm} km</p>
              <p className="muted">
                {route.path.join(" → ")}
              </p>
            </div>

            {route.segments && route.segments.length ? (
              <div style={{ marginTop: "0.75rem" }}>
                <h4 style={{ margin: "0 0 0.5rem 0" }}>Line segments</h4>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {route.segments.map((seg, idx) => (
                    <span
                      key={`${seg.lineId}-${idx}`}
                      style={{
                        border: `1px solid ${seg.color || "#49a6ff"}`,
                        background: "rgba(0,0,0,0.12)",
                        padding: "0.35rem 0.55rem",
                        borderRadius: "999px",
                        color: "var(--text)",
                        fontWeight: 600,
                      }}
                    >
                      <span style={{ color: seg.color || "#49a6ff" }}>{seg.lineName}</span>
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div style={{ marginTop: "1rem" }}>
            <p className="muted">Select stations and click “Find Route”.</p>
          </div>
        )}
      </div>

      <MetroMap
        startStation={start}
        endStation={end}
        routeStationNames={route.path}
        routeSegments={route.segments}
      />
    </section>
  );
}

