import { useEffect, useState } from "react";
import api from "../lib/api";

export default function AdminPanel() {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    message: "",
    priority: "medium",
  });
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setError("");
      const [overviewRes, usersRes, ticketsRes, announcementsRes] = await Promise.all([
        api.get("/admin/overview"),
        api.get("/admin/users"),
        api.get("/admin/tickets"),
        api.get("/admin/announcements"),
      ]);
      setOverview(overviewRes.data);
      setUsers(usersRes.data.users || []);
      setTickets(ticketsRes.data.tickets || []);
      setAnnouncements(announcementsRes.data.announcements || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load admin data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateRole = async (userId, role) => {
    await api.patch(`/admin/users/${userId}/role`, { role });
    loadData();
  };

  const updateTicketStatus = async (ticketId, status) => {
    await api.patch(`/admin/tickets/${ticketId}/status`, { status });
    loadData();
  };

  const createAnnouncement = async (event) => {
    event.preventDefault();
    await api.post("/admin/announcements", announcementForm);
    setAnnouncementForm({ title: "", message: "", priority: "medium" });
    loadData();
  };

  return (
    <section className="grid">
      <div className="card">
        <h2>Admin Panel</h2>
        <p className="muted">Manage users, tickets, and announcements from one place.</p>
        {error ? <p style={{ color: "var(--danger)" }}>{error}</p> : null}
      </div>

      {overview ? (
        <div className="stat-row">
          <div className="stat">
            <p className="muted">Users</p>
            <h3>{overview.users}</h3>
          </div>
          <div className="stat">
            <p className="muted">Total Tickets</p>
            <h3>{overview.tickets}</h3>
          </div>
          <div className="stat">
            <p className="muted">Active Tickets</p>
            <h3>{overview.activeTickets}</h3>
          </div>
          <div className="stat">
            <p className="muted">Revenue</p>
            <h3>Rs. {overview.revenue}</h3>
          </div>
        </div>
      ) : null}

      <div className="grid grid-2">
        <div className="card">
          <h3>User Management</h3>
          <div className="grid">
            {users.slice(0, 12).map((user) => (
              <div key={user._id} className="ticket-block">
                <p>
                  <strong>{user.name}</strong> ({user.email})
                </p>
                <p className="muted">Role: {user.role}</p>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button type="button" className="btn btn-outline" onClick={() => updateRole(user._id, "user")}>
                    Set User
                  </button>
                  <button type="button" className="btn btn-primary" onClick={() => updateRole(user._id, "admin")}>
                    Set Admin
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>Ticket Controls</h3>
          <div className="grid">
            {tickets.slice(0, 12).map((ticket) => (
              <div key={ticket._id} className="ticket-block">
                <p>
                  <strong>
                    {ticket.startroute} → {ticket.destination}
                  </strong>
                </p>
                <p className="muted">
                  Fare: Rs. {ticket.fare} | Status: {ticket.status}
                </p>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() =>
                    updateTicketStatus(ticket._id, ticket.status === "active" ? "cancelled" : "active")
                  }
                >
                  Toggle Status
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Create Announcement</h3>
          <form className="form" onSubmit={createAnnouncement}>
            <input
              type="text"
              placeholder="Title"
              value={announcementForm.title}
              onChange={(event) =>
                setAnnouncementForm({
                  ...announcementForm,
                  title: event.target.value,
                })
              }
              required
            />
            <input
              type="text"
              placeholder="Message"
              value={announcementForm.message}
              onChange={(event) =>
                setAnnouncementForm({
                  ...announcementForm,
                  message: event.target.value,
                })
              }
              required
            />
            <select
              value={announcementForm.priority}
              onChange={(event) =>
                setAnnouncementForm({
                  ...announcementForm,
                  priority: event.target.value,
                })
              }
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button className="btn btn-primary" type="submit">
              Publish
            </button>
          </form>
        </div>
        <div className="card">
          <h3>Recent Announcements</h3>
          <div className="grid">
            {announcements.slice(0, 8).map((item) => (
              <div key={item._id} className="ticket-block">
                <p>
                  <strong>{item.title}</strong>
                </p>
                <p className="muted">{item.message}</p>
                <p className="muted">Priority: {item.priority}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
