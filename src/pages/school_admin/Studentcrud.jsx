import axios from "axios";
import { useEffect, useState } from "react";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({});
  const [editId, setEditId] = useState(null);

  const load = () => {
    axios.get(
      "http://127.0.0.1:8000/api/school-admin/students/",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }
    ).then(res => setStudents(res.data));
  };

  useEffect(load, []);

  const create = async () => {
    await axios.post(
      "http://127.0.0.1:8000/api/school-admin/students/",
      form,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }
    );
    load();
  };

  const update = async (id) => {
    await axios.put(
      `http://127.0.0.1:8000/api/school-admin/students/${id}/`,
      form,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }
    );
    setEditId(null);
    load();
  };

  const remove = async (id) => {
    await axios.delete(
      `http://127.0.0.1:8000/api/school-admin/students/${id}/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }
    );
    load();
  };

  return (
    <>
      <h3>Students</h3>

      <input placeholder="Profile ID"
        onChange={e => setForm({...form, profile:e.target.value})}/>
      <input placeholder="Class"
        onChange={e => setForm({...form, class_name:e.target.value})}/>
      <input placeholder="Section"
        onChange={e => setForm({...form, section:e.target.value})}/>
      <button onClick={create}>Add Student</button>

      {students.map(s => (
        <div key={s.id}>
          {s.profile_name} - {s.class_name}
          <button onClick={() => setEditId(s.id)}>Edit</button>
          <button onClick={() => remove(s.id)}>Delete</button>

          {editId === s.id && (
            <>
              <input placeholder="Class"
                onChange={e => setForm({...form, class_name:e.target.value})}/>
              <button onClick={() => update(s.id)}>Save</button>
            </>
          )}
        </div>
      ))}
    </>
  );
}
