// frontend/src/pages/admin/Rentals.jsx
import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";

export default function Rentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await adminApi.get("/rentals"); // <-- make sure backend route exists
        setRentals(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load rentals");
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading rentals...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Rental Records</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead>
            <tr className="bg-purple-600 text-white">
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Number</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Start Date</th>
              <th className="px-4 py-3 text-left">End Date</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map((rental, index) => (
              <tr key={rental._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{rental.userId.username}</td>
                <td className="px-4 py-3">{rental.numberId.number}</td>
                <td className="px-4 py-3 capitalize">{rental.status}</td>
                <td className="px-4 py-3">
                  {new Date(rental.startDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  {new Date(rental.endDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
