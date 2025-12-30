import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";
import Currency from "../components/Currency";

export default function BuyNumber() {
  const navigate = useNavigate();

  const [numbers, setNumbers] = useState([]);
  const [filteredNumbers, setFilteredNumbers] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  const [confirmModal, setConfirmModal] = useState(null);
  const [successModal, setSuccessModal] = useState(false);

  const [country, setCountry] = useState("");
  const [provider, setProvider] = useState("");
  const [purpose, setPurpose] = useState("");

  // Fetch available numbers
  const fetchNumbers = async () => {
    try {
      const res = await api.get("/user/numbers/available");
      const newNumbers = res.data || [];
      setNumbers(newNumbers);
    } catch (err) {
      console.error("Failed to load numbers:", err);
      if (loading) toast.error("Failed to load numbers");
    } finally {
      if (loading) setLoading(false);
    }
  };

  // Fetch wallet balance
  const fetchWallet = async () => {
    try {
      const res = await api.get("/user/wallet");
      setWalletBalance(res.data?.balance || 0);
    } catch (err) {
      console.error("Wallet fetch error:", err);
      setWalletBalance(0);
    }
  };

  // Initial load
  useEffect(() => {
    fetchNumbers();
    fetchWallet();
  }, []);

  // Real-time polling: refresh numbers every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNumbers();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Re-apply filters whenever numbers or filters change
  useEffect(() => {
    let data = [...numbers];

    if (country) {
      data = data.filter((n) => n.country?.toLowerCase() === country.toLowerCase());
    }
    if (provider) {
      data = data.filter((n) => n.provider?.toLowerCase() === provider.toLowerCase());
    }
    if (purpose) {
      const p = purpose.toLowerCase();
      data = data.filter((n) =>
        Object.keys(n.prices || {}).some((k) => k.toLowerCase() === p)
      );
    }

    setFilteredNumbers(data);
  }, [country, provider, purpose, numbers]);

  // Filter options
  const availableCountries = [
    ...new Set(numbers.map((n) => n.country).filter(Boolean)),
  ].sort();

  const availableProviders = [
    ...new Set(
      numbers
        .filter((n) => !country || n.country?.toLowerCase() === country.toLowerCase())
        .map((n) => n.provider)
        .filter(Boolean)
    ),
  ].sort();

  const availablePurposes = [
    ...new Set(
      numbers
        .filter(
          (n) =>
            (!country || n.country?.toLowerCase() === country.toLowerCase()) &&
            (!provider || n.provider?.toLowerCase() === provider.toLowerCase())
        )
        .flatMap((n) => Object.keys(n.prices || {}))
    ),
  ].sort();

  const confirmBuy = (num) => {
    if (!purpose) return toast.error("Select a service");

    const priceObj = Object.entries(num.prices || {}).find(
      ([k]) => k.toLowerCase() === purpose.toLowerCase()
    )?.[1];

    if (!priceObj?.buy) return toast.error("Service not supported");

    if (walletBalance < priceObj.buy)
      return toast.error("Insufficient wallet balance");

    setConfirmModal({ num, price: priceObj.buy });
  };

  const handleBuy = async () => {
    if (!confirmModal) return;

    setBuying(true);
    try {
      const res = await api.post("/user/numbers/buy", {
        numberId: confirmModal.num._id,
        purpose: purpose.toLowerCase(),
      });

      // Update wallet
      setWalletBalance(res.data.wallet.balance);

      // Optimistically remove bought number
      setNumbers((prev) => prev.filter((n) => n._id !== confirmModal.num._id));

      toast.success("Number purchased successfully!");
      setSuccessModal(true);
    } catch (err) {
      const msg = err.response?.data?.message || "Number no longer available";
      toast.error(msg);
      // Sync with server on error
      fetchNumbers();
    } finally {
      setBuying(false);
      setConfirmModal(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading numbers…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-indigo-50/20 to-gray-50/40">
      {/* ================= HEADER ================= */}
      <header className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,white,transparent_70%)]" />
        <div className="relative max-w-7xl mx-auto px-6 py-10">
          <div className="flex justify-between items-center mb-6">
            <Link to="/dashboard" className="text-white text-2xl font-extrabold">
              LARRYSMS
            </Link>

            <div className="flex items-center gap-6">
              <div className="text-right text-white">
                <p className="text-xs opacity-80">Wallet Balance</p>
                <p className="text-2xl font-bold">
                  <Currency amount={walletBalance} />
                </p>
              </div>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-2.5 bg-white/90 hover:bg-white text-purple-700 rounded-xl font-semibold shadow"
              >
                Dashboard
              </button>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white">
            Buy Virtual Numbers
          </h1>
          <p className="text-white/90 mt-2 max-w-xl">
            Secure, one-time-use numbers for fast and reliable OTP verification.
          </p>
        </div>
      </header>

      {/* ================= HOW IT WORKS ================= */}
      <section className="max-w-7xl mx-auto px-6 mt-16">
        <div className="bg-white rounded-[2rem] border border-gray-200 shadow-xl p-12">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-12">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              ["Choose Service", "Select country, provider and service"],
              ["Buy Securely", "Instant purchase using wallet balance"],
              ["Receive OTP", "Copy your code before expiration"],
            ].map(([title, desc], i) => (
              <div
                key={i}
                className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-lg">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-lg text-gray-800 mt-6 mb-2">
                  {title}
                </h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FILTER ================= */}
      <section className="max-w-7xl mx-auto px-6 mt-16">
        <div className="bg-white rounded-[2rem] border border-gray-200 shadow-lg p-10 grid md:grid-cols-3 gap-6">
          <select
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setProvider("");
              setPurpose("");
            }}
            className="rounded-xl border-gray-300 focus:ring-purple-500 focus:border-purple-500 px-4 py-3"
          >
            <option value="">All Countries</option>
            {availableCountries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={provider}
            onChange={(e) => {
              setProvider(e.target.value);
              setPurpose("");
            }}
            disabled={!country}
            className="rounded-xl border-gray-300 focus:ring-purple-500 focus:border-purple-500 px-4 py-3 disabled:opacity-50"
          >
            <option value="">All Providers</option>
            {availableProviders.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            disabled={!provider}
            className="rounded-xl border-gray-300 focus:ring-purple-500 focus:border-purple-500 px-4 py-3 disabled:opacity-50"
          >
            <option value="">Select Service</option>
            {availablePurposes.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* ================= NUMBERS ================= */}
      <section className="max-w-7xl mx-auto px-6 mt-16 pb-28">
        {filteredNumbers.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-20 text-center text-gray-500">
            No numbers available for the selected filters.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-10">
            {filteredNumbers.map((num) => {
              const price = Object.entries(num.prices || {}).find(
                ([k]) => k.toLowerCase() === purpose.toLowerCase()
              )?.[1]?.buy;

              return (
                <div
                  key={num._id}
                  className="relative bg-white rounded-3xl border border-gray-200 p-10 shadow-md hover:shadow-2xl transition"
                >
                  <div className="flex justify-between mb-6">
                    <p className="font-semibold text-gray-800">{num.number}</p>
                    <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                      {num.country}
                    </span>
                  </div>

                  {price ? (
                    <p className="text-4xl font-extrabold text-purple-600 mb-6">
                      <Currency amount={price} />
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 mb-6">
                      Select service to see price
                    </p>
                  )}

                  <button
                    disabled={!price || buying}
                    onClick={() => confirmBuy(num)}
                    className={`w-full py-3 rounded-xl font-semibold transition ${
                      price
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {buying ? "Buying..." : "Buy Number"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ================= CONFIRM MODAL ================= */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Confirm Purchase</h3>
            <p className="mb-8 text-gray-600">
              Buy <strong>{confirmModal.num.number}</strong> for{" "}
              <strong>
                <Currency amount={confirmModal.price} />
              </strong>
              ?
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-6 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleBuy}
                disabled={buying}
                className="px-6 py-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-70"
              >
                {buying ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUCCESS MODAL ================= */}
      {successModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-12 text-center max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 text-purple-600">
              Purchase Successful 🎉
            </h3>
            <p className="mb-8 text-gray-600">
              Your number is now active and ready to receive OTP.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}