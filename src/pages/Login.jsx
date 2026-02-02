import axios from "../api/axios"; // ✅ custom axios with interceptor
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import "../styles/Login.css";

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
      // 🔐 LOGIN
      const res = await axios.post("/auth/login/", form);

      // ✅ SAVE ACCESS TOKEN (MOST IMPORTANT LINE)
      localStorage.setItem("access", res.data.access);
      console.log("TOKEN SAVED:", localStorage.getItem("access"));

      // 🔐 FETCH PROFILE (token auto-attached by interceptor)
      const profileRes = await axios.get("/auth/me/");
      const profile = profileRes.data;

      // 🔐 SAVE USER IN CONTEXT
      login(profile);

      // 🔀 ROLE BASED REDIRECT
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
    <div className="login-page">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to participate in competitions</p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={submit}>
          <div className="input-group">
            <input
              placeholder="Username"
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="login-footer">
          
          
        </div>
      </div>
    </div>
  );
}
