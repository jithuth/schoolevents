import "../styles/VotingCard.css";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

export default function VotingCard({ event, user, onVote }) {
  return (
    <div className="voting-card">
      <div className="voting-image-box">
        <img
          src={event.image || "https://images.unsplash.com/photo-1516280440614-37967140862f"}
          alt={event.title}
        />
        <span className="voting-tag">
          {event.category}
        </span>
        <div className="vote-overlay">
          <span className="vote-count">👥 {event.vote_count || 0} votes</span>
        </div>
      </div>

      <div className="voting-card-content">
        <h3>{event.title}</h3>
        <p className="event-description">{event.description}</p>
        
        <div className="event-meta">
          <span>📅 {new Date(event.start_time).toLocaleDateString()}</span>
          <span>🏆 Category: {event.category}</span>
        </div>

        <p className="event-type">
          {event.event_type === "inter" ? "🌍 Inter-School" : "🏫 Intra-School"}
        </p>

        {/* VOTING BUTTON */}
        {user ? (
          <button 
            className="vote-button"
            onClick={() => onVote(event.id)}
          >
            🗳️ Cast Your Vote
          </button>
        ) : (
          <button className="vote-button-disabled" disabled>
            Login to Vote
          </button>
        )}
      </div>
    </div>
  );
}
