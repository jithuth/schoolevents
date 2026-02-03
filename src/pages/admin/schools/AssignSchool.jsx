import { useEffect, useState } from "react";
import api from "../../../api/axios";

const AssignSchool = () => {
  const [schools, setSchools] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [schoolId, setSchoolId] = useState("");
  const [adminId, setAdminId] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch schools
  const fetchSchools = async () => {
    const res = await api.get(
      "admin/schools/"
    );
    setSchools(res.data);
  };

  // 🔹 Fetch school admins (ALL admins + assigned flag)
  const fetchAdmins = async () => {
    const res = await api.get(
      "auth/admin/school-admins/"
    );
    setAdmins(res.data);
  };

  useEffect(() => {
    fetchSchools();
    fetchAdmins();
  }, []);

  // 🔹 Assign school admin
  const handleAssign = async (e) => {
    e.preventDefault();

    if (!schoolId || !adminId) {
      alert("Select school and admin");
      return;
    }

    try {
      setLoading(true);

      await api.post(
        "admin/school-admins/",
        {
          school: schoolId,
          user: adminId,
        }
      );

      alert("School Admin assigned successfully");

      setSchoolId("");
      setAdminId("");

      // 🔄 refresh admin list (to disable assigned admin)
      fetchAdmins();
    } catch (err) {
      alert(
        err.response?.data?.detail ||
        "Assignment failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h2 className="text-2xl font-bold mb-4">
        🏫 Assign School Admin
      </h2>

      <form onSubmit={handleAssign} className="space-y-4">
        {/* SCHOOL SELECT */}
        <div>
          <label className="block mb-1 font-medium">
            School
          </label>
          <select
            className="w-full border p-2"
            value={schoolId}
            onChange={(e) => setSchoolId(e.target.value)}
            required
          >
            <option value="">-- Select School --</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* ADMIN SELECT */}
        <div>
          <label className="block mb-1 font-medium">
            School Admin
          </label>
          <select
            className="w-full border p-2"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            required
          >
            <option value="">
              -- Select School Admin --
            </option>

            {admins.map((a) => (
              <option
                key={a.id}
                value={a.id}               // ✅ user id
                disabled={a.is_assigned}   // ✅ block assigned admins
              >
                {a.username}
                {a.is_assigned
                  ? " (Already Assigned)"
                  : ""}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Assigning..." : "Assign"}
        </button>
      </form>
    </div>
  );
};

export default AssignSchool;
