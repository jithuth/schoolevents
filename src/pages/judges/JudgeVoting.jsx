import { useEffect, useState } from "react";
import api, { MEDIA_BASE_URL } from "../../api/axios";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";

export default function JudgeVoting() {
  const [performances, setPerformances] = useState([]);
  const [scores, setScores] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get("judge/performances/")
      .then((res) => setPerformances(res.data))
      .catch(() => setMessage("Unauthorized / Failed to load performances"));
  }, []);

  const handleChange = (id, field, value) => {
    setScores((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: field === "feedback" ? value : Number(value),
      },
    }));
  };

  const submitScore = async (id) => {
    const d = scores[id];
    if (!d || d.creativity == null || d.technique == null || d.presentation == null) {
      alert("Please fill all scores");
      return;
    }

    try {
      await api.post("judge/evaluations/", {
        performance: id,
        creativity: d.creativity,
        technique: d.technique,
        presentation: d.presentation,
        feedback: d.feedback || "",
      });
      alert("Score submitted successfully ✅");
    } catch {
      alert("You already evaluated / session expired");
    }
  };

  return (
    <Container className="py-5" style={{ minHeight: "80vh" }}>
      <div className="text-center mb-5">
        <h2 className="display-4 fw-bold mb-2">⚖️ Judge Voting</h2>
        <p className="text-secondary">Evaluate student performances fairly</p>
      </div>

      {message && <Alert variant="danger" className="text-center">{message}</Alert>}

      <div className="d-flex flex-column gap-5">
        {performances.map((p) => (
          <Card key={p.id} className="glass-card shadow-lg border-0 overflow-hidden">
            <Row className="g-0">
              {/* LEFT : VIDEO */}
              <Col lg={7} className="bg-black d-flex align-items-center justify-content-center">
                <video
                  controls
                  preload="metadata"
                  src={`${MEDIA_BASE_URL}${p.video}`}
                  className="w-100"
                  style={{ maxHeight: "500px" }}
                />
              </Col>

              {/* RIGHT : DETAILS + SCORE */}
              <Col lg={5}>
                <Card.Body className="p-4 d-flex flex-column h-100">
                  <div className="mb-4">
                    <h3 className="fw-bold text-white mb-2">{p.title}</h3>
                    <div className="d-flex flex-column gap-1 text-secondary">
                      <span><i className="bi bi-person-fill me-2"></i> <b>Student:</b> {p.student}</span>
                      <span><i className="bi bi-tag-fill me-2"></i> <b>Event:</b> {p.event_title}</span>
                    </div>
                  </div>

                  <Form className="flex-grow-1">
                    <Row className="g-3 mb-3">
                      <Col xs={4}>
                        <Form.Label className="text-white small">Creativity (10)</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="0-10"
                          min="0"
                          max="10"
                          className="bg-dark text-white border-secondary"
                          onChange={(e) => handleChange(p.id, "creativity", e.target.value)}
                        />
                      </Col>
                      <Col xs={4}>
                        <Form.Label className="text-white small">Technique (10)</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="0-10"
                          min="0"
                          max="10"
                          className="bg-dark text-white border-secondary"
                          onChange={(e) => handleChange(p.id, "technique", e.target.value)}
                        />
                      </Col>
                      <Col xs={4}>
                        <Form.Label className="text-white small">Presenttn (10)</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="0-10"
                          min="0"
                          max="10"
                          className="bg-dark text-white border-secondary"
                          onChange={(e) => handleChange(p.id, "presentation", e.target.value)}
                        />
                      </Col>
                    </Row>

                    <Form.Group className="mb-4">
                      <Form.Label className="text-white small">Feedback</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Optional feedback..."
                        className="bg-dark text-white border-secondary"
                        onChange={(e) => handleChange(p.id, "feedback", e.target.value)}
                      />
                    </Form.Group>

                    <Button
                      className="w-100 fw-bold border-0"
                      onClick={() => submitScore(p.id)}
                      style={{ background: "linear-gradient(to right, #6366f1, #ec4899)", padding: "10px" }}
                    >
                      Submit Score
                    </Button>
                  </Form>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        ))}
      </div>
    </Container>
  );
}
