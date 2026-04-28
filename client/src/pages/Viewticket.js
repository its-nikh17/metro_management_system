import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function Viewticket() {
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTicket = async () => {
      try {
        const response = await api.get("/tickets/current");
        setTicket(response.data.ticket);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "No active ticket found");
      }
    };
    loadTicket();
  }, []);

  if (error) {
    return (
      <section className="card">
        <h2>Current Ticket</h2>
        <p style={{ color: "var(--danger)" }}>{error}</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>Current Ticket</h2>
      {ticket ? (
        <div className="ticket-block">
          <p>
            <strong>Route:</strong> {ticket.startroute} → {ticket.destination}
          </p>
          <p>
            <strong>Tickets:</strong> {ticket.numberOfTickets}
          </p>
          <p>
            <strong>Fare:</strong> Rs. {ticket.fare}
          </p>
          <button className="btn btn-primary" onClick={() => navigate("/afterview")} type="button">
            Open Virtual Ticket
          </button>
        </div>
      ) : (
        <p className="muted">Loading ticket details...</p>
      )}
    </section>
  );
}
