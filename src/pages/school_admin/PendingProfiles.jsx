// src/pages/schoolAdmin/PendingProfiles.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function PendingProfiles({ refresh, onDone }) {
  const [pending, setPending] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/school/pending-profiles/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
      .then((res) => setPending(res.data));
  }, [refresh]);

  return (
    <>
      <h3>Pending Profiles</h3>

      {pending.length === 0 && <p>No pending profiles</p>}

      {pending.map((u) => (
        <div key={u.id} style={{ marginBottom: 10 }}>
          <b>{u.username}</b> ({u.role})
          <button
            style={{ marginLeft: 10 }}
            onClick={() => alert("Open complete profile form")}
          >
            Complete Profile
          </button>
        </div>
      ))}
    </>
  );
}
