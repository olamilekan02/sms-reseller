import { useEffect, useState, useRef } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const REFRESH_INTERVAL = 10000; // 10 seconds

export default function SmsInboxEnhanced({ numberId, rentalExpiry }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const prevMessageIds = useRef(new Set()); // track messages already shown
  const intervalRef = useRef(null);

  // Format milliseconds into HH:MM:SS
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Fetch messages from backend
  const fetchMessages = async () => {
    try {
      const res = await api.get(`/user/messages/${numberId}`);
      const newMessages = res.data.messages || [];

      // Trigger toast for new messages
      newMessages.forEach((msg) => {
        if (!prevMessageIds.current.has(msg._id)) {
          toast.info(`New message from ${msg.from}`);
          prevMessageIds.current.add(msg._id);
        }
      });

      setMessages(newMessages);

      // Stop fetching if number expired
      if (res.data.expired) {
        clearInterval(intervalRef.current);
      }
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh messages
  useEffect(() => {
    fetchMessages(); // initial load
    intervalRef.current = setInterval(fetchMessages, REFRESH_INTERVAL);
    return () => clearInterval(intervalRef.current); // cleanup
  }, [numberId]);

  // Countdown for rental expiry
  useEffect(() => {
    if (!rentalExpiry) return;
    const timer = setInterval(() => {
      const diff = new Date(rentalExpiry) - new Date();
      setTimeRemaining(diff > 0 ? diff : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, [rentalExpiry]);

  if (loading) return <p>Loading messages…</p>;

  return (
    <div>
      <h3>SMS Inbox</h3>

      {rentalExpiry && timeRemaining > 0 && (
        <p style={{ color: timeRemaining < 3600000 ? "orange" : "black" }}>
          Time remaining: {formatTime(timeRemaining)}
        </p>
      )}

      {timeRemaining === 0 && (
        <p style={{ color: "red" }}>
          Rental expired — please rent a new number
        </p>
      )}

      {messages.length === 0 && timeRemaining > 0 && (
        <p>No SMS received yet.</p>
      )}

      {messages.map((msg) => (
        <div
          key={msg._id}
          className="sms-card"
          style={{
            border: "1px solid #ccc",
            margin: "10px 0",
            padding: "5px",
          }}
        >
          <p><strong>From:</strong> {msg.from}</p>
          <p><strong>Message:</strong> {msg.body}</p>
          <p><small>{new Date(msg.timestamp).toLocaleString()}</small></p>
        </div>
      ))}
    </div>
  );
}
