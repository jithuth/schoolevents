// src/pages/teacher/TeacherDashboard.jsx
import { useEffect, useState } from "react";
import axios from "../../api/axios";

export default function TeacherDashboard() {
  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const res = await axios.get("/events/all/", { headers });
    setEvents(res.data);
  };

  const loadInterestedStudents = async (eventId) => {
    if (!eventId) {
      setStudents([]);
      return;
    }

    const res = await axios.get(
      `/events/${eventId}/interested-students/`,
      { headers }
    );
    setStudents(res.data.students || []);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>👨‍🏫 Teacher Dashboard</h2>
        <p style={styles.subtitle}>View students interested in events</p>

        {/* Event Selector */}
        <div style={styles.field}>
          <label style={styles.label}>Select Event</label>
          <select
            style={styles.select}
            onChange={(e) => loadInterestedStudents(e.target.value)}
          >
            <option value="">-- Select Event --</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>
        </div>

        {/* Students */}
        <h3 style={styles.sectionTitle}>Interested Students</h3>

        {students.length === 0 ? (
          <p style={styles.empty}>No students interested yet</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Grade</th>
                <th style={styles.th}>Section</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.student_id} style={styles.tr}>
                  <td style={styles.td}>{s.student_name}</td>
                  <td style={styles.td}>{s.grade}</td>
                  <td style={styles.td}>{s.section}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* 🎨 Dark Theme Inline Styles */
const styles = {
  page: {
    minHeight: "80vh",
    background: "linear-gradient(135deg, #020617, #0f172a, #020617)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 900,
    background: "#020617",
    borderRadius: 16,
    padding: 30,
    boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
    border: "1px solid #1e293b",
  },
  title: {
    textAlign: "center",
    color: "#e5e7eb",
    marginBottom: 4,
  },
  subtitle: {
    textAlign: "center",
    color: "#94a3b8",
    marginBottom: 25,
    fontSize: 14,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    display: "block",
    color: "#cbd5f5",
    marginBottom: 6,
    fontSize: 14,
  },
  select: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    background: "#020617",
    color: "#e5e7eb",
    border: "1px solid #334155",
    fontSize: 14,
  },
  sectionTitle: {
    color: "#e5e7eb",
    marginTop: 25,
    marginBottom: 10,
  },
  empty: {
    color: "#94a3b8",
    textAlign: "center",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 10,
  },
  th: {
    textAlign: "left",
    padding: 12,
    background: "#020617",
    color: "#a5b4fc",
    borderBottom: "1px solid #1e293b",
  },
  td: {
    padding: 12,
    color: "#e5e7eb",
    borderBottom: "1px solid #1e293b",
  },
  tr: {
    backgroundColor: "#020617",
  },
};
