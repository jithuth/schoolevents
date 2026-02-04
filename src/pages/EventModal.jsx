// src/pages/EventModal.jsx
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

// 🔥 LOCAL → UTC (DO NOT CHANGE)
const toUTC = (localDateTime) => {
  if (!localDateTime) return "";
  return new Date(localDateTime).toISOString();
};

// 🔥 BACKEND → INPUT FORMAT (DO NOT CHANGE)
const toDateTimeLocal = (value) => {
  if (!value) return "";
  return value.replace("Z", "").slice(0, 16);
};

export default function EventModal({ show, event, onClose, onSaved }) {
  const [school, setSchool] = useState(null);

  const [data, setData] = useState({
    title: "",
    description: "",
    category: "",
    rules: "",
    event_type: "",
    max_participants: "",
    start_time: "",
    end_time: "",
  });

  useEffect(() => {
    if (show) {
      setData({
        title: event?.title ?? "",
        description: event?.description ?? "",
        category: event?.category ?? "",
        rules: event?.rules ?? "",
        event_type: event?.event_type ?? "",
        max_participants: event?.max_participants ?? "",
        start_time: toDateTimeLocal(event?.start_time),
        end_time: toDateTimeLocal(event?.end_time),
      });
    }
  }, [show, event]);

  // ✅ LOAD SCHOOL (AUTO TOKEN)
  useEffect(() => {
    axios.get("/school-dropdown/")
      .then((res) => {
        if (res.data.length === 1) {
          setSchool(res.data[0]);
        }
      })
      .catch((err) =>
        console.error("School dropdown error", err.response?.data)
      );
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      title: data.title,
      description: data.description,
      category: data.category,
      rules: data.rules,
      event_type: data.event_type,
      max_participants: Number(data.max_participants),
      start_time: toUTC(data.start_time),
      end_time: toUTC(data.end_time),
    };

    try {
      if (event) {
        await axios.put(`/events/${event.id}/`, payload);
      } else {
        await axios.post("/events/", payload);
      }
      onSaved();
    } catch (err) {
      alert(JSON.stringify(err.response?.data, null, 2));
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg" backdrop="static" className="text-dark">
      <Modal.Header closeButton className="bg-dark text-white border-secondary">
        <Modal.Title>{event ? "Edit Event" : "Create New Event"}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-white">
        <Form onSubmit={submit}>
          {/* School Readonly */}
          <Form.Group className="mb-3">
            <Form.Label>School</Form.Label>
            <Form.Select
              disabled
              value={school?.id || ""}
              className="bg-secondary text-white border-0"
            >
              {school ? (
                <option value={school.id}>{school.name}</option>
              ) : (
                <option>Loading...</option>
              )}
            </Form.Select>
          </Form.Group>

          {/* Title */}
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Event Title"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              required
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>

          {/* Description */}
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Event Description"
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              required
              rows={3}
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>

          <Row>
            {/* Event Type */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Type</Form.Label>
                <Form.Select
                  value={data.event_type}
                  onChange={(e) => setData({ ...data, event_type: e.target.value })}
                  required
                  className="bg-dark text-white border-secondary"
                >
                  <option value="">Select Type</option>
                  <option value="intra">Intra</option>
                  <option value="inter">Inter</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Category */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Music, Sports"
                  value={data.category}
                  onChange={(e) => setData({ ...data, category: e.target.value })}
                  required
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Max Participants */}
          <Form.Group className="mb-3">
            <Form.Label>Max Participants</Form.Label>
            <Form.Control
              type="number"
              placeholder="0"
              value={data.max_participants}
              onChange={(e) => setData({ ...data, max_participants: e.target.value })}
              required
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>

          {/* Rules */}
          <Form.Group className="mb-3">
            <Form.Label>Rules</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Rules and Regulations"
              value={data.rules}
              onChange={(e) => setData({ ...data, rules: e.target.value })}
              rows={3}
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>

          {/* Times */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Start Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={data.start_time}
                  onChange={(e) => setData({ ...data, start_time: e.target.value })}
                  required
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>End Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={data.end_time}
                  onChange={(e) => setData({ ...data, end_time: e.target.value })}
                  required
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2 pt-3 border-top border-secondary">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              style={{ background: "linear-gradient(to right, #6366f1, #ec4899)", border: "none" }}
            >
              Save Event
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
