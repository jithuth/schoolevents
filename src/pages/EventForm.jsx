import api from "../api/axios";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

export default function EventCard({ event, refresh, onEdit }) {
  const { user } = useContext(AuthContext);

  const register = async () => {
    await api.post(
      "events/register/",
      { event: event.id }
    );
    alert("Registered successfully");
  };

  const remove = async () => {
    await api.delete(
      `events/${event.id}/`
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
