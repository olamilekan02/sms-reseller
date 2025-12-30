import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import Currency from "../../components/Currency";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "all",
    purpose: "",
    search: "",
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await adminApi.get("/transactions/all");
      const data = Array.isArray(res.data) ? res.data : res.data.transactions || [];
      setTransactions(data);
      setFiltered(data);
    } catch (err) {
      console.error("Error:", err);
      setTransactions([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let data = [...transactions];

    if (filters.type !== "all") {
      data = data.filter((t) => t.type === filters.type);
    }

    if (filters.purpose) {
      data = data.filter((t) =>
        t.meta?.purpose?.toLowerCase().includes(filters.purpose.toLowerCase())
      );
    }

    if (filters.search) {
      data = data.filter((t) =>
        (t.userId?.username || "").toLowerCase().includes(filters.search.toLowerCase()) ||
        (t.reference || "").includes(filters.search) ||
        (t.meta?.number || "").includes(filters.search)
      );
    }

    setFiltered(data);
  }, [filters, transactions]);

  const getTypeColor = (type) => {
    switch (type) {
      case "buy": return "bg-red-100 text-red-800";
      case "rebuy": return "bg-blue-100 text-blue-800";
      case "fund": case "topup": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <p className="text-center text-3xl mt-20 font-bold text-purple-600">Loading transactions...</p>;
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-8">💳 All Transactions ({filtered.length})</h1>

      {/* FILTERS */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block font-bold text-gray-700 mb-2">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border focus:border-purple-600 outline-none"
            >
              <option value="all">All Types</option>
              <option value="buy">Buy</option>
              <option value="rebuy">Rebuy</option>
              <option value="fund">Fund Wallet</option>
            </select>
          </div>
          <div>
            <label className="block font-bold text-gray-700 mb-2">Service</label>
            <input
              type="text"
              placeholder="e.g. whatsapp"
              value={filters.purpose}
              onChange={(e) => setFilters({ ...filters, purpose: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border focus:border-purple-600 outline-none"
            />
          </div>
          <div>
            <label className="block font-bold text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Username, ref, number..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border focus:border-purple-600 outline-none"
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Number</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ref</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t._id} className="hover:bg-purple-50">
                    <td className="px-4 py-4">
                      <div className="max-w-32 truncate">
                        <p className="font-medium">{t.userId?.username || "Unknown"}</p>
                        <p className="text-xs text-gray-500 truncate">{t.userId?.email || "—"}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(t.type)}`}>
                        {t.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono text-sm max-w-28 truncate">{t.meta?.number || "—"}</td>
                    <td className="px-4 py-4 text-sm capitalize max-w-24 truncate">{t.meta?.purpose || "—"}</td>
                    <td className="px-4 py-4">
                      {t.type === "fund" || t.type === "topup" ? (
                        <span className="text-green-600 font-bold">+<Currency amount={t.amount} /></span>
                      ) : (
                        <span className="text-red-600 font-bold">-<Currency amount={t.amount} /></span>
                      )}
                    </td>
                    <td className="px-4 py-4 font-mono text-xs max-w-32 truncate" title={t.reference}>
                      {t.reference}
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-600">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}