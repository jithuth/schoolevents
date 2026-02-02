import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../styles/JudgeVoting.css";

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
    <div className="judge-page">
      <h2 className="judge-title">⚖️ Judge Voting</h2>

      {message && <p className="error">{message}</p>}

      <div className="judge-grid">
        {performances.map((p) => (
          <div className="judge-card" key={p.id}>
            {/* LEFT : VIDEO */}
            <div className="judge-video">
              <video
                controls
                preload="metadata"
                src={`http://localhost:8000${p.video}`}
              />
            </div>

            {/* RIGHT : DETAILS + SCORE */}
            <div className="judge-info">
              <h3>{p.title}</h3>
              <p><b>Student:</b> {p.student}</p>
              <p><b>Event:</b> {p.event_title}</p>

              <div className="score-inputs">
                <input
                  type="number"
                  placeholder="Creativity"
                  min="0"
                  max="10"
                  onChange={(e) => handleChange(p.id, "creativity", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Technique"
                  min="0"
                  max="10"
                  onChange={(e) => handleChange(p.id, "technique", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Presentation"
                  min="0"
                  max="10"
                  onChange={(e) =>
                    handleChange(p.id, "presentation", e.target.value)
                  }
                />
              </div>

              <textarea
                placeholder="Feedback (optional)"
                onChange={(e) => handleChange(p.id, "feedback", e.target.value)}
              />

              <button
                className="submit-btn"
                onClick={() => submitScore(p.id)}
              >
                Submit Score
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
