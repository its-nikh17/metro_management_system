import { useEffect, useState } from "react";
import api from "../lib/api";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get("/auth/users/me");
        setProfile(response.data.user);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to fetch profile");
      }
    };
    loadProfile();
  }, []);

  return (
    <section className="card">
      <h2>My Profile</h2>
      {error ? <p style={{ color: "var(--danger)" }}>{error}</p> : null}
      {profile ? (
        <div className="grid">
          <div className="ticket-block">
            <p>
              <strong>Name:</strong> {profile.name}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Phone:</strong> {profile.phone}
            </p>
            <p>
              <strong>Age:</strong> {profile.age}
            </p>
          </div>
        </div>
      ) : (
        <p className="muted">Loading profile...</p>
      )}
    </section>
  );
}
