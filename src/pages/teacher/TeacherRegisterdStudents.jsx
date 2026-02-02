import { useEffect, useState } from "react";
import axios from "../../api/axios";

export default function TeacherRegisterStudents() {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  };

  useEffect(() => {
    axios
      .get("/events/upcoming/", { headers })
      .then((res) => setEvents(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!eventId) {
      setStudents([]);
      return;
    }

    axios
      .get(`/events/${eventId}/interested-students/`, { headers })
      .then((res) => setStudents(res.data.students || []));
  }, [eventId]);

  const registerStudent = async () => {
  if (!eventId || !studentId) {
    alert("Select event & student");
    return;
  }

  try {
    setRegistering(true);

    await axios.post(
      "/registrations/",
      {
        event: eventId,
        student: studentId,
      },
      { headers }
    );

    // ✅ SUCCESS
    alert("Student registered successfully ✅");

    // remove registered student from dropdown
    setStudents((prev) =>
      prev.filter((s) => s.student_id !== Number(studentId))
    );

    setStudentId("");

  } catch (err) {
    // 🔥 IMPORTANT PART
    alert(
      err.response?.data?.detail ||
      err.response?.data?.message ||
      "Registration failed"
    );
  } finally {
    setRegistering(false);
  }
};

  if (loading) return <p style={{ color: "#fff" }}>Loading...</p>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>📝 Register Students</h2>
        <p style={styles.subtitle}>Upcoming Events Only</p>

        {/* Event */}
        <div style={styles.field}>
          <label style={styles.label}>Event</label>
          <select
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            style={styles.select}
          >
            <option value="">Select Event</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>
        </div>

        {/* Student */}
        <div style={styles.field}>
          <label style={styles.label}>Interested Students</label>
          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            disabled={students.length === 0}
            style={styles.select}
          >
            <option value="">
              {students.length === 0
                ? "No interested students"
                : "Select Student"}
            </option>
            {students.map((s) => (
              <option key={s.student_id} value={s.student_id}>
                {s.student_name} — {s.grade} {s.section}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={registerStudent}
          disabled={registering || !studentId}
          style={{
            ...styles.button,
            opacity: registering || !studentId ? 0.6 : 1,
          }}
        >
          {registering ? "Registering..." : "Register Student"}
        </button>
      </div>
    </div>
  );
}

/* 🎨 Dark Theme Styles */
const styles = {
  page: {
    minHeight: "80vh",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    background: "#111827",
    padding: 30,
    borderRadius: 14,
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  },
  title: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    textAlign: "center",
    color: "#9ca3af",
    marginBottom: 25,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    color: "#e5e7eb",
    marginBottom: 6,
    display: "block",
    fontSize: 14,
  },
  select: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #374151",
    background: "#1f2933",
    color: "#fff",
    fontSize: 14,
  },
  button: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(90deg, #22c55e, #16a34a)",
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: 10,
  },
};
