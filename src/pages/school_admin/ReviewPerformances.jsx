import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../styles/ReviewPerformances.css";

export default function ReviewPerformances() {
  const [performances, setPerformances] = useState([]);

  /* 🔹 LOAD PERFORMANCES */
  useEffect(() => {
    api
      .get("school-admin/performances/")
      .then((res) => {
        setPerformances(res.data);
      })
      .catch((err) => {
        console.error("Load error:", err);
      });
  }, []);

  /* 🔹 APPROVE / REJECT */
  const updateStatus = (id, action) => {
    api
      .post(`school-admin/performances/${id}/action/`, { action })
      .then(() => {
        setPerformances((prev) =>
          prev.map((p) =>
            p.id === id
              ? { ...p, status: action === "approve" ? "approved" : "rejected" }
              : p
          )
        );
      })
      .catch(() => alert("Failed to update status"));
  };

  return (
    <div className="review-page">
      <h2>Review Performances</h2>

      <div className="performance-grid">
        {performances.map((p) => (
          <div className="performance-card" key={p.id}>
            <h3>{p.title}</h3>

            {/* ✅ FIXED FIELDS */}
            <p>
              <b>Student:</b> {p.student_name}
            </p>

            <p>
              <b>School:</b> {p.school_name}
            </p>

            <p>
              <b>Event:</b> {p.event_title}
            </p>

            {/* 🎥 VIDEO */}
            <video
              controls
              preload="metadata"
              style={{
                width: "100%",
                borderRadius: "12px",
                backgroundColor: "#000",
              }}
            >
              <source
                src={`http://127.0.0.1:8000${p.video}`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>

            {/* STATUS */}
            <p className={`status ${p.status}`}>
              {p.status.toUpperCase()}
            </p>

            {/* ACTIONS */}
            {p.status === "pending" && (
              <div className="action-buttons">
                <button
                  className="approve"
                  onClick={() => updateStatus(p.id, "approve")}
                >
                  Approve
                </button>

                <button
                  className="reject"
                  onClick={() => updateStatus(p.id, "reject")}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}

        {performances.length === 0 && (
          <p style={{ color: "#aaa" }}>No performances submitted yet</p>
        )}
      </div>
    </div>
  );
}
