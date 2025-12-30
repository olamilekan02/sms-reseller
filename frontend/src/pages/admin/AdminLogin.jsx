import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", { email, password });

      localStorage.setItem("adminToken", res.data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 flex items-center justify-center relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-12 w-full max-w-lg border border-white/20">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            LARRYSMS ADMIN
          </h1>
          <p className="text-gray-600 text-lg">Welcome back. Access your control panel.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div>
            <label className="block text-gray-700 font-semibold mb-3 text-lg">Email Address</label>
            <input
              type="email"
              placeholder="admin@larrrysms.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-300 focus:border-purple-600 focus:outline-none transition text-lg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-3 text-lg">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-300 focus:border-purple-600 focus:outline-none transition text-lg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xl hover:from-purple-700 hover:to-indigo-700 transition shadow-xl disabled:opacity-70"
          >
            {loading ? "Authenticating..." : "Login to Admin Panel"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-10 text-sm">
          Secured access • Only for authorized administrators
        </p>
      </div>
    </div>
  );
}