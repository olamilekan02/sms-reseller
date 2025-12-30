import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [requesting, setRequesting] = useState(false); // Prevent multiple clicks
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post("/user/login", { email, password });

    localStorage.setItem("token", res.data.token);
    if (res.data.user) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }

    // Add this line to show success toast after redirect
    localStorage.setItem("justLoggedIn", "true");

    navigate("/dashboard");
  } catch (err) {
    setMessage("Invalid email or password");
    toast.error("Login failed");
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
          {message && (
            <div className="bg-red-100 text-red-700 border border-red-200 rounded-xl p-4 mb-6 text-center">
              {message}
            </div>
          )}

          <div className="bg-white/90 backdrop-blur-lg border border-purple-100 rounded-3xl shadow-2xl p-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-purple-700 mb-2">
                Welcome Back 👋
              </h2>
              <p className="text-gray-600 text-lg">
                Login to your <span className="font-bold">LARRYSMS</span> account
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-purple-600 focus:outline-none transition text-lg"
                  required
                  disabled={requesting} // prevent typing while request ongoing
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-purple-600 focus:outline-none transition pr-14 text-lg"
                    required
                    disabled={requesting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-purple-600 font-medium"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-purple-600 hover:underline font-medium"
                >
                  Forgot your password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={requesting} // disable button during request
                className={`w-full py-5 text-xl font-bold rounded-2xl shadow-xl transition
                  ${requesting
                    ? "bg-purple-400 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90"}`}
              >
                Login →
              </button>
            </form>

            <div className="my-8 text-center text-gray-500">or</div>

            <p className="text-center text-gray-700 text-lg">
              New to LARRYSMS?{" "}
              <Link to="/signup" className="text-purple-600 font-bold hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
