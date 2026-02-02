import { useEffect, useState } from "react";
import axios from "axios";
import CompetitionCard from "./CompetitionCard";

export default function CompetitionList() {
  const [events, setEvents] = useState([]);
  const token = localStorage.getItem("access");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/events/all/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEvents(res.data));
  }, []);

  return (
    <section className="competition-section">
      <h2>Upcoming Competitions</h2>

      <div className="competition-grid">
        {events.map((event) => (
          <CompetitionCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
