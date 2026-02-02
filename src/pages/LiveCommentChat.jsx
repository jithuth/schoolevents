import { useEffect, useState, useContext } from "react";
import axios from "../api/axios";
import { AuthContext } from "../auth/AuthContext";
import "../styles/LiveChat.css";

export default function LiveCommentChat({ performanceId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const { user } = useContext(AuthContext);

  // 🚫 Blocked roles
  const blockedRoles = [
    "teacher",
    "judge",
    "school_admin",
    "admin",
    "super_admin",
  ];

  const canChat =
    user && !blockedRoles.includes(user.profile?.role);

  // 🔄 RESET CHAT WHEN WINNER CHANGES
  useEffect(() => {
    if (!performanceId) return;

    // 🔥 CLEAR OLD CHAT
    setComments([]);
    setText("");

    const loadComments = async () => {
      try {
        const res = await axios.get(
          `/comments/?performance=${performanceId}`
        );
        setComments(res.data);
      } catch (err) {
        console.error("Comment load failed", err);
      }
    };

    loadComments();
    const interval = setInterval(loadComments, 3000);

    return () => clearInterval(interval);
  }, [performanceId]);

  // 🚀 SEND COMMENT
  const sendComment = async (e) => {
    e.preventDefault();

    if (!canChat) {
      alert("🚫 Only audience can participate in live chat");
      return;
    }

    if (!text.trim()) return;

    try {
      await axios.post("/comments/", {
        performance: performanceId,
        text,
      });
      setText("");
    } catch {
      alert("Failed to send comment");
    }
  };

  return (
    <div className="live-chat">
      <div className="live-header">
        <span className="live-dot"></span>
        <h3>🎤 Live Event Chat</h3>
        <span className="live-badge">LIVE 🔴</span>
      </div>

      <div className="chat-messages">
        {comments.length === 0 && (
          <p className="no-comments">
            💭 Be the first to cheer!
          </p>
        )}

        {comments.map((c) => (
          <div key={c.id} className="chat-message">
            <div className="chat-user">👤 {c.username}</div>
            <div className="chat-text">{c.text} ✨</div>
          </div>
        ))}
      </div>

      <form onSubmit={sendComment} className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            !user
              ? "🔒 Login to join live chat"
              : canChat
              ? "💬 Cheer the performer..."
              : "🚫 Chat disabled for your role"
          }
          disabled={!canChat}
        />
        <button disabled={!canChat}>🚀 Send</button>
      </form>
    </div>
  );
}
