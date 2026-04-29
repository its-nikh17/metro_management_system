import { stations } from "../data/stations";
import { metroLines } from "../data/metroLines";

function haversineKm(a, b) {
  // Great-circle distance between two lat/lng points.
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);

  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

export function findShortestPath({ startStation, endStation }) {
  const stationToIndex = new Map(stations.map((s, i) => [s.name, i]));
  const startIndex = stationToIndex.get(startStation) ?? -1;
  const endIndex = stationToIndex.get(endStation) ?? -1;

  if (startIndex < 0 || endIndex < 0) return null;
  if (startIndex === endIndex) return { path: [startStation], stops: 0, distanceKm: 0, segments: [] };

  const lineCount = metroLines.length;
  const NONE_LINE = lineCount; // special line id for "no previous line"
  const STATE_LINE_COUNT = lineCount + 1;

  // Build graph adjacency from metroLines: consecutive stations in each line are connected.
  const adjacency = Array.from({ length: stations.length }, () => []);
  metroLines.forEach((line, lineIdx) => {
    for (let i = 0; i < line.stations.length - 1; i++) {
      const aName = line.stations[i];
      const bName = line.stations[i + 1];
      const aIdx = stationToIndex.get(aName);
      const bIdx = stationToIndex.get(bName);
      if (aIdx === undefined || bIdx === undefined) continue;

      // undirected edges
      adjacency[aIdx].push({ to: bIdx, lineIdx });
      adjacency[bIdx].push({ to: aIdx, lineIdx });
    }
  });

  // Dijkstra over (station, currentLineUsedToArrive).
  // Cost model: minimize number of stops primarily; line switches are not penalized.
  const BASE_STOP_COST = 1000;
  const dist = Array(stations.length * STATE_LINE_COUNT).fill(Number.POSITIVE_INFINITY);
  const prevState = Array(stations.length * STATE_LINE_COUNT).fill(-1);
  const visited = Array(stations.length * STATE_LINE_COUNT).fill(false);

  const startState = startIndex * STATE_LINE_COUNT + NONE_LINE;
  dist[startState] = 0;

  const pickNextState = () => {
    let bestState = -1;
    let best = Number.POSITIVE_INFINITY;
    for (let s = 0; s < dist.length; s++) {
      if (!visited[s] && dist[s] < best) {
        best = dist[s];
        bestState = s;
      }
    }
    return bestState;
  };

  const stateToStation = (stateKey) => Math.floor(stateKey / STATE_LINE_COUNT);
  const stateToLine = (stateKey) => stateKey % STATE_LINE_COUNT;

  let endState = -1;
  for (let iter = 0; iter < dist.length; iter++) {
    const uState = pickNextState();
    if (uState === -1) break;

    visited[uState] = true;
    const uStation = stateToStation(uState);
    if (uStation === endIndex) {
      endState = uState;
      break;
    }

    const uLineIdx = stateToLine(uState);
    for (const edge of adjacency[uStation]) {
      const vStation = edge.to;
      const vLineIdx = edge.lineIdx;
      const vState = vStation * STATE_LINE_COUNT + vLineIdx;

      // One edge == one stop.
      const transferCost = uLineIdx !== NONE_LINE && uLineIdx !== vLineIdx ? 0 : 0; // keep 0 to prioritize "fewest stops"
      const alt = dist[uState] + BASE_STOP_COST + transferCost;
      if (alt < dist[vState]) {
        dist[vState] = alt;
        prevState[vState] = uState;
      }
    }
  }

  if (endState === -1) return null;

  // Reconstruct state path.
  const states = [];
  for (let cur = endState; cur !== -1; cur = prevState[cur]) states.push(cur);
  states.reverse();

  const pathIndices = states.map((s) => stateToStation(s));
  const path = pathIndices.map((i) => stations[i].name);

  // Compute approximate distance along the station sequence.
  let distanceKm = 0;
  for (let i = 0; i < pathIndices.length - 1; i++) {
    const a = stations[pathIndices[i]];
    const b = stations[pathIndices[i + 1]];
    distanceKm += haversineKm(a, b);
  }

  // Build line-colored route segments based on which line was used for each edge.
  const segments = [];
  if (pathIndices.length > 1) {
    const edgesCount = states.length - 1;
    let currentLineIdx = stateToLine(states[1]); // line used for edge into states[1]
    let segmentStations = [stations[pathIndices[0]].name];

    for (let i = 1; i <= edgesCount; i++) {
      const edgeLineIdx = stateToLine(states[i]); // line used for edge from i-1 to i

      if (edgeLineIdx !== currentLineIdx) {
        const line = metroLines[currentLineIdx];
        segments.push({
          lineId: line.id,
          lineName: line.name,
          color: line.color,
          stations: segmentStations,
        });
        // Start new segment at the transfer station (which is the previous station in the path).
        segmentStations = [stations[pathIndices[i - 1]].name];
        currentLineIdx = edgeLineIdx;
      }

      segmentStations.push(stations[pathIndices[i]].name);
    }

    const lastLine = metroLines[currentLineIdx];
    segments.push({
      lineId: lastLine.id,
      lineName: lastLine.name,
      color: lastLine.color,
      stations: segmentStations,
    });
  }

  return { path, stops: path.length - 1, distanceKm: Number(distanceKm.toFixed(2)), segments };
}

