import { useState } from "react";
import { useNavigate } from "react-router-dom";

const modes = ["Card", "UPI", "Netbanking"];

export default function Payment() {
  const [mode, setMode] = useState("Card");
  const navigate = useNavigate();

  return (
    <section className="card">
      <h2>Payment</h2>
      <p className="muted">Demo payment screen. Choose method and complete booking.</p>
      <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        {modes.map((item) => (
          <button
            key={item}
            type="button"
            className={item === mode ? "btn btn-primary" : "btn btn-outline"}
            onClick={() => setMode(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="ticket-block">
        <p>
          <strong>Selected Method:</strong> {mode}
        </p>
        <p className="muted">In production, this step can be connected to Razorpay/Stripe.</p>
      </div>
      <button className="btn btn-primary" type="button" onClick={() => navigate("/afterpayment")}>
        Pay Now
      </button>
    </section>
  );
}
