import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import Currency from "../../components/Currency"; // ← Added

export default function Wallets() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const res = await adminApi.get("/wallets");
        setWallets(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, []);

  if (loading) return <p className="text-center text-2xl mt-20">Loading wallets...</p>;

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">💰 User Wallets</h1>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-5">
          <h2 className="text-2xl font-bold">Wallet Balances</h2>
        </div>

        {wallets.length === 0 ? (
          <p className="text-center py-20 text-gray-500 text-xl">No wallet data</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-5 text-left font-bold text-gray-700">Username</th>
                  <th className="px-8 py-5 text-left font-bold text-gray-700">Email</th>
                  <th className="px-8 py-5 text-left font-bold text-gray-700">Balance</th>
                  <th className="px-8 py-5 text-left font-bold text-gray-700">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {wallets.map((wallet) => (
                  <tr key={wallet._id} className="border-b hover:bg-purple-50 transition">
                    <td className="px-8 py-5 font-medium">{wallet.userId?.username || "—"}</td>
                    <td className="px-8 py-5">{wallet.userId?.email || "—"}</td>
                    <td className="px-8 py-5 font-bold text-2xl text-purple-700">
                      <Currency amount={wallet.balance} />
                    </td>
                    <td className="px-8 py-5 text-gray-600">
                      {new Date(wallet.updatedAt).toLocaleString()}
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