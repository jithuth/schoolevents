 //src/pages/schoolAdmin/CreateUser.jsx
import { useState } from "react";
import axios from "../../api/axios"; // ✅ custom axios

export default function CreateUser({ onDone }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    full_name: "",
    role: "student",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🔥 token auto-attached by interceptor
      await axios.post(
        "/auth/school-admin/create-user/",
        form
      );

      onDone(); // close form
    } catch (err) {
      console.error(err.response?.data);
      setError(
        err.response?.data?.detail ||
          "Failed to create user"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <h3>Create User Account</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* FULL NAME */}
      <input
        placeholder="Full Name"
        value={form.full_name}
        onChange={(e) =>
          setForm({ ...form, full_name: e.target.value })
        }
        required
      />

      {/* USERNAME */}
      <input
        placeholder="Username"
        value={form.username}
        onChange={(e) =>
          setForm({ ...form, username: e.target.value })
        }
        required
      />

      {/* PASSWORD */}
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
        required
      />

      {/* ROLE */}
      <select
        value={form.role}
        onChange={(e) =>
          setForm({ ...form, role: e.target.value })
        }
      >
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
      </select>

      {/* PHONE */}
      <input
        placeholder="Phone"
        value={form.phone}
        onChange={(e) =>
          setForm({ ...form, phone: e.target.value })
        }
      />

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create"}
      </button>
    </form>
  );
}
