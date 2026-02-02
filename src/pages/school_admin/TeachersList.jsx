// src/pages/schoolAdmin/TeachersList.jsx
// src/pages/schoolAdmin/TeachersList.jsx
// src/pages/schoolAdmin/TeachersList.jsx
// src/pages/schoolAdmin/TeachersList.jsx
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import "../../styles/TeachersList.css";

export default function TeachersList({ refresh }) {
  const [teachers, setTeachers] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  // CREATE FORM
  const [createForm, setCreateForm] = useState({
    user: "",
    employee_id: "",
    department: "",
    subject: "",
    qualification: "",
    experience_years: "",
  });

  // EDIT
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  /* LOAD TEACHERS */
  const loadTeachers = async () => {
    const res = await axios.get("/school-admin/teachers/");
    setTeachers(res.data);
  };

  useEffect(() => {
    loadTeachers();
  }, [refresh]);

  /* CREATE TEACHER */
  const createTeacher = async () => {
    try {
      await axios.post("/school-admin/teachers/", {
        user: Number(createForm.user),
        employee_id: createForm.employee_id,
        department: createForm.department,
        subject: createForm.subject,
        qualification: createForm.qualification,
        experience_years: Number(createForm.experience_years),
      });

      alert("Teacher created successfully ✅");
      setShowCreate(false);
      setCreateForm({
        user: "",
        employee_id: "",
        department: "",
        subject: "",
        qualification: "",
        experience_years: "",
      });
      loadTeachers();
    } catch (err) {
      alert("Failed to create teacher");
    }
  };

  /* UPDATE */
  const updateTeacher = async (id) => {
    await axios.patch(`/school-admin/teachers/${id}/`, editForm);
    setEditId(null);
    loadTeachers();
  };

  /* DELETE */
  const deleteTeacher = async (id) => {
    if (!window.confirm("Delete teacher?")) return;
    await axios.delete(`/school-admin/teachers/${id}/`);
    loadTeachers();
  };

  return (
    <div className="teachers-container">
      <div className="teachers-header">
        <h3>👩‍🏫 Teachers</h3>
        <button className="btn create" onClick={() => setShowCreate(!showCreate)}>
          ➕ Create Teacher Profile
        </button>
      </div>

      {/* CREATE FORM */}
      {showCreate && (
        <div className="create-form">
          <input placeholder="User ID" value={createForm.user}
            onChange={(e) => setCreateForm({ ...createForm, user: e.target.value })} />

          <input placeholder="Employee ID" value={createForm.employee_id}
            onChange={(e) => setCreateForm({ ...createForm, employee_id: e.target.value })} />

          <input placeholder="Department" value={createForm.department}
            onChange={(e) => setCreateForm({ ...createForm, department: e.target.value })} />

          <input placeholder="Subject / Branch" value={createForm.subject}
            onChange={(e) => setCreateForm({ ...createForm, subject: e.target.value })} />

          <input placeholder="Qualification" value={createForm.qualification}
            onChange={(e) => setCreateForm({ ...createForm, qualification: e.target.value })} />

          <input type="number" placeholder="Experience Years" value={createForm.experience_years}
            onChange={(e) => setCreateForm({ ...createForm, experience_years: e.target.value })} />

          <button className="btn save" onClick={createTeacher}>Save</button>
        </div>
      )}

      {/* TABLE */}
      <table className="teachers-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Subject</th>
            <th>Qualification</th>
            <th>Experience</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((t) => (
            <tr key={t.id}>
              {editId === t.id ? (
                <>
                  <td>{t.username}</td>
                  <td><input defaultValue={t.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })} /></td>
                  <td><input defaultValue={t.subject}
                    onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })} /></td>
                  <td><input defaultValue={t.qualification}
                    onChange={(e) => setEditForm({ ...editForm, qualification: e.target.value })} /></td>
                  <td><input type="number" defaultValue={t.experience_years}
                    onChange={(e) => setEditForm({ ...editForm, experience_years: Number(e.target.value) })} /></td>
                  <td>
                    <button className="btn save" onClick={() => updateTeacher(t.id)}>Save</button>
                    <button className="btn cancel" onClick={() => setEditId(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{t.username}</td>
                  <td>{t.department}</td>
                  <td>{t.subject}</td>
                  <td>{t.qualification}</td>
                  <td>{t.experience_years} yrs</td>
                  <td>
                    <button className="btn edit" onClick={() => {
                      setEditId(t.id);
                      setEditForm(t);
                    }}>Edit</button>
                    <button className="btn delete" onClick={() => deleteTeacher(t.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
