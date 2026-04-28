import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function Afterview() {
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadTicket = async () => {
      try {
        const response = await api.get("/tickets/current");
        setTicket(response.data.ticket);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "No active ticket available");
      }
    };
    loadTicket();
  }, []);

  const cancelTicket = async () => {
    try {
      await api.delete("/tickets/current");
      navigate("/mvt");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to cancel ticket");
    }
  };

  return (
    <section className="card">
      <h2>Virtual Ticket</h2>
      {error ? <p style={{ color: "var(--danger)" }}>{error}</p> : null}
      {ticket ? (
        <div className="ticket-block">
          <p>
            <strong>Ticket Holder:</strong> {localStorage.getItem("name")}
          </p>
          <p>
            <strong>Route:</strong> {ticket.startroute} → {ticket.destination}
          </p>
          <p>
            <strong>Tickets:</strong> {ticket.numberOfTickets}
          </p>
          <p>
            <strong>Fare:</strong> Rs. {ticket.fare}
          </p>
          <button className="btn btn-danger" onClick={cancelTicket} type="button">
            Cancel Ticket
          </button>
        </div>
      ) : (
        <p className="muted">Loading your ticket...</p>
      )}
    </section>
  );
}
