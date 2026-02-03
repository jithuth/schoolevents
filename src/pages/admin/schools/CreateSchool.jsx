import api from "../../../api/axios";
import { useState } from "react";

export default function CreateSchool() {
  const [data, setData] = useState({ name: "", city: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post(
      "admin/schools/",
      data
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
