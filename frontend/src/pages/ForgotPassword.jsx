import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    await api.post("/user/forgot-password", { email });
    setSent(true);
    toast.success("Reset link sent! Check your email.");
  } catch (err) {
    toast.error(err.response?.data?.message || "Email not found");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-purple-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-purple-700">Forgot Password?</h2>
            <p className="text-gray-600 mt-4">Enter your email to reset your password</p>
          </div>

          {sent ? (
            <div className="text-center py-10">
              <div className="text-6xl mb-6">📧</div>
              <p className="text-xl font-semibold text-green-600">Check your email!</p>
              <p className="text-gray-600 mt-4">We sent a password reset link to {email}</p>
              <Link to="/login" className="mt-8 inline-block text-purple-600 font-bold hover:underline">
                ← Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-purple-600 outline-none transition text-lg"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xl font-bold rounded-2xl shadow-xl hover:opacity-90 transition disabled:opacity-70"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}

          <div className="text-center mt-8">
            <Link to="/login" className="text-purple-600 font-medium hover:underline">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}