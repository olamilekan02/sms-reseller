import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Currency from "../components/Currency";


export default function Transactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [purposeFilter, setPurposeFilter] = useState("all");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/transactions/me");
      const data = res.data.transactions || [];
      setTransactions(data);
      setFilteredTransactions(data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setTransactions([]);
      setFilteredTransactions([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    let filtered = transactions;

    if (typeFilter !== "all") {
      filtered = filtered.filter(t => t.type === typeFilter);
    }

    if (purposeFilter !== "all") {
      filtered = filtered.filter(t => t.meta?.purpose?.toLowerCase() === purposeFilter.toLowerCase());
    }

    setFilteredTransactions(filtered);
  }, [typeFilter, purposeFilter, transactions]);

  const availablePurposes = ["all", ...new Set(transactions.map(t => t.meta?.purpose).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-indigo-100 p-6">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">💳 Transaction History</h1>
          <p className="text-gray-600 text-lg">All your purchases and activities</p>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-8 py-4 rounded-2xl bg-white border-2 border-purple-300 text-purple-700 font-bold hover:bg-purple-50 transition shadow-lg"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* FILTERS */}
      <div className="max-w-6xl mx-auto mb-8 bg-white rounded-3xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Filter Transactions</h3>
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col min-w-48">
            <label className="font-semibold text-gray-700 mb-2">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 font-medium transition"
            >
              <option value="all">All Types</option>
              <option value="buy">Buy</option>
              <option value="rebuy">Rebuy</option>
              <option value="fund">Fund</option>
            </select>
          </div>

          <div className="flex flex-col min-w-48">
            <label className="font-semibold text-gray-700 mb-2">Service (Purpose)</label>
            <select
              value={purposeFilter}
              onChange={(e) => setPurposeFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 font-medium transition"
            >
              <option value="all">All Services</option>
              {availablePurposes.map((p) => (
                <option key={p} value={p}>
                  {p === "all" ? "All Services" : p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setTypeFilter("all");
                setPurposeFilter("all");
              }}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-10 py-6">
          <h2 className="text-2xl font-bold">
            Your Transactions ({filteredTransactions.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-20 text-center">
            <div className="text-6xl mb-6">⏳</div>
            <p className="text-xl text-gray-500">Loading your history...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-20 text-center">
            <div className="text-6xl mb-6">📭</div>
            <p className="text-2xl text-gray-500 font-semibold">
              {transactions.length === 0 ? "No transactions yet" : "No transactions match your filters"}
            </p>
            <p className="text-gray-400 mt-4">
              {transactions.length === 0 ? "Your purchase history will appear here" : "Try adjusting the filters"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-700">
                  <th className="px-8 py-5 font-bold">#</th>
                  <th className="px-8 py-5 font-bold">Type</th>
                  <th className="px-8 py-5 font-bold">Reference</th>
                  <th className="px-8 py-5 font-bold">Amount</th>
                  <th className="px-8 py-5 font-bold">Purpose</th>
                  <th className="px-8 py-5 font-bold">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((t, idx) => (
                  <tr
                    key={t._id}
                    className="border-b border-gray-100 hover:bg-purple-50 transition"
                  >
                    <td className="px-8 py-6 font-medium">{idx + 1}</td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-4 py-2 rounded-full font-bold text-sm ${
                          t.type === "fund"
                            ? "bg-green-100 text-green-800"
                            : t.type === "buy"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {t.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-8 py-6 font-mono text-sm">{t.reference}</td>
                    <td className="px-8 py-6 font-bold text-lg">
                      {t.type === "fund" ? (
                        <span className="text-green-600">+<Currency amount={t.amount} /></span>
                      ) : (
                        <span className="text-red-600">-<Currency amount={t.amount} /></span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium capitalize">
                        {t.meta?.purpose || "—"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-gray-600">
                      {new Date(t.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}