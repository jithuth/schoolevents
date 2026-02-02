import { useEffect, useState } from "react";
import axios from "axios";

export default function SubmitVideo() {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 🔹 Fetch registered LIVE events
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/my-registered-live-events/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
      .then((res) => setEvents(res.data))
      .catch((err) =>
        console.error("Error fetching registered events", err)
      )
      .finally(() => setLoading(false));
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    if (!video) {
      alert("Please select a video");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("event", eventId);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("video", video);
      formData.append("duration_seconds", 0); // ✅ REQUIRED

      await axios.post(
        "http://127.0.0.1:8000/api/student/performances/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Video uploaded successfully");

      setEventId("");
      setTitle("");
      setDescription("");
      setVideo(null);
    } catch (err) {
      console.error(err.response?.data);
      alert(
        JSON.stringify(err.response?.data || "Upload failed", null, 2)
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20, maxWidth: 500 }}>
      <h2>Submit Performance Video</h2>

      {events.length === 0 ? (
        <p>You have no live registered competitions.</p>
      ) : (
        <form onSubmit={submit}>
          <label>Competition</label>
          <select
            required
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
          >
            <option value="">Select competition</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>

          <br /><br />

          <label>Video Title</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <br /><br />

          <label>Description</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <br /><br />

          <label>Video File</label>
          <input
            type="file"
            accept="video/*"
            required
            onChange={(e) => setVideo(e.target.files[0])}
          />

          <br /><br />

          <button disabled={submitting}>
            {submitting ? "Uploading..." : "Submit Video"}
          </button>
        </form>
      )}
    </div>
  );
}
