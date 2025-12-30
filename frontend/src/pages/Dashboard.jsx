import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";
import Currency from "../components/Currency";

export default function Dashboard() {
  const navigate = useNavigate();
  const [walletBalance, setWalletBalance] = useState(0);
  const [numbers, setNumbers] = useState([]);
  const [availableNumbers, setAvailableNumbers] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [username, setUsername] = useState("");
  const [cancelModal, setCancelModal] = useState(null);
  const [now, setNow] = useState(Date.now());

  // Timer for grace period countdown
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    fetchUser();
    fetchDashboard();

    // Show "Logged in successfully" if just logged in
    const justLoggedIn = localStorage.getItem("justLoggedIn");
    if (justLoggedIn) {
      toast.success(`🎉 Welcome back, ${username || "User"}! Your account is ready.`, {
        autoClose: 3000,
        pauseOnHover: true,
      });
      localStorage.removeItem("justLoggedIn");
    }
  }, []);

  // Refresh data when user returns to tab
  useEffect(() => {
    const handleFocus = () => fetchDashboard();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get("/user/me");
      setUsername(res.data.username || res.data.user?.username || "User");
    } catch (err) {
      console.error("Fetch user error:", err);
      setUsername("User");
    }
  };

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchWallet(), fetchMyNumbers(), fetchAvailableNumbers()]);
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWallet = async () => {
    try {
      const res = await api.get("/user/wallet");
      setWalletBalance(res.data.balance || 0);
    } catch (err) {
      console.error("Wallet fetch error:", err);
      setWalletBalance(0);
    }
  };

  const fetchMyNumbers = async () => {
    try {
      const res = await api.get("/user/numbers/my");
      const activeNumbers = res.data || [];
      setNumbers(activeNumbers);
      if (activeNumbers.length > 0 && !selectedNumber) {
        setSelectedNumber(activeNumbers[0]);
      }
    } catch (err) {
      console.error("My numbers error:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const fetchAvailableNumbers = async () => {
    try {
      const res = await api.get("/user/numbers/available");
      setAvailableNumbers(res.data || []);
    } catch (err) {
      console.error("Available numbers error:", err);
      setAvailableNumbers([]);
    }
  };

  const handleCancelNumber = async (numId) => {
    try {
      setLoading(true);
      const res = await api.post("/user/numbers/cancel", { numberId: numId });
      toast.success(res.data?.message || "Number cancelled successfully");
      await fetchDashboard();
      setCancelModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel number");
    } finally {
      setLoading(false);
    }
  };

  const isExpired = (n) => {
    if (!n.otpReceived) return false;
    if (!n.graceExpiry) return true;
    return new Date(n.graceExpiry) < new Date(now);
  };

  const getGraceTimeLeft = (n) => {
    if (!n.otpReceived || !n.graceExpiry || isExpired(n)) return null;
    const diff = new Date(n.graceExpiry) - now;
    const seconds = Math.floor(diff / 1000);
    if (seconds <= 0) return null;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const Spinner = () => (
    <div className="w-6 h-6 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
  );

  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen flex bg-gray-100 dark:bg-gray-900`}>
      {/* SIDEBAR */}
      <aside
        className={`fixed md:static z-40 w-64 min-w-[16rem] bg-gradient-to-b from-purple-700 via-purple-800 to-purple-900 text-white min-h-screen shadow-inner transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300`}
      >
        <div className="px-6 py-6 text-2xl font-bold tracking-wide border-b border-white/10 flex justify-between items-center">
          <span>LARRYSMS</span>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            ✕
          </button>
        </div>
        <nav className="flex flex-col px-4 py-6 space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive ? "bg-white/20 font-semibold shadow-lg" : "hover:bg-white/10"
              }`
            }
          >
            📊 <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/dashboard/buy"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive ? "bg-white/20 font-semibold shadow-lg" : "hover:bg-white/10"
              }`
            }
          >
            📱 <span>Buy Numbers</span>
          </NavLink>
          <NavLink
            to="/dashboard/fund-wallet"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive ? "bg-white/20 font-semibold shadow-lg" : "hover:bg-white/10"
              }`
            }
          >
            💳 <span>Fund Wallet</span>
          </NavLink>
          <NavLink
            to="/dashboard/transactions"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive ? "bg-white/20 font-semibold shadow-lg" : "hover:bg-white/10"
              }`
            }
          >
            📜 <span>Transactions</span>
          </NavLink>
          <div className="my-4 border-t border-white/10" />
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 transition"
          >
            🚪 <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="bg-white dark:bg-gray-800 shadow px-6 py-4 flex justify-between items-center">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-xl">
            ☰
          </button>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {username ? `${username.toUpperCase()}'S DASHBOARD` : "DASHBOARD"}
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/dashboard/fund-wallet")}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-xl hover:from-green-700 hover:to-emerald-700 transition font-semibold shadow-lg"
            >
              💰 Fund Wallet
            </button>
            <button
              onClick={() => navigate("/dashboard/buy")}
              className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition"
            >
              + Buy Numbers
            </button>
            <button
              onClick={() => navigate("/dashboard/transactions")}
              className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition"
            >
              Transactions
            </button>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="p-6 space-y-10">
          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Stat 
              label="Wallet Balance" 
              value={loading ? <Spinner /> : <Currency amount={walletBalance} className="text-3xl font-bold" />} 
              icon="💰" 
            />
            <Stat
              label="Status"
              value={
                loading ? (
                  <Spinner />
                ) : selectedNumber ? (
                  isExpired(selectedNumber) ? "Expired ❌" : "Active ✅"
                ) : (
                  "—"
                )
              }
              icon="📶"
            />
            <Stat label="My Numbers" value={loading ? <Spinner /> : numbers.length} icon="📱" />
          </div>

          {/* MY NUMBERS */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">My Numbers</h2>
            {loading ? (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            ) : numbers.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No numbers yet. Buy a number to get started.</p>
            ) : (
              <div className="space-y-3">
                {numbers.map((n) => {
                  const expired = isExpired(n);
                  const timeLeft = getGraceTimeLeft(n);
                  const active = selectedNumber?._id === n._id;

                  return (
                    <div
                      key={n._id}
                      onClick={() => setSelectedNumber(n)}
                      className={`flex justify-between items-center p-4 rounded-xl cursor-pointer transition ${
                        active ? "bg-purple-50 ring-2 ring-purple-500 dark:bg-purple-900" : "hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div>
                        <p className="font-medium">{n.number}</p>
                        <p className={`text-sm ${expired ? "text-red-500" : "text-green-600"}`}>
                          {expired ? "Expired" : "Active"}
                        </p>
                        {timeLeft && (
                          <p className="text-xs text-yellow-600 mt-1">
                            ⏳ Grace period: {timeLeft} left
                          </p>
                        )}
                      </div>
                      {!expired && (
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/dashboard/messages/${n._id}`);
                            }}
                            className="bg-purple-600 text-white px-4 py-1.5 rounded-xl hover:bg-purple-700 transition"
                          >
                            View Messages
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCancelModal(n);
                            }}
                            className="bg-red-500 text-white px-4 py-1.5 rounded-xl hover:bg-red-600 transition"
                          >
                            Cancel Number
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* AVAILABLE NUMBERS */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Available Numbers</h2>
              <button onClick={() => navigate("/dashboard/buy")} className="text-sm text-purple-600 hover:underline font-semibold">
                View all →
              </button>
            </div>
            {loading ? (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            ) : availableNumbers.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No numbers available right now</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableNumbers.slice(0, 6).map((num) => (
                  <div
                    key={num._id}
                    className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-5 shadow hover:shadow-2xl hover:-translate-y-1 transition"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <p className="font-bold text-lg text-gray-800 dark:text-gray-200">{num.number}</p>
                      <span className="text-sm bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full">
                        {num.countryFlag || ""} {num.country}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Prices vary by purpose</p>
                    <button
                      onClick={() => navigate("/dashboard/buy")}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition"
                    >
                      Buy Number
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* CANCEL MODAL */}
      {cancelModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-center shadow-2xl max-w-md w-full mx-4">
            <h2 className="text-3xl font-bold text-red-600 mb-4">Cancel Number?</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2 text-lg">Are you sure you want to cancel:</p>
            <p className="font-bold text-xl text-purple-600 mb-6">{cancelModal.number}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              ⚠️ All messages will be lost permanently.<br />
              The number will become available for others.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setCancelModal(null)}
                className="px-8 py-3 rounded-xl bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-400 dark:hover:bg-gray-600 transition"
              >
                No, Keep It
              </button>
              <button
                onClick={() => handleCancelNumber(cancelModal._id)}
                className="px-8 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              >
                Yes, Cancel It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* STAT CARD */
function Stat({ label, value, icon }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-xl hover:-translate-y-1 transition">
      <div className="flex justify-between items-center">
        <span className="text-gray-500 dark:text-gray-400">{label}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold mt-3 text-gray-800 dark:text-gray-200 flex items-center">{value}</div>
    </div>
  );
}
