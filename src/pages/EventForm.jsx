import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

export default function EventCard({ event, refresh, onEdit }) {
  const { user } = useContext(AuthContext);

  const register = async () => {
    await axios.post(
      "http://127.0.0.1:8000/api/events/register/",
      { event: event.id },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }
    );
    alert("Registered successfully");
  };

  const remove = async () => {
    await axios.delete(
      `http://127.0.0.1:8000/api/events/${event.id}/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }
    );
    refresh();
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: 15 }}>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <p>Status: {event.status}</p>

      {/* 🎓 STUDENT */}
      {user?.role === "student" && event.status === "upcoming" && (
        <button onClick={register}>Register</button>
      )}

      {/* 🏫 SCHOOL ADMIN */}
      {user?.role === "school_admin" && (
        <>
          <button onClick={() => onEdit(event)}>✏️ Edit</button>
          <button onClick={remove}>🗑 Delete</button>
        </>
      )}
    </div>
  );
}
