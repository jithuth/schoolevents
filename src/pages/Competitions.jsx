// src/pages/Competitions.jsx
import { useEffect, useState, useContext } from "react";
import axios from "../api/axios";
import EventCard from "./EventCard";
import EventModal from "./EventModal";
import { AuthContext } from "../auth/AuthContext";
import { Container, Row, Col, Button, ButtonGroup, Spinner } from "react-bootstrap";

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
      alert("Interest submitted successfully ✅");
      fetchEvents();

    } catch (err) {
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

  return (
    <Container className="py-5" style={{ minHeight: "80vh" }}>
      <div className="text-center mb-5">
        <h2 className="display-4 fw-bold mb-3">Competitions</h2>
        <p className="text-secondary lead">Join the battle and show your skills</p>
      </div>

      {/* STATUS TABS */}
      <div className="d-flex justify-content-center mb-5">
        <ButtonGroup className="shadow-lg p-1 bg-dark rounded-pill">
          {["upcoming", "live", "completed"].map((s) => (
            <Button
              key={s}
              variant={status === s ? "primary" : "dark"}
              onClick={() => setStatus(s)}
              className="rounded-pill px-4 py-2 border-0 fw-bold"
              style={status === s ? { background: "linear-gradient(to right, #6366f1, #ec4899)" } : { color: "#9ca3af" }}
            >
              {s.toUpperCase()}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {/* SCHOOL ADMIN → CREATE EVENT */}
      {user?.role === "school_admin" && (
        <div className="d-flex justify-content-end mb-4">
          <Button
            onClick={() => {
              setEditingEvent(null);
              setShowModal(true);
            }}
            variant="success"
            className="rounded-pill px-4 fw-bold shadow"
          >
            <i className="bi bi-plus-lg me-2"></i> Create New Event
          </Button>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {/* NO EVENTS */}
      {!loading && filteredEvents.length === 0 && (
        <div className="text-center py-5 glass-card rounded-4">
          <p className="text-secondary fs-4 mb-0">No {status} competitions found.</p>
        </div>
      )}

      {/* EVENTS GRID */}
      <Row xs={1} md={2} lg={3} className="g-4">
        {filteredEvents.map((event) => (
          <Col key={event.id}>
            <EventCard
              event={event}
              user={user}
              onInterest={sendInterest}
              onEdit={(ev) => {
                setEditingEvent(ev);
                setShowModal(true);
              }}
              onDeleted={fetchEvents}
            />
          </Col>
        ))}
      </Row>

      {/* EVENT MODAL */}
      <EventModal
        show={showModal}
        event={editingEvent}
        onClose={() => setShowModal(false)}
        onSaved={() => {
          fetchEvents();
          setShowModal(false);
        }}
      />
    </Container>
  );
}
