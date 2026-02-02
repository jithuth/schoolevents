import { useState } from "react";
import api from "../api/axios";

export default function CreateUser() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    full_name: "",
    phone: "",
    role: "judge",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("SUBMIT CLICKED"); 

    try {
      const res = await api.post("auth/create-user/", {
        ...form,
        phone: String(form.phone),
      });

      alert("User created successfully ✅");

      setForm({
        username: "",
        password: "",
        full_name: "",
        phone: "",
        role: "judge",
      });
    } catch (err) {
      console.error("Create user error:", err.response?.data);

      alert(
        err.response?.data?.detail ||
        JSON.stringify(err.response?.data) ||
        "Failed to create user"
      );
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Create User (Admin)</h2>

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <input
          name="full_name"
          placeholder="Full Name"
          value={form.full_name}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="judge">Judge</option>
          <option value="school_admin">School Admin</option>
        </select>

        <button type="submit">Create User</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    marginTop: "40px",
  },
  form: {
    width: "400px",
    padding: "30px",
    background: "#fff",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },
};
