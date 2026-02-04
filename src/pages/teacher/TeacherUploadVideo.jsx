import { useEffect, useState } from "react";
import axios from "../../api/axios";

export default function TeacherVideoUpload() {
  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);

  const [eventId, setEventId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [video, setVideo] = useState(null);
  const [photo, setPhoto] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* ================= LOAD EVENTS ================= */
  useEffect(() => {
    axios
      .get("/events/live/")
      .then((res) => setEvents(res.data))
      .finally(() => setLoading(false));
  }, []);

  /* ================= LOAD STUDENTS ================= */
  useEffect(() => {
    if (!eventId) {
      setStudents([]);
      setStudentId("");
      setSelectedStudent(null);
      return;
    }

    axios
      .get(`/teacher/upload-students/?event=${eventId}`)
      .then((res) => setStudents(res.data.students || []))
      .catch(() => setStudents([]));
  }, [eventId]);

  const handleStudentChange = (e) => {
    const id = Number(e.target.value);
    setStudentId(id);
    setSelectedStudent(students.find((s) => s.id === id) || null);
  };

  /* ================= SUBMIT ================= */
  const submit = async (e) => {
    e.preventDefault();

    if (!eventId || !studentId) {
      alert("Select Event and Students ");
      return;
    }

    if (!duration || Number(duration) < 1) {
      alert("Enter the Duration(seconds)");
      return;
    }

    if (!video || !photo) {
      alert("Please select Photos and Videos");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("event", String(eventId));
      formData.append("student", String(studentId));
      formData.append("title", title);
      formData.append("description", description);
      formData.append("duration_seconds", duration);
      formData.append("photo", photo);
      formData.append("video", video);

      await axios.post("/teacher/performances/", formData);

      alert("Upload successful ✅ Waiting for approval");

      // reset
      setEventId("");
      setStudentId("");
      setSelectedStudent(null);
      setTitle("");
      setDescription("");
      setDuration("");
      setVideo(null);
      setPhoto(null);
    } catch (err) {
      alert(JSON.stringify(err.response?.data, null, 2));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p style={{ color: "#fff" }}>Loading events...</p>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🎥 Upload Student Performance</h2>
        <p style={styles.subtitle}>Live Events Only</p>

        <form onSubmit={submit}>
          {/* Event */}
          <div style={styles.field}>
            <label style={styles.label}>Event</label>
            <select
              required
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
            <label style={styles.label}>Student</label>
            <select
              required
              value={studentId}
              onChange={handleStudentChange}
              disabled={!eventId}
              style={styles.select}
            >
              <option value="">
                {eventId ? "Select Student" : "Select event first"}
              </option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name}
                </option>
              ))}
            </select>
          </div>

          {selectedStudent && (
            <div style={styles.highlight}>
              👤 {selectedStudent.full_name}
            </div>
          )}

          {/* Title */}
          <div style={styles.field}>
            <input
              style={styles.input}
              placeholder="Performance Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div style={styles.field}>
            <textarea
              style={styles.textarea}
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Duration */}
          <div style={styles.field}>
            <label style={styles.label}>Duration (seconds)</label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 60"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          {/* Photo */}
          <div style={styles.field}>
            <label style={styles.label}>Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
              style={styles.file}
              required
            />
          </div>

          {/* Video */}
          <div style={styles.field}>
            <label style={styles.label}>Video</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files[0])}
              style={styles.file}
              required
            />
          </div>

          <button
            disabled={submitting}
            style={{
              ...styles.button,
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? "Uploading..." : "Upload Performance"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
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
    maxWidth: 500,
    background: "#020617",
    padding: 30,
    borderRadius: 16,
    border: "1px solid #1e293b",
    boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
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
  field: { marginBottom: 16 },
  label: {
    color: "#cbd5f5",
    fontSize: 14,
    marginBottom: 6,
    display: "block",
  },
  select: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    background: "#020617",
    color: "#e5e7eb",
    border: "1px solid #334155",
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    background: "#020617",
    color: "#e5e7eb",
    border: "1px solid #334155",
  },
  textarea: {
    width: "100%",
    minHeight: 90,
    padding: 10,
    borderRadius: 8,
    background: "#020617",
    color: "#e5e7eb",
    border: "1px solid #334155",
  },
  file: { width: "100%", color: "#e5e7eb" },
  highlight: {
    background: "#020617",
    border: "1px solid #1e293b",
    padding: 10,
    borderRadius: 8,
    color: "#a5b4fc",
    marginBottom: 15,
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
