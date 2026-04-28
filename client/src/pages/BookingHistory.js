import { useEffect, useState } from "react";
import api from "../lib/api";

export default function BookingHistory() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await api.get("/auth/history");
        setTickets(response.data.tickets || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load booking history");
      }
    };
    loadHistory();
  }, []);

  return (
    <section className="card">
      <h2>Booking History</h2>
      {error ? <p style={{ color: "var(--danger)" }}>{error}</p> : null}
      {!tickets.length ? (
        <p className="muted">No bookings yet. Book your first ticket from the dashboard.</p>
      ) : (
        <div className="grid">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="ticket-block">
              <p>
                <strong>Route:</strong> {ticket.startroute} → {ticket.destination}
              </p>
              <p>
                <strong>Tickets:</strong> {ticket.numberOfTickets}
              </p>
              <p>
                <strong>Fare:</strong> Rs. {ticket.fare}
              </p>
              <p className="muted">{new Date(ticket.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
