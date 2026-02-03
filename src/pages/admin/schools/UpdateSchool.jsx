import api from "../../../api/axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditSchool() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [school, setSchool] = useState({
    name: "",
    city: "",
  });

  const [loading, setLoading] = useState(true);

  // Fetch single school
  useEffect(() => {
    api
      .get(`schools/${id}/`)
      .then((res) => {
        setSchool(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to load school");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setSchool({ ...school, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await api.put(
        `schools/${id}/`,
        school
      );

      alert("✅ School updated successfully");
      navigate("/admin/schools");
    } catch (err) {
      console.error(err.response?.data);
      alert("❌ Failed to update school");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "40px" }}>
      <h2>✏️ Update School</h2>

      <form onSubmit={handleUpdate}>
        <input
          name="name"
          value={school.name}
          onChange={handleChange}
          placeholder="School Name"
          required
        />

        <input
          name="city"
          value={school.city}
          onChange={handleChange}
          placeholder="City"
          required
        />

        <button type="submit">Update School</button>
      </form>
    </div>
  );
}
