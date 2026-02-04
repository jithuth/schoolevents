// src/pages/schoolAdmin/StudentsList.jsx
// src/pages/schoolAdmin/StudentsList.jsx
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import "../../styles/StudentsList.css";

export default function StudentsList({ refresh }) {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  /* CREATE FORM */
  const [createForm, setCreateForm] = useState({
    user: "",
    admission_number: "",
    grade: "",
    section: "",
    roll_number: "",
    guardian_name: "",
    guardian_phone: "",
    admission_date: "",
    assigned_teacher: "",
  });

  /* EDIT */
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    grade: "",
    section: "",
    roll_number: "",
    assigned_teacher: "",
  });

  /* LOAD DATA */
  const loadStudents = async () => {
    const res = await axios.get("/school-admin/students/");
    setStudents(res.data);
  };

  const loadTeachers = async () => {
    const res = await axios.get("/school-admin/teachers/");
    setTeachers(res.data);
  };

  useEffect(() => {
    loadStudents();
    loadTeachers();
  }, [refresh]);

  /* CREATE STUDENT */
  const createStudent = async () => {
    try {
      await axios.post("/school-admin/students/", {
        ...createForm,
        user: Number(createForm.user),
        roll_number: Number(createForm.roll_number),
        assigned_teacher: Number(createForm.assigned_teacher),
      });

      alert("Student created successfully ✅");
      setShowCreate(false);
      setCreateForm({
        user: "",
        admission_number: "",
        grade: "",
        section: "",
        roll_number: "",
        guardian_name: "",
        guardian_phone: "",
        admission_date: "",
        assigned_teacher: "",
      });
      loadStudents();
    } catch {
      alert("Failed to create student ❌");
    }
  };

  /* UPDATE */
  const updateStudent = async (id) => {
    await axios.patch(`/school-admin/students/${id}/`, {
      ...editForm,
      roll_number: Number(editForm.roll_number),
      assigned_teacher: editForm.assigned_teacher
        ? Number(editForm.assigned_teacher)
        : null,
    });
    setEditId(null);
    loadStudents();
  };

  /* DELETE */
  const deleteStudent = async (id) => {
    if (!window.confirm("Delete student?")) return;
    await axios.delete(`/school-admin/students/${id}/`);
    loadStudents();
  };

  return (
    <div className="students-container">
      {/* HEADER */}
      <div className="students-header">
        <h3>🎓 Students</h3>
        <button className="btn create" onClick={() => setShowCreate(!showCreate)}>
          ➕ Create Student
        </button>
      </div>

      {/* CREATE FORM */}
      {showCreate && (
        <div className="create-form">
          <input
            placeholder="User ID"
            value={createForm.user}
            onChange={(e) =>
              setCreateForm({ ...createForm, user: e.target.value })
            }
          />

          <input
            placeholder="Admission Number"
            value={createForm.admission_number}
            onChange={(e) =>
              setCreateForm({
                ...createForm,
                admission_number: e.target.value,
              })
            }
          />

          <input
            placeholder="Grade"
            value={createForm.grade}
            onChange={(e) =>
              setCreateForm({ ...createForm, grade: e.target.value })
            }
          />

          <input
            placeholder="Class(ex:10 A)"
            value={createForm.section}
            onChange={(e) =>
              setCreateForm({ ...createForm, section: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Roll Number"
            value={createForm.roll_number}
            onChange={(e) =>
              setCreateForm({ ...createForm, roll_number: e.target.value })
            }
          />
          <input
          placeholder="Guardian Name"
          value={createForm.guardian_name}
          onChange={(e) =>
            setCreateForm({ ...createForm, guardian_name: e.target.value })
          }
        />

        <input
          placeholder="Guardian Phone"
          value={createForm.guardian_phone}
          onChange={(e) =>
            setCreateForm({ ...createForm, guardian_phone: e.target.value })
          }
        />

        <input
          type="date"
          value={createForm.admission_date}
          onChange={(e) =>
            setCreateForm({ ...createForm, admission_date: e.target.value })
          }
        />


          <select
            value={createForm.assigned_teacher}
            onChange={(e) =>
              setCreateForm({
                ...createForm,
                assigned_teacher: e.target.value,
              })
            }
          >
            <option value="">-- Select Teacher --</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.username}
              </option>
            ))}
          </select>

          <button className="btn save" onClick={createStudent}>
            Save
          </button>
        </div>
      )}

      {/* TABLE */}
      <table className="students-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Class</th>
            <th>Section</th>
            <th>Roll No</th>
            <th>Teacher</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              {editId === s.id ? (
                <>
                  <td>{s.username}</td>

                  <td>
                    <input
                      defaultValue={s.grade}
                      onChange={(e) =>
                        setEditForm({ ...editForm, grade: e.target.value })
                      }
                    />
                  </td>

                  <td>
                    <input
                      defaultValue={s.section}
                      onChange={(e) =>
                        setEditForm({ ...editForm, section: e.target.value })
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      defaultValue={s.roll_number}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          roll_number: e.target.value,
                        })
                      }
                    />
                  </td>

                  <td>
                    <select
                      defaultValue={s.assigned_teacher || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          assigned_teacher: e.target.value,
                        })
                      }
                    >
                      <option value="">-- Select Teacher --</option>
                      {teachers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.username}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <button
                      className="btn save"
                      onClick={() => updateStudent(s.id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn cancel"
                      onClick={() => setEditId(null)}
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{s.username}</td>
                  <td>{s.grade}</td>
                  <td>{s.section}</td>
                  <td>{s.roll_number}</td>
                  <td>{s.assigned_teacher_name || "Not Assigned"}</td>
                  <td>
                    <button
                      className="btn edit"
                      onClick={() => {
                        setEditId(s.id);
                        setEditForm({
                          grade: s.grade,
                          section: s.section,
                          roll_number: s.roll_number,
                          assigned_teacher: s.assigned_teacher,
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn delete"
                      onClick={() => deleteStudent(s.id)}
                    >
                      Delete
                    </button>
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
