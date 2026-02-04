import axios from "../api/axios";
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/auth/login/", form);

      localStorage.setItem("access", res.data.access);

      const profileRes = await axios.get("/auth/me/");
      const profile = profileRes.data;

      login(profile);

      if (profile.role === "school_admin") {
        navigate("/school-admin/dashboard");
      } else if (profile.role === "teacher") {
        navigate("/teacher/dashboard");
      } else {
        navigate("/live-announcement");
      }
    } catch (err) {
      console.error(err.response);
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
      <Card className="glass-card text-white p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <Card.Body>
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-2">Welcome Back</h2>
            <p className="text-secondary small">Login to participate in competitions</p>
          </div>

          {error && <Alert variant="danger" className="py-2 text-center">{error}</Alert>}

          <Form onSubmit={submit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                className="bg-dark text-white border-secondary"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="bg-dark text-white border-secondary"
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100 fw-bold border-0"
              disabled={loading}
              style={{ background: "linear-gradient(to right, #6366f1, #ec4899)", padding: "12px" }}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form>

          <div className="text-center mt-4 text-secondary small">
            Don't have an account? <Link to="/register" className="text-white fw-bold">Sign Up</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
