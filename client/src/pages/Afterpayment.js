import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function Afterpayment() {
  const [ticket, setTicket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTicket = async () => {
      try {
        const response = await api.get("/tickets/current");
        setTicket(response.data.ticket);
      } catch (error) {
        setTicket(null);
      }
    };
    loadTicket();
  }, []);

  return (
    <section className="card">
      <h2>Payment Successful</h2>
      <p className="muted">Your virtual ticket is ready for travel.</p>
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
        </div>
      ) : (
        <p className="muted">Ticket details unavailable.</p>
      )}
      <div style={{ display: "flex", gap: "0.6rem", marginTop: "1rem" }}>
        <button className="btn btn-primary" onClick={() => navigate("/mvt")} type="button">
          Back to Dashboard
        </button>
        <button className="btn btn-outline" onClick={() => navigate("/afterview")} type="button">
          Open Virtual Ticket
        </button>
      </div>
    </section>
  );
}
 