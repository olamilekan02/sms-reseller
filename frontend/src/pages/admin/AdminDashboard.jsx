import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Currency from "../../components/Currency";

export default function AdminDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalNumbers: 0,
    activeRentals: 0,
    totalUsersBalance: 0,
    revenueToday: 0,
    revenueWeek: 0,
    revenueMonth: 0,
    totalRevenue: 0,
  });
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const [dashboardRes, walletsRes] = await Promise.all([
        adminApi.get("/dashboard"),
        adminApi.get("/wallets"),
      ]);

      const dashboardData = dashboardRes.data;
      const wallets = walletsRes.data;

      const totalUsersBalance = wallets.reduce((sum, w) => sum + (w.balance || 0), 0);

      setStats({
        ...dashboardData,
        totalUsersBalance,
      });

      setRevenueData(dashboardData.revenueChart || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const kpiCards = [
    { label: "Total Users", value: stats.totalUsers.toLocaleString(), icon: "👥", color: "from-blue-500 to-cyan-500" },
    { label: "Total Numbers", value: stats.totalNumbers.toLocaleString(), icon: "📱", color: "from-purple-500 to-pink-500" },
    { label: "Active Rentals", value: stats.activeRentals.toLocaleString(), icon: "🔄", color: "from-green-500 to-teal-500" },
    { label: "Users Total Balance", value: <Currency amount={stats.totalUsersBalance} className="text-2xl" />, icon: "👛", color: "from-yellow-500 to-orange-500" },
    { label: "Revenue Today", value: <Currency amount={stats.revenueToday} className="text-2xl" />, icon: "📅", color: "from-red-500 to-rose-500" },
    { label: "Revenue This Week", value: <Currency amount={stats.revenueWeek} className="text-2xl" />, icon: "🗓️", color: "from-indigo-500 to-blue-500" },
    { label: "Revenue This Month", value: <Currency amount={stats.revenueMonth} className="text-2xl" />, icon: "📆", color: "from-violet-500 to-purple-500" },
    { label: "Total Revenue", value: <Currency amount={stats.totalRevenue} className="text-3xl font-bold" />, icon: "💰", color: "from-amber-500 to-yellow-500" },
  ];

  if (loading && stats.totalUsers === 0) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-40 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* HEADER */}
      <div className="border-b border-gray-200 dark:border-gray-800 px-8 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">LARRYSMS Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Real-time analytics • Updates every 5 seconds</p>
        </div>
        <button
          onClick={toggleDarkMode}
          className="px-5 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {kpiCards.map((card, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-2xl shadow-lg p-6 bg-gradient-to-br ${card.color} text-white hover:shadow-2xl transition`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{card.icon}</span>
                <span className="text-sm opacity-90">{card.label}</span>
              </div>
              <div className="text-3xl font-bold">{card.value}</div>
            </div>
          ))}
        </div>

        {/* REVENUE CHART */}
        <div className={`rounded-2xl shadow-2xl p-8 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-2xl font-bold mb-6">Revenue Trend (Last 30 Days)</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                <XAxis dataKey="date" stroke={darkMode ? "#9ca3af" : "#6b7280"} />
                <YAxis stroke={darkMode ? "#9ca3af" : "#6b7280"} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value) => <Currency amount={value} />}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  strokeWidth={4}
                  dot={{ fill: "#8b5cf6", r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}