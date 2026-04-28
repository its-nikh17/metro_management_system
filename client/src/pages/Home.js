import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <section className="grid">
      <div className="card hero">
        <img
          className="feature-img"
          src="https://cdn-icons-png.flaticon.com/512/2972/2972185.png"
          alt="Metro train"
        />
        <h1>Delhi Metro, now smarter and faster</h1>
        <p className="muted">
          Book tickets, track Delhi routes on a real map, check timings, and manage your metro
          profile from one modern dashboard.
        </p>
        <div style={{ display: "flex", gap: "0.7rem", marginTop: "1rem" }}>
          <button type="button" className="btn btn-primary" onClick={() => navigate("/signup")}>
            Create Account
          </button>
          <button type="button" className="btn btn-outline" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </div>
      <div className="grid grid-2">
        <div className="card">
          <img
            className="icon-img"
            src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
            alt="Route map pin"
          />
          <h3>Delhi Route Map</h3>
          <p className="muted">Live OpenStreetMap with Delhi Metro route highlighting.</p>
        </div>
        <div className="card">
          <img
            className="icon-img"
            src="https://cdn-icons-png.flaticon.com/512/633/633611.png"
            alt="Ticket icon"
          />
          <h3>Ticket History</h3>
          <p className="muted">View your latest and past bookings with fares and time details.</p>
        </div>
      </div>
    </section>
  );
}
