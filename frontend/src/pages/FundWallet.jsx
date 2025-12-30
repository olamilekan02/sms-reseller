import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";

export default function FundWallet() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const presetAmounts = [1000, 5000, 10000, 20000, 50000];

  const handleFakeFund = async () => {
    if (!amount || amount < 100) {
      toast.error("Minimum amount is ₦100");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/wallet/funding/fake", { amount: Number(amount) });
      toast.success(res.data.message || `₦${amount} added successfully!`);
      setAmount("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Funding failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium mb-8 transition"
        >
          ← Back
        </button>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-10 py-12 text-white">
            <h1 className="text-4xl font-extrabold text-center">Fund Your Wallet</h1>
            <p className="text-center mt-4 text-purple-100 text-lg">
              Add funds instantly to start buying virtual numbers
            </p>
          </div>

          {/* Body */}
          <div className="p-10">
            {/* Test Mode Notice */}
            <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-10">
              <p className="text-amber-800 dark:text-amber-200 font-medium text-center">
                🔧 Test Mode Active — Funds are fake for testing purposes
              </p>
            </div>

            {/* Amount Input */}
            <div className="max-w-md mx-auto mb-10">
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-3 text-lg">
                Enter Amount (NGN)
              </label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-purple-600">₦</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="5000"
                  className="w-full pl-16 pr-6 py-5 text-2xl font-medium border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:border-purple-500 outline-none transition"
                />
              </div>
            </div>

            {/* Preset Amounts */}
            <div className="max-w-2xl mx-auto mb-12">
              <p className="text-center text-gray-600 dark:text-gray-400 mb-6 font-medium">Quick Select</p>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {presetAmounts.map((val) => (
                  <button
                    key={val}
                    onClick={() => setAmount(val.toString())}
                    className="py-4 px-6 bg-gray-100 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-2xl font-semibold text-lg transition border-2 border-transparent hover:border-purple-400"
                  >
                    ₦{val.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                onClick={handleFakeFund}
                disabled={loading || !amount}
                className="px-12 py-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xl font-bold rounded-2xl hover:from-purple-700 hover:to-indigo-700 transition shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Add Funds to Wallet"}
              </button>
            </div>

            {/* Coming Soon Methods */}
            <div className="mt-16 grid md:grid-cols-2 gap-10 opacity-70">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
                <div className="text-5xl mb-4">🏦</div>
                <h3 className="text-xl font-bold mb-3">Bank Transfer</h3>
                <p className="text-gray-600 dark:text-gray-400">Dedicated virtual account • Instant credit</p>
                <span className="inline-block mt-6 px-6 py-3 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded-full font-semibold">
                  Coming Soon
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
                <div className="text-5xl mb-4">₿</div>
                <h3 className="text-xl font-bold mb-3">Cryptocurrency</h3>
                <p className="text-gray-600 dark:text-gray-400">USDT, BTC, ETH • Low fees</p>
                <span className="inline-block mt-6 px-6 py-3 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded-full font-semibold">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}