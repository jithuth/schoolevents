import axios from "axios";
import { useState } from "react";

export default function CreateSchool() {
  const [data, setData] = useState({ name: "", city: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(
      "http://127.0.0.1:8000/api/admin/schools/",
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }
    );

    alert("School Created");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Create School</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="School Name"
          onChange={(e) => setData({ ...data, name: e.target.value })}
          required
        />
        <input
          placeholder="City"
          onChange={(e) => setData({ ...data, city: e.target.value })}
          required
        />
        <button>Create</button>
      </form>
    </div>
  );
}
