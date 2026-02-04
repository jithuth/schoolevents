import { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { Navbar, Nav, Container, Button, Offcanvas } from "react-bootstrap";

export default function AppNavbar() {
  const navigate = useNavigate();
  const { user, logout, loading } = useContext(AuthContext);
  const [expanded, setExpanded] = useState(false);

  if (loading) return null;

  const closeMenu = () => setExpanded(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/login");
  };

  return (
    <Navbar
      expand="lg"
      variant="dark"
      fixed="top"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      className="glass-navbar"
    >
      <Container>
        <Navbar.Brand
          onClick={() => navigate("/")}
          style={{ cursor: "pointer", fontWeight: "700", fontSize: "1.5rem" }}
        >
          🎵 <span className="text-gradient">SchoolBeat</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="offcanvasNavbar-expand-lg" />

        <Navbar.Offcanvas
          id="offcanvasNavbar-expand-lg"
          aria-labelledby="offcanvasNavbarLabel-expand-lg"
          placement="end"
          className="bg-dark text-white"
        >
          <Offcanvas.Header closeButton closeVariant="white">
            <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg">
              Menu
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3 gap-3">
              <Nav.Link as={NavLink} to="/" end onClick={closeMenu}>Competitions</Nav.Link>
              <Nav.Link as={NavLink} to="/voting" onClick={closeMenu}>Voting</Nav.Link>
              <Nav.Link as={NavLink} to="/live-announcement" onClick={closeMenu}>Live</Nav.Link>
              <Nav.Link as={NavLink} to="/leaderboard" onClick={closeMenu}>Leaderboard</Nav.Link>

              {/* ADMIN */}
              {(user?.role === "admin" || user?.role === "super_admin") && (
                <Nav.Link as={NavLink} to="/admin" onClick={closeMenu}>Admin Panel</Nav.Link>
              )}

              {/* SCHOOL ADMIN */}
              {user?.role === "school_admin" && (
                <>
                  <Nav.Link as={NavLink} to="/school-admin/dashboard" onClick={closeMenu}>Dashboard</Nav.Link>
                  <Nav.Link as={NavLink} to="/school-admin/review-performances" onClick={closeMenu}>Review</Nav.Link>
                </>
              )}

              {/* TEACHER */}
              {user?.role === "teacher" && (
                <>
                  <Nav.Link as={NavLink} to="/teacher/dashboard" onClick={closeMenu}>Dashboard</Nav.Link>
                  <Nav.Link as={NavLink} to="/teacher/register" onClick={closeMenu}>Register Students</Nav.Link>
                  <Nav.Link as={NavLink} to="/teacher/upload-videos" onClick={closeMenu}>Upload Videos</Nav.Link>
                </>
              )}

              {/* JUDGE */}
              {user?.role === "judge" && (
                <Nav.Link as={NavLink} to="/judge/performances" onClick={closeMenu}>Judge Dashboard</Nav.Link>
              )}

              <div className="d-flex gap-2 align-items-center mt-3 mt-lg-0">
                {!user ? (
                  <>
                    <Button
                      variant="outline-light"
                      onClick={() => { navigate("/login"); closeMenu(); }}
                      className="rounded-pill px-4"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => { navigate("/register"); closeMenu(); }}
                      style={{ background: "linear-gradient(to right, #6366f1, #ec4899)", border: "none" }}
                      className="rounded-pill px-4 text-white"
                    >
                      Sign Up
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline-danger"
                    onClick={handleLogout}
                    className="rounded-pill px-4"
                  >
                    Logout
                  </Button>
                )}
              </div>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}
