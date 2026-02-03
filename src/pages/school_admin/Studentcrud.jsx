import api from "../../api/axios";
import { useEffect, useState } from "react";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({});
  const [editId, setEditId] = useState(null);

  const load = () => {
    api.get(
      "school-admin/students/"
    ).then(res => setStudents(res.data));
  };

  useEffect(load, []);

  const create = async () => {
    await api.post(
      "school-admin/students/",
      form
    );
    load();
  };

  const update = async (id) => {
    await api.put(
      `school-admin/students/${id}/`,
      form
    );
    setEditId(null);
    load();
  };

  const remove = async (id) => {
    await api.delete(
      `school-admin/students/${id}/`
    );
    load();
  };

  return (
    <>
      <h3>Students</h3>

      <input placeholder="Profile ID"
        onChange={e => setForm({ ...form, profile: e.target.value })} />
      <input placeholder="Class"
        onChange={e => setForm({ ...form, class_name: e.target.value })} />
      <input placeholder="Section"
        onChange={e => setForm({ ...form, section: e.target.value })} />
      <button onClick={create}>Add Student</button>

      {students.map(s => (
        <div key={s.id}>
          {s.profile_name} - {s.class_name}
          <button onClick={() => setEditId(s.id)}>Edit</button>
          <button onClick={() => remove(s.id)}>Delete</button>

          {editId === s.id && (
            <>
              <input placeholder="Class"
                onChange={e => setForm({ ...form, class_name: e.target.value })} />
              <button onClick={() => update(s.id)}>Save</button>
            </>
          )}
        </div>
      ))}
    </>
  );
}
