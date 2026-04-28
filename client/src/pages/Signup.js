import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const register = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to register");
    }
  };

  return (
    <section className="card" style={{ maxWidth: "540px", margin: "0 auto" }}>
      <h2>Create account</h2>
      <form className="form" onSubmit={register}>
        <input
          type="text"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          placeholder="Full Name"
          required
        />
        <input
          type="number"
          value={form.age}
          onChange={(event) => setForm({ ...form, age: event.target.value })}
          placeholder="Age"
          required
        />
        <input
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          placeholder="Email Address"
          required
        />
        <input
          type="password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          placeholder="Password"
          required
        />
        <input
          type="tel"
          value={form.phone}
          onChange={(event) => setForm({ ...form, phone: event.target.value })}
          placeholder="Phone Number"
          required
        />
        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
      </form>
      {error ? <p style={{ color: "var(--danger)" }}>{error}</p> : null}
      <button type="button" className="btn btn-outline" onClick={() => navigate("/login")}>
        Already have an account? Login
      </button>
    </section>
  );
}
