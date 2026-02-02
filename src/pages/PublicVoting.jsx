import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../auth/AuthContext";
import "../styles/PublicVoting.css";

export default function PublicVoting() {
  const { user } = useContext(AuthContext);

  const [liveEvents, setLiveEvents] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("live");
  const [message, setMessage] = useState("");

  // 🔹 Load events
  useEffect(() => {
    api.get("/events/live/")
      .then((res) => setLiveEvents(res.data))
      .catch(() => setLiveEvents([]));

    api.get("/events/completed/")
      .then((res) => setCompletedEvents(res.data))
      .catch(() => setCompletedEvents([]));
  }, []);

  // 🔹 Vote handler
  const vote = async (performanceId) => {
    // 🚫 FRONTEND ROLE CHECK (UX only)
    if (!user) {
      setMessage("🔐 Please login to vote");
      return;
    }

    if (user.role !== "public") {
      setMessage("❌ You are not eligible to vote in public voting");
      return;
    }

    try {
      const res = await api.post("/votes/", {
        performance: performanceId,
      });

      setMessage(res.data?.message || "✅ Vote submitted successfully");
    } catch (err) {
      // 🔥 SHOW BACKEND MESSAGE EXACTLY
      setMessage(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "❌ You have already voted"
      );
    }
  };

  const events = activeTab === "live" ? liveEvents : completedEvents;

  return (
    <div className="pv-dark-container">
      <h2 className="pv-title">🗳️ Public Voting</h2>

      {/* Tabs */}
      <div className="pv-tabs">
        <button
          className={activeTab === "live" ? "active live-tab" : ""}
          onClick={() => setActiveTab("live")}
        >
          🔴 Live Events
        </button>

        <button
          className={activeTab === "completed" ? "active" : ""}
          onClick={() => setActiveTab("completed")}
        >
          ✅ Completed Events
        </button>
      </div>

      {/* Message */}
      {message && <p className="pv-message">{message}</p>}

      {events.length === 0 && (
        <p className="pv-empty">No events available</p>
      )}

      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          votingOpen={activeTab === "live"}
          user={user}
          onVote={vote}
        />
      ))}
    </div>
  );
}

/* ================= EVENT CARD ================= */

function EventCard({ event, votingOpen, user, onVote }) {
  const [performances, setPerformances] = useState([]);

  useEffect(() => {
    api
      .get(`/public/performances/?event=${event.id}`)
      .then((res) => setPerformances(res.data))
      .catch(() => setPerformances([]));
  }, [event.id]);

  return (
    <div className={`event-card ${votingOpen ? "live-jump" : ""}`}>
      <h3>{event.title}</h3>

      {performances.length === 0 && (
        <p className="pv-empty">No performances available</p>
      )}

      <div className="performance-grid">
        {performances.map((p) => (
          <div className="performance-card" key={p.id}>
            <video
              src={`http://127.0.0.1:8000${p.video}`}
              controls
            />

            <h4>{p.student_name}</h4>
            <p className="school">{p.school_name}</p>

            {/* 🔒 Voting rules */}
            {votingOpen ? (
              user?.role === "public" ? (
                <button
                  className="vote-btn"
                  onClick={() => onVote(p.id)}
                >
                  ❤️ Vote Now
                </button>
              ) : (
                <p className="login-msg">
                  🚫 Only public users can vote
                </p>
              )
            ) : (
              <p className="closed">🏁 Voting Closed</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
