import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/admin/schools/";

const emptyForm = {
  name: "",
  school_code: "",
  board: "",
  city: "",
  state: "",
  country: "",
  principal_name: "",
  contact_email: "",
  contact_phone: "",
  established_year: "",
};

const SchoolList = () => {
  const [schools, setSchools] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("access")}`,
    "Content-Type": "application/json",
  };

  // 🔹 FETCH
  const fetchSchools = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL, { headers });
      setSchools(res.data);
    } catch (err) {
      console.error(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  // 🔹 ADD / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(`${API_URL}${editId}/`, formData, { headers });
      } else {
        await axios.post(API_URL, formData, { headers });
      }

      setFormData(emptyForm);
      setEditId(null);
      fetchSchools();
    } catch (err) {
      console.error("Save error:", err.response?.data || err);
      alert("All fields are required");
    }
  };

  // 🔹 EDIT
  const handleEdit = (s) => {
    setFormData({
      name: s.name || "",
      school_code: s.school_code || "",
      board: s.board || "",
      city: s.city || "",
      state: s.state || "",
      country: s.country || "",
      principal_name: s.principal_name || "",
      contact_email: s.contact_email || "",
      contact_phone: s.contact_phone || "",
      established_year: s.established_year || "",
    });
    setEditId(s.id);
  };

  // 🔹 DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this school?")) return;
    await axios.delete(`${API_URL}${id}/`, { headers });
    fetchSchools();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🏫 Schools Management</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-3 mb-6">
        {[
          ["School Name", "name"],
          ["School Code", "school_code"],
          ["Board", "board"],
          ["City", "city"],
          ["State", "state"],
          ["Country", "country"],
          ["Principal Name", "principal_name"],
          ["Contact Email", "contact_email"],
          ["Contact Phone", "contact_phone"],
          ["Established Year", "established_year"],
        ].map(([label, key]) => (
          <input
            key={key}
            placeholder={label}
            value={formData[key]}
            onChange={(e) =>
              setFormData({ ...formData, [key]: e.target.value })
            }
            className="border p-2"
            required
          />
        ))}

        <button
          type="submit"
          className={`px-4 py-2 text-white ${
            editId ? "bg-green-600" : "bg-blue-600"
          }`}
        >
          {editId ? "Update School" : "Add School"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setFormData(emptyForm);
            }}
            className="px-4 py-2 bg-gray-400 text-white"
          >
            Cancel
          </button>
        )}
      </form>

      {/* TABLE */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">City</th>
            <th className="border p-2">Board</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="text-center p-4">Loading...</td>
            </tr>
          ) : schools.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500">
                No schools found
              </td>
            </tr>
          ) : (
            schools.map((s) => (
              <tr key={s.id}>
                <td className="border p-2">{s.name}</td>
                <td className="border p-2">{s.city}</td>
                <td className="border p-2">{s.board}</td>
                <td className="border p-2 text-center space-x-2">
                  <button onClick={() => handleEdit(s)} className="text-blue-600">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SchoolList;
