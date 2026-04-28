import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const linkItems = [
  { to: "/", label: "Home", public: true },
  { to: "/mvt", label: "Dashboard", private: true },
  { to: "/book", label: "Book Ticket", private: true },
  { to: "/history", label: "History", private: true },
  { to: "/timing", label: "Timings", public: true },
  { to: "/contact", label: "Contact", public: true },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isLoggedIn = Boolean(token);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const visibleLinks = linkItems.filter((item) => (isLoggedIn ? true : item.public));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">Delhi Metro SmartPass</div>
        <nav className="nav-links">
          {visibleLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {item.label}
            </NavLink>
          ))}
          <button
            className="btn btn-outline"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            type="button"
          >
            {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
          </button>
          {isLoggedIn ? (
            <>
              {role === "admin" ? (
                <NavLink
                  to="/admin"
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                >
                  Admin
                </NavLink>
              ) : null}
              <NavLink
                to="/profile"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                Profile
              </NavLink>
              <button className="btn btn-outline" onClick={handleLogout} type="button">
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className="btn btn-primary">
              Login
            </NavLink>
          )}
        </nav>
      </header>
      <main className="page-wrap">
        <Outlet />
      </main>
    </div>
  );
}
