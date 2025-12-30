import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";

export default function Messages() {
  const { numberId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [numberStatus, setNumberStatus] = useState("active");
  const [numberInfo, setNumberInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rebuyModal, setRebuyModal] = useState(null); // for rebuy confirmation

  useEffect(() => {
    let interval;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/user/messages/${numberId}`);

        setMessages(res.data.messages || []);
        setNumberInfo(res.data.number);
        const status = res.data.expired ? "expired" : "active";
        setNumberStatus(status);
        setLoading(false);

        if (status === "expired" && interval) clearInterval(interval);
      } catch (err) {
        console.warn("Failed to fetch messages:", err);
        setMessages([]);
        setNumberStatus("active");
        setLoading(false);
      }
    };

    fetchMessages();
    interval = setInterval(fetchMessages, 5000);

    return () => clearInterval(interval);
  }, [numberId]);

  const handleRebuy = () => {
    const now = new Date();
    const graceEnd = numberInfo.graceExpiry ? new Date(numberInfo.graceExpiry) : null;

    // If still in grace period → block rebuy
    if (numberInfo.otpReceived && graceEnd && graceEnd > now) {
      setRebuyModal({
        type: "blocked",
        timeLeft: Math.ceil((graceEnd - now) / 1000), // seconds left
      });
    } else {
      // Grace ended or no OTP yet → allow rebuy
      setRebuyModal({
        type: "confirm",
        purpose: numberInfo.purpose?.[0] || "unknown",
      });
    }
  };

  const confirmRebuy = async () => {
    try {
      const res = await api.post("/user/numbers/buy", {
        numberId,
        purpose: numberInfo.purpose?.[0] || "whatsapp",
      });
      toast.success(res.data.message || "Number renewed! Waiting for new OTP...");
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Rebuy failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-white to-indigo-100">
        <div className="text-purple-600 text-2xl font-bold animate-pulse">Loading messages...</div>
      </div>
    );
  }

  if (numberStatus === "expired") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-indigo-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg w-full text-center">
          <div className="text-6xl mb-6">⏰</div>
          <h2 className="text-3xl font-extrabold text-red-600 mb-4">Number Expired</h2>
          <p className="text-gray-600 text-lg mb-10">
            The OTP window has closed.<br />
            This number is no longer receiving messages.
          </p>

          <div className="flex gap-6 justify-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
            >
              Back to Dashboard
            </button>

            <button
              onClick={() => navigate("/dashboard/buy")}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:opacity-90 transition shadow-lg"
            >
              Buy New Number
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-indigo-100 p-6">
      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">📩 Messages Inbox</h1>
          <p className="text-gray-600">Real-time incoming messages</p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-3 rounded-xl bg-white border-2 border-purple-300 text-purple-700 font-semibold hover:bg-purple-50 transition shadow-md"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* NUMBER CARD + REBUY */}
      {numberInfo && (
        <div className="max-w-5xl mx-auto mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-6 text-white shadow-2xl">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">{numberInfo.number}</h2>
              <p className="text-purple-100 text-lg">
                {numberInfo.otpReceived ? (
                  <span className="flex items-center gap-3">
                    <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                    OTP Received — Grace period active (5 minutes)
                  </span>
                ) : (
                  "Waiting for first message..."
                )}
              </p>
            </div>

            {numberInfo.otpReceived && (
              <button
                onClick={handleRebuy}
                className="bg-white text-purple-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-purple-50 hover:shadow-xl transition transform hover:-translate-y-1"
              >
                🔄 Rebuy for New OTP
              </button>
            )}
          </div>
        </div>
      )}

      {/* MESSAGES INBOX */}
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-5">
          <h3 className="text-xl font-bold">Message History</h3>
        </div>

        <div className="p-8 min-h-96">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-6 text-gray-300">💤</div>
              <p className="text-xl text-gray-500">Waiting for incoming messages...</p>
              <p className="text-gray-400 mt-4">Send a message to this number to see it here instantly</p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages
                .slice()
                .reverse()
                .map((msg, index) => (
                  <div
                    key={msg._id || index}
                    className="bg-gradient-to-r from-purple-50 to-indigo-50 border-l-4 border-purple-600 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="font-bold text-purple-800 text-lg">
                          From: {msg.from || msg.sender || "Unknown Sender"}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
                        {new Date(msg.timestamp || msg.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-gray-800 text-lg leading-relaxed bg-white p-4 rounded-xl shadow-inner">
                      {msg.body || msg.message}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* REBUY MODAL */}
      {rebuyModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-10 text-center shadow-2xl max-w-lg w-full mx-4">
            {rebuyModal.type === "confirm" ? (
              <>
                <h2 className="text-3xl font-bold text-purple-800 mb-6">Rebuy Number?</h2>
                <p className="text-xl text-gray-700 mb-8">
                  Rebuy this number for a new OTP?<br />
                  <span className="font-bold text-red-600">You will be charged again.</span>
                </p>
                <div className="flex gap-6 justify-center">
                  <button
                    onClick={() => setRebuyModal(null)}
                    className="px-8 py-3 rounded-xl bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmRebuy}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:opacity-90 transition shadow-lg"
                  >
                    Yes, Rebuy Now
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-orange-600 mb-6">Cannot Rebuy Yet</h2>
                <p className="text-xl text-gray-700 mb-8">
                  You can only rebuy after the grace period ends.<br />
                  <span className="font-bold">Wait {rebuyModal.timeLeft}s or buy a new number.</span>
                </p>
                <div className="flex gap-6 justify-center">
                  <button
                    onClick={() => setRebuyModal(null)}
                    className="px-8 py-3 rounded-xl bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400 transition"
                  >
                    OK
                  </button>
                  <button
                    onClick={() => navigate("/dashboard/buy")}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:opacity-90 transition shadow-lg"
                  >
                    Buy New Number
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}