import { useEffect, useState } from "react";
import api from "../api/axios";
import CompetitionCard from "./CompetitionCard";

export default function CompetitionList() {
  const [events, setEvents] = useState([]);
  const token = localStorage.getItem("access");

  useEffect(() => {
    api
      .get("events/all/")
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
