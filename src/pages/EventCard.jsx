// src/pages/EventCard.jsx
import axios from "../api/axios";
import { Card, Badge, Button, Row, Col } from "react-bootstrap";

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
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`/events/${event.id}/`);
        if (onDeleted) onDeleted();
        else window.location.reload();
      } catch (err) {
        alert("Failed to delete event");
      }
    }
  };

  const statusVariant = {
    upcoming: "primary",
    live: "danger",
    completed: "secondary"
  };

  return (
    <Card className="h-100 border-0 shadow-sm glass-card text-white overflow-hidden">
      <div className="position-relative" style={{ height: "200px" }}>
        <Card.Img
          variant="top"
          src={event.image || "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80"}
          style={{ height: "100%", objectFit: "cover" }}
        />
        <div className="position-absolute top-0 end-0 m-3">
          <Badge bg={statusVariant[event.status]} className="px-3 py-2 rounded-pill shadow-sm">
            {event.status.toUpperCase()}
          </Badge>
        </div>
        <div className="position-absolute bottom-0 start-0 w-100 p-3" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
          <small className="text-light fw-bold"><i className="bi bi-tag-fill me-1"></i> {event.category}</small>
        </div>
      </div>

      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-bold mb-3">{event.title}</Card.Title>

        <div className="mb-3 text-secondary small">
          <div className="d-flex align-items-center mb-1">
            <i className="bi bi-calendar-event me-2 text-primary"></i>
            <span>Start: {new Date(event.start_time).toLocaleDateString()}</span>
          </div>
          <div className="d-flex align-items-center">
            <i className="bi bi-people me-2 text-info"></i>
            <span>Max Participants: {event.max_participants}</span>
          </div>
        </div>

        <Card.Text className="text-secondary small mb-4 flex-grow-1" style={{ whiteSpace: "pre-wrap" }}>
          {event.description?.length > 100 ? event.description.substring(0, 100) + "..." : event.description}
        </Card.Text>

        <div className="mt-auto">
          {canShowInterestButton && (
            event.is_interested ? (
              <Button variant="success" className="w-100 rounded-pill" disabled>
                <i className="bi bi-check-circle-fill me-2"></i> Registered
              </Button>
            ) : (
              <Button
                onClick={() => onInterest(event.id)}
                className="w-100 rounded-pill text-white fw-bold"
                style={{ background: "linear-gradient(to right, #6366f1, #ec4899)", border: "none" }}
              >
                Register Now
              </Button>
            )
          )}

          {user?.role === "school_admin" && (
            <Row className="g-2">
              <Col>
                <Button variant="outline-light" className="w-100 rounded-pill" onClick={() => onEdit(event)}>
                  Edit
                </Button>
              </Col>
              <Col>
                <Button variant="outline-danger" className="w-100 rounded-pill" onClick={remove}>
                  Delete
                </Button>
              </Col>
            </Row>
          )}

          {!user && (
            <Button variant="secondary" className="w-100 rounded-pill" disabled style={{ opacity: 0.6 }}>
              Login to Register
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
