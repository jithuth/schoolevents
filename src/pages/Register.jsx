// src/auth/Register.jsx
import axios from "../api/axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.post(
        "auth/register/",
        formData
      );

      setSuccess("🎉 Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setError("❌ Registration failed. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "90vh" }}>
      <Card className="glass-card text-white p-4" style={{ width: "100%", maxWidth: "500px" }}>
        <Card.Body>
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-2">Create Account 🎶</h2>
            <p className="text-secondary small">Join School and showcase your talent</p>
          </div>

          {error && <Alert variant="danger" className="py-2 text-center">{error}</Alert>}
          {success && <Alert variant="success" className="py-2 text-center">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Choose a username"
                onChange={handleChange}
                required
                className="bg-dark text-white border-secondary"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="full_name"
                placeholder="Your full name"
                onChange={handleChange}
                required
                className="bg-dark text-white border-secondary"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                placeholder="Phone number"
                onChange={handleChange}
                required
                className="bg-dark text-white border-secondary"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Create a password"
                onChange={handleChange}
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
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </Form>

          <div className="text-center mt-4 text-secondary small">
            Already have an account? <Link to="/login" className="text-white fw-bold">Login</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
