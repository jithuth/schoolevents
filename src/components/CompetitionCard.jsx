import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import "../styles/Competition.css";

export default function CompetitionCard({ event }) {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("access");

  const registerEvent = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/events/register/",
        { event: event.id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Registered successfully ✅");
    } catch {
      alert("Registration failed ❌");
    }
  };

  const deleteEvent = async () => {
    if (!window.confirm("Delete this event?")) return;

    await axios.delete(
      `http://127.0.0.1:8000/api/events/${event.id}/`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    window.location.reload();
  };

  return (
    <div className="competition-card">
      <div className="image-box">
        <img
          src={event.image || "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2"}
          alt="event"
        />
        <span className="tag">{event.category}</span>
      </div>

      <div className="card-content">
        <h3>{event.title}</h3>
        <p>📅 {new Date(event.start_time).toDateString()} - {new Date(event.end_time).toDateString()}</p>
        <p>🏆 Max Participants: {event.max_participants}</p>
        <p>Status: <b>{event.status}</b></p>

        {/* STUDENT */}
        {user?.role === "student" && event.status === "upcoming" && (
          <button onClick={registerEvent}>Register</button>
        )}

        {/* ADMIN */}
        {user?.role === "admin" && (
          <div style={{ display: "flex", gap: "10px" }}>
            <button>Edit</button>
            <button onClick={deleteEvent} style={{ background: "red" }}>
              Delete
            </button>
          </div>
        )}

        {/* DEFAULT */}
        {!user && <button>View Details</button>}
      </div>
    </div>
  );
}
