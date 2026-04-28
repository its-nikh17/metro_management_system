import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MetroMap from "../components/MetroMap";
import { stationNames } from "../data/stations";
import api from "../lib/api";

export default function Ticketbook() {
  const [start, setStart] = useState(stationNames[0]);
  const [end, setEnd] = useState(stationNames[1]);
  const [number, setNumber] = useState(1);
  const [tripType, setTripType] = useState("single");
  const [fareMode, setFareMode] = useState("token");
  const [travelSlot, setTravelSlot] = useState("regular");
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("favoriteRoutesDelhi");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const fareSummary = useMemo(() => {
    const startIndex = stationNames.indexOf(start);
    const endIndex = stationNames.indexOf(end);
    if (startIndex < 0 || endIndex < 0 || startIndex === endIndex) {
      return { fare: 0, stations: 0, co2SavedKg: 0 };
    }
    const stationsCovered = Math.abs(startIndex - endIndex);
    const baseFare = stationsCovered * 12 * Number(number);
    const tripMultiplier = tripType === "return" ? 1.8 : 1;
    const modeMultiplier = fareMode === "smartcard" ? 0.9 : 1;
    const slotMultiplier = travelSlot === "peak" ? 1.15 : travelSlot === "offpeak" ? 0.9 : 1;
    const totalFare = Math.round(baseFare * tripMultiplier * modeMultiplier * slotMultiplier);
    const co2SavedKg = ((stationsCovered * 0.09 * Number(number)) / 1).toFixed(2);
    return { fare: totalFare, stations: stationsCovered, co2SavedKg };
  }, [start, end, number, tripType, fareMode, travelSlot]);

  const saveFavoriteRoute = () => {
    const key = `${start}->${end}`;
    const alreadyExists = favorites.some((item) => item.key === key);
    if (alreadyExists) {
      return;
    }
    const updated = [{ key, start, end }, ...favorites].slice(0, 5);
    setFavorites(updated);
    localStorage.setItem("favoriteRoutesDelhi", JSON.stringify(updated));
  };

  const submitTicket = async (event) => {
    event.preventDefault();
    setError("");
    if (start === end) {
      setError("Start and destination cannot be the same.");
      return;
    }
    try {
      await api.post("/tickets/book", { start, end, number, fare: fareSummary.fare });
      navigate("/payment");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to create ticket");
    }
  };

  return (
    <section className="grid grid-2">
      <div className="card">
        <h2>Book Metro Ticket</h2>
        <p className="muted">Select Delhi route and get smart fare recommendations instantly.</p>
        <form className="form" onSubmit={submitTicket}>
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
          <input
            type="number"
            min="1"
            max="30"
            value={number}
            onChange={(event) => setNumber(event.target.value)}
            placeholder="Number of Tickets"
            required
          />
          <div className="grid grid-2">
            <select value={tripType} onChange={(event) => setTripType(event.target.value)}>
              <option value="single">Single Journey</option>
              <option value="return">Return Journey</option>
            </select>
            <select value={fareMode} onChange={(event) => setFareMode(event.target.value)}>
              <option value="token">Token Fare</option>
              <option value="smartcard">Smart Card (10% discount)</option>
            </select>
          </div>
          <select value={travelSlot} onChange={(event) => setTravelSlot(event.target.value)}>
            <option value="regular">Regular Time</option>
            <option value="peak">Peak Hours (+15%)</option>
            <option value="offpeak">Off Peak (-10%)</option>
          </select>
          <div className="ticket-block">
            <strong>Estimated Fare: Rs. {fareSummary.fare}</strong>
            <p className="muted">Stations covered: {fareSummary.stations}</p>
            <p className="muted">Trip type: {tripType === "single" ? "Single" : "Return"}</p>
            <p className="muted">Estimated CO2 saved vs car: {fareSummary.co2SavedKg} kg</p>
          </div>
          <button className="btn btn-outline" type="button" onClick={saveFavoriteRoute}>
            Save Route as Favorite
          </button>
          <button className="btn btn-primary" type="submit">
            Generate Ticket
          </button>
          {error ? <p style={{ color: "var(--danger)" }}>{error}</p> : null}
        </form>
        {favorites.length ? (
          <div style={{ marginTop: "1rem" }}>
            <h4>Favorite Routes</h4>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {favorites.map((route) => (
                <button
                  key={route.key}
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setStart(route.start);
                    setEnd(route.end);
                  }}
                >
                  {route.start} -> {route.end}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <MetroMap startStation={start} endStation={end} />
    </section>
  );
}
