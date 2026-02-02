import { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, loading } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) return null;

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/login");
  };
  
  return (
    <nav className="navbar">
      {/* LOGO */}
      <div className="logo" onClick={() => navigate("/")}>
        🎵 <span>School</span>
      </div>

      {/* HAMBURGER */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      {/* LINKS */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        {console.log("Navbar role check:", user?.role)}

        <li>
          <NavLink to="/" end onClick={closeMenu}>
            Competitions
          </NavLink>
        </li>

        <li>
          <NavLink to="/voting" onClick={closeMenu}>
            Public Voting
          </NavLink>
        </li>

        <li>
          <NavLink to="/live-announcement" onClick={closeMenu}>
            Live Announcement
          </NavLink>
        </li>

        <li>
          <NavLink to="/leaderboard" onClick={closeMenu}>
            Leaderboard
          </NavLink>
        </li>

        {/* STUDENT */}


        {/* ADMIN */}
        {(user?.role === "admin" || user?.role === "super_admin") && (
          <li>
            <NavLink to="/admin" onClick={closeMenu}>
              Admin Panel
            </NavLink>
          </li>
        )}
        {/* SCHOOL ADMIN */}
        {user?.role === "school_admin" && (
          <>
            <li>
              <NavLink to="/school-admin/dashboard" onClick={closeMenu}>
                School Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/school-admin/review-performances"
                onClick={closeMenu}
              >
                Review Performances
              </NavLink>
            </li>
          </>
        )}
      {/* TEACHER */}
      {user?.role === "teacher" && (
          <>
            <li><NavLink to="/teacher/dashboard">Dashboard</NavLink></li>
            <li><NavLink to="/teacher/register">Register Students</NavLink></li>
            <li><NavLink to="/teacher/upload-videos">Upload Videos</NavLink></li>
          </>
        )}



        {/* JUDGE */}
        {user?.role === "judge" && (
          <li>
            <NavLink to="/judge/performances" onClick={closeMenu}>
              Judge Dashboard
            </NavLink>
          </li>
        )}

        {/* AUTH */}
        {!user ? (
          <>
            <li>
              <NavLink to="/login" onClick={closeMenu}>
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/register" onClick={closeMenu}>
                Sign Up
              </NavLink>
            </li>
          </>
        ) : (
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
