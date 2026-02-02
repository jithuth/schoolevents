import { useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import { AuthContext } from "../auth/AuthContext";
import "../styles/LiveChatCommunity.css";

export default function LiveChat() {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) return;

    const load = () => {
      axios
        .get("/chat/messages/")
        .then((res) => setMessages(res.data))
        .catch((err) => console.error("Chat load error", err));
    };

    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, [open]);

  const send = async () => {
    if (!message.trim()) return;

    try {
      await axios.post("/chat/messages/", { message });
      setMessage("");
    } catch (err) {
      console.error("Send message error", err);
    }
  };

  if (!user) return null;

  return (
    <>
      <div className="chat-float" onClick={() => setOpen(!open)}>
        💬
      </div>

      {open && (
        <div className="chat-box">
          <div className="chat-header">
            Community Chat
            <span onClick={() => setOpen(false)}>✖</span>
          </div>

          <div className="chat-body">
            {messages.map((m, i) => (
              <div key={i} className="chat-msg">
                <b>{m.username}:</b> {m.message}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type message..."
            />
            <button onClick={send}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}
