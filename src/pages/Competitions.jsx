// src/pages/Competitions.jsx
import { useEffect, useState, useContext } from "react";
import axios from "../api/axios"; // ✅ custom axios
import EventCard from "./EventCard";
import EventModal from "./EventModal";
import { AuthContext } from "../auth/AuthContext";
import "../styles/Competition.css";

export default function Competitions() {
  const { user } = useContext(AuthContext);

  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("upcoming");
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // 🔹 FETCH EVENTS
  const fetchEvents = async () => {
    try {
      const res = await axios.get("/events/all/");
      setEvents(res.data);
    } catch (err) {
      console.error("Fetch events error", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // 🎓 STUDENT → INTEREST (STATUS-BASED HANDLING)
  const sendInterest = async (eventId) => {
    try {
      await axios.post(`/events/${eventId}/interest/`);

      // ✅ SUCCESS
      alert("Interest submitted successfully ✅");
      fetchEvents();

    } catch (err) {
      // ❌ ERROR HANDLING (ONLY 2 MESSAGES)
      if (err.response) {
        if (err.response.status === 400) {
          alert("Already submitted");
        } else if (err.response.status === 403) {
          alert("You are not eligible for this event");
        } else {
          alert("Something went wrong");
        }
      } else {
        alert("Network error");
      }
    }
  };

  const filteredEvents = events.filter(
    (e) => e.status === status
  );

  if (loading) {
    return <p style={{ padding: 20 }}>Loading competitions...</p>;
  }

  return (
    <div className="competitions-wrapper">
      <h2>Competitions</h2>

      {/* STATUS TABS */}
      <div className="status-tabs">
        {["upcoming", "live", "completed"].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`status-btn ${status === s ? "active" : ""}`}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {/* SCHOOL ADMIN → CREATE EVENT */}
      {user?.role === "school_admin" && (
        <button
          style={{ marginBottom: 20 }}
          onClick={() => {
            setEditingEvent(null);
            setShowModal(true);
          }}
        >
          ➕ Create Event
        </button>
      )}

      {/* EVENT MODAL */}
      {showModal && (
        <EventModal
          event={editingEvent}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            fetchEvents();
            setShowModal(false);
          }}
        />
      )}

      {/* NO EVENTS */}
      {filteredEvents.length === 0 && (
        <p>No competitions found.</p>
      )}

      {/* EVENTS GRID */}
      <div className="events-grid">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            user={user}
            onInterest={sendInterest}
            onEdit={(ev) => {
              setEditingEvent(ev);
              setShowModal(true);
            }}
          />
        ))}
      </div>
    </div>
  );
}
