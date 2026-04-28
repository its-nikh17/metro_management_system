import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const authenticate = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("name", response.data.user.name);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.role || "user");
      navigate(response.data.user.role === "admin" ? "/admin" : "/mvt");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <section className="card" style={{ maxWidth: "480px", margin: "0 auto" }}>
      <h2>Login</h2>
      <p className="muted">Access your metro dashboard and manage bookings.</p>
      <form className="form" onSubmit={authenticate}>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email Address"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
      {error ? <p style={{ color: "var(--danger)" }}>{error}</p> : null}
      <p className="muted">
        New user?{" "}
        <button type="button" className="btn btn-outline" onClick={() => navigate("/signup")}>
          Create account
        </button>
      </p>
    </section>
  );
}
