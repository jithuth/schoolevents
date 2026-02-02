import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/Leaderboard.css";

export default function Leaderboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = () => {
      api
        .get("leaderboard/latest/")   // ✅ LATEST COMPLETED EVENT
        .then((res) => {
          setData(res.data);
          setError("");
        })
        .catch(() => setError("Leaderboard not available"));
    };

    fetchLeaderboard(); // initial load

    const interval = setInterval(fetchLeaderboard, 5000); // 🔁 auto refresh
    return () => clearInterval(interval);
  }, []);

  if (error) return <p className="leaderboard-error">{error}</p>;
  if (!data) return <p className="leaderboard-loading">Loading leaderboard...</p>;

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">
        🏆 {data.event_title} Leaderboard
      </h2>

      <div className="leaderboard-card">
        {data.leaderboard.map((row) => (
          <div
            key={row.performance_id}   // ✅ safer than rank
            className={`leaderboard-row rank-${row.rank}`}
          >
            {/* Rank */}
            <div className="rank-badge">
              {row.rank <= 3 ? ["🥇", "🥈", "🥉"][row.rank - 1] : row.rank}
            </div>

            {/* Student + School */}
            <div className="leaderboard-info">
              <h4>{row.student}</h4>
              <p>{row.school}</p>
            </div>

            {/* Score */}
            <div className="leaderboard-score">
              {row.final_score}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
