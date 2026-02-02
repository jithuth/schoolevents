// src/pages/EventCard.jsx
import axios from "../api/axios";

export default function EventCard({
  event,
  user,
  onInterest,
  onEdit,
  onDeleted,
}) {
  const canShowInterestButton =
    user?.role === "student" && event.status === "upcoming";

  const remove = async () => {
    await axios.delete(`/events/${event.id}/`);
    onDeleted();
  };

  return (
    <div className="event-card">
      <div className="event-image">
        <img
          src={
            event.image ||
            "https://images.unsplash.com/photo-1511379938547-c1f69419868d"
          }
          alt={event.title}
        />
        <span className={`badge ${event.status}`}>
          {event.status.toUpperCase()}
        </span>
      </div>

      <div className="event-content">
        <h3 className="event-title">{event.title}</h3>

        <p className="event-dates">
          📅 <b>Start:</b>{" "}
          {new Date(event.start_time).toLocaleString()} &nbsp; | &nbsp;
          ⏳ <b>End:</b>{" "}
          {new Date(event.end_time).toLocaleString()}
        </p>

        <p className="event-desc">{event.description}</p>

        <p className="meta">
          <b>Type:</b> {event.event_type} &nbsp; | &nbsp;
          <b>Category:</b> {event.category}
        </p>

        <div className="actions">
          {canShowInterestButton && (
            <>
              {event.is_interested ? (
                <button className="disabled" disabled>
                  Interested ✓
                </button>
              ) : (
                <button
                  className="primary"
                  onClick={() => onInterest(event.id)}
                >
                  I'm Interested
                </button>
              )}
            </>
          )}

          {user?.role === "school_admin" && (
            <>
              <button className="secondary" onClick={() => onEdit(event)}>
                Edit
              </button>
              <button className="danger" onClick={remove}>
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
