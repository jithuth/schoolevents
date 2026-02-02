import axios from "axios";
import { useState } from "react";

export default function CreateUser() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    full_name: "",
    phone: "",
    role: "judge", // ✅ lowercase
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/auth/create-user/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );

      setMessage("✅ User created successfully");
    } catch (err) {
      console.error(err.response?.data);
      setMessage(
        err.response?.data?.detail ||
        JSON.stringify(err.response?.data) ||
        "❌ Failed to create user"
      );
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Create User (Admin Only)</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <input
          name="full_name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          required
        />

        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="judge">Judge</option>
          <option value="school_admin">School Admin</option>
        </select>

        <button type="submit">Create User</button>
      </form>
    </div>
  );
}
