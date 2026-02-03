import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import VotingCard from "../components/VotingCard";
import { AuthContext } from "../auth/AuthContext";
import "../styles/Voting.css";

export default function Voting() {
  const { user } = useContext(AuthContext);

  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("live");
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch events (PUBLIC) - only live events for voting
  const fetchEvents = async () => {
    try {
      const res = await api.get(
        "events/all/"
      );
      // Filter only live events
      const liveEvents = res.data.filter(e => e.status === "live");
      setEvents(liveEvents);
    } catch (err) {
      console.error("Fetch events error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // 🔹 Cast vote
  const castVote = async (eventId) => {
    if (!user) {
      alert("Please login to vote");
      return;
    }

    try {
      await api.post(
        "votes/",
        { event: eventId }
      );
      alert("Vote cast successfully! 🗳️");
      fetchEvents();
    } catch (err) {
      alert(
        err.response?.data?.error ||
        "You may have already voted or voting is closed"
      );
    }
  };

  if (loading) {
    return <p style={{ padding: 20, textAlign: "center" }}>Loading voting events...</p>;
  }

  return (
    <div className="voting-container">
      {/* HERO SECTION */}
      <div className="voting-hero">
        <h1>🗳️ Public Voting</h1>
        <p>Vote for your favorite performances and help choose the winners!</p>
      </div>

      {/* STATUS INDICATOR */}
      <div className="voting-status">
        <span className="live-badge">🔴 LIVE VOTING</span>
        <p>Cast your vote for ongoing competitions</p>
      </div>

      {/* VOTING GRID */}
      <div className="voting-section">
        {events.length === 0 ? (
          <div className="no-events">
            <p>No live voting events at the moment.</p>
            <p>Check back soon!</p>
          </div>
        ) : (
          <div className="voting-grid">
            {events.map((event) => (
              <VotingCard
                key={event.id}
                event={event}
                user={user}
                onVote={castVote}
              />
            ))}
          </div>
        )}
      </div>

      {/* INFO SECTION */}
      <div className="voting-info">
        <h3>How Voting Works</h3>
        <ul>
          <li>✅ Each registered user gets one vote per competition</li>
          <li>🎬 Vote for your favorite performance</li>
          <li>📊 Results are calculated in real-time</li>
          <li>🏆 Top performers advance to finals</li>
        </ul>
      </div>
    </div>
  );
}
