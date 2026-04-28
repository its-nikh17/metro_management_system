import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function Mvt() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBookings: 0,
    spent: 0,
    latestRoute: "No bookings yet",
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await api.get("/auth/history");
        const tickets = response.data.tickets || [];
        const spent = tickets.reduce((sum, ticket) => sum + Number(ticket.fare || 0), 0);
        const latest = tickets[0];
        setStats({
          totalBookings: tickets.length,
          spent,
          latestRoute: latest ? `${latest.startroute} → ${latest.destination}` : "No bookings yet",
        });
      } catch (error) {
        setStats({ totalBookings: 0, spent: 0, latestRoute: "No bookings yet" });
      }
    };
    loadStats();
  }, []);

  return (
    <section className="grid">
      <div className="card">
        <img
          className="feature-img"
          src="https://cdn-icons-png.flaticon.com/512/2784/2784445.png"
          alt="Delhi metro dashboard"
        />
        <h2>Welcome, {localStorage.getItem("name") || "Passenger"}</h2>
        <p className="muted">
          Manage your Delhi Metro journey with quick actions, recent booking info, and route tools.
        </p>
      </div>
      <div className="stat-row">
        <div className="stat">
          <p className="muted">Total bookings</p>
          <h3>{stats.totalBookings}</h3>
        </div>
        <div className="stat">
          <p className="muted">Total fare spent</p>
          <h3>Rs. {stats.spent}</h3>
        </div>
        <div className="stat">
          <p className="muted">Latest route</p>
          <h3>{stats.latestRoute}</h3>
        </div>
      </div>
      <div className="grid grid-2">
        <div className="card">
          <h3>Quick Actions</h3>
          <div className="grid">
            <button className="btn btn-primary" onClick={() => navigate("/book")} type="button">
              Book Tickets
            </button>
            <button className="btn btn-outline" onClick={() => navigate("/view")} type="button">
              View Current Ticket
            </button>
            <button className="btn btn-outline" onClick={() => navigate("/history")} type="button">
              Booking History
            </button>
          </div>
        </div>
        <div className="card">
          <img
            className="icon-img"
            src="https://cdn-icons-png.flaticon.com/512/3652/3652191.png"
            alt="Line status"
          />
          <h3>Delhi Line Status</h3>
          <p className="muted">Yellow Line: On Time</p>
          <p className="muted">Blue Line: Minor Delay (3-5 mins)</p>
          <p className="muted">Magenta Line: On Time</p>
          <button className="btn btn-outline" onClick={() => navigate("/timing")} type="button">
            Check Metro Timings
          </button>
        </div>
      </div>
    </section>
  );
}
