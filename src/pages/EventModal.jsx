// src/pages/EventModal.jsx
import { useEffect, useState } from "react";
import axios from "../api/axios";
import "../styles/EventModal.css";

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

export default function EventModal({ event, onClose, onSaved }) {
  const [school, setSchool] = useState(null);

  const [data, setData] = useState({
    title: event?.title ?? "",
    description: event?.description ?? "",
    category: event?.category ?? "",
    rules: event?.rules ?? "",
    event_type: event?.event_type ?? "",
    max_participants: event?.max_participants ?? "",
    start_time: toDateTimeLocal(event?.start_time),
    end_time: toDateTimeLocal(event?.end_time),
  });

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
    <div className="modal-backdrop">
      <div className="modal-card">
        <h2>{event ? "Edit Event" : "Create Event"}</h2>

        <label>School</label>
        <select disabled value={school?.id || ""}>
          {school ? (
            <option value={school.id}>{school.name}</option>
          ) : (
            <option>Loading...</option>
          )}
        </select>

        <form onSubmit={submit}>
          <input
            placeholder="Title"
            value={data.title}
            onChange={(e) =>
              setData({ ...data, title: e.target.value })
            }
            required
          />

          <textarea
            placeholder="Description"
            value={data.description}
            onChange={(e) =>
              setData({ ...data, description: e.target.value })
            }
            required
          />

          <select
            value={data.event_type}
            onChange={(e) =>
              setData({ ...data, event_type: e.target.value })
            }
            required
          >
            <option value="">Event Type</option>
            <option value="intra">Intra</option>
            <option value="inter">Inter</option>
          </select>

          <input
            placeholder="Category"
            value={data.category}
            onChange={(e) =>
              setData({ ...data, category: e.target.value })
            }
            required
          />

          <textarea
            placeholder="Rules"
            value={data.rules}
            onChange={(e) =>
              setData({ ...data, rules: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Max Participants"
            value={data.max_participants}
            onChange={(e) =>
              setData({ ...data, max_participants: e.target.value })
            }
            required
          />

          {/* ✅ DATE PICKERS (FORMAT SAFE) */}
          <label className="date-label">Start Time</label>
          <div className="date-input-wrapper">
            <input
              type="datetime-local"
              value={data.start_time}
              onChange={(e) =>
                setData({ ...data, start_time: e.target.value })
              }
              required
            />
          </div>

          <label className="date-label">End Time</label>
          <div className="date-input-wrapper">
            <input
              type="datetime-local"
              value={data.end_time}
              onChange={(e) =>
                setData({ ...data, end_time: e.target.value })
              }
              required
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="save-btn">Save</button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
