import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/user/signup", {
        fullName,
        username,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setMessage("✅ Registration successful! Redirecting...");

      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 font-sans">
      {/* ======= Top Header ======= */}
      <header className="w-full bg-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
          <div className="text-2xl font-bold text-white tracking-wide">
            <Link to="/">LARRYSMS</Link>
          </div>

          <nav className="flex gap-6 text-white text-lg font-medium">
            <Link to="/" className="hover:text-purple-200 transition">Home</Link>
            <Link to="/login" className="hover:text-purple-200 transition">Login</Link>
            <Link to="/signup" className="hover:text-purple-200 transition">Register</Link>
            <Link to="/forgot-password" className="hover:text-purple-200 transition">
                          Forgot Password
                        </Link>
          </nav>
        </div>
      </header>

      {/* ======= Page Content ======= */}
      <main className="flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          <div className="bg-white border border-purple-100 rounded-2xl shadow-xl p-6 mb-8 text-center">
            <h2 className="text-2xl font-semibold text-purple-700 mb-2">
              Join LARRYSMS 👋
            </h2>
            <p className="text-gray-600">
              Create your account to start receiving virtual SMS numbers instantly
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Create Your Account
            </h3>

            {message && (
              <div className="text-center text-sm text-purple-700 mb-4">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="john123"
                  className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password with Show/Hide */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition pr-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-purple-600"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Confirm Password with Show/Hide */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition pr-12"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-purple-600"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Signup Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-purple-600 text-white text-xl font-semibold rounded-xl shadow-lg hover:bg-purple-700 transition disabled:opacity-60"
              >
                {loading ? "Signing up..." : "Sign Up →"}
              </button>
            </form>

            <div className="flex items-center my-8">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-4 text-gray-400">or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <p className="text-center text-gray-600 text-lg">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-purple-600 font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
