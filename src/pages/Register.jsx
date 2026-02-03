// src/auth/Register.jsx
import axios from "../api/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

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
    <div className="register-page">
      <div className="register-card">
        <h2>Create Account 🎶</h2>
        <p className="subtitle">
          Join School and showcase your talent
        </p>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="register-footer">
          Already have an account?
          <a href="/login"> Login</a>
        </div>
      </div>
    </div>
  );
}
