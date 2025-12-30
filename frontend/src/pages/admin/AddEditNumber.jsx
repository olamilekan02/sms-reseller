import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { toast } from "react-toastify";

export default function AddEditNumber() {
  const [numbers, setNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNumber, setEditingNumber] = useState(null);

  const [formData, setFormData] = useState({
    number: "",
    country: "",
    provider: "",
    status: "available",
    purpose: [],
    prices: {},
  });

  useEffect(() => {
    fetchNumbers();
  }, []);

  const fetchNumbers = async () => {
    try {
      const res = await adminApi.get("/numbers");
      setNumbers(res.data);
    } catch (err) {
      toast.error("Failed to load numbers");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        prices: Object.fromEntries(
          Object.entries(formData.prices).filter(([_, v]) => v.buy > 0)
        ),
        purpose: formData.purpose.filter(p => p.trim() !== ""),
      };

      if (editingNumber) {
        await adminApi.patch(`/numbers/${editingNumber._id}`, payload);
        toast.success("Number updated successfully!");
      } else {
        await adminApi.post("/numbers", payload);
        toast.success("Number added successfully!");
      }

      setShowForm(false);
      setEditingNumber(null);
      setFormData({
        number: "",
        country: "",
        provider: "",
        status: "available",
        purpose: [],
        prices: {},
      });
      fetchNumbers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (num) => {
    setEditingNumber(num);
    setFormData({
      number: num.number,
      country: num.country,
      provider: num.provider,
      status: num.status,
      purpose: num.purpose || [],
      prices: num.prices || {},
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this number permanently?")) return;

    try {
      await adminApi.delete(`/numbers/${id}`);
      toast.success("Number deleted");
      fetchNumbers();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const addPurpose = () => {
    setFormData({ ...formData, purpose: [...formData.purpose, ""] });
  };

  const addPrice = () => {
    setFormData({ ...formData, prices: { ...formData.prices, "": { buy: 0 } } });
  };

  if (loading) return <p className="text-center text-2xl mt-20">Loading numbers...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">📱 Manage Numbers</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingNumber(null);
            setFormData({
              number: "",
              country: "",
              provider: "",
              status: "available",
              purpose: [],
              prices: {},
            });
          }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:opacity-90 transition shadow-lg"
        >
          + Add New Number
        </button>
      </div>

      {/* ADD/EDIT FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full m-4">
            <h2 className="text-3xl font-bold mb-6 text-center">
              {editingNumber ? "Edit Number" : "Add New Number"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="text"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-2">Provider</label>
                  <input
                    type="text"
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-600 focus:outline-none"
                  >
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                  </select>
                </div>
              </div>

              {/* PURPOSES */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block font-bold text-gray-700">Supported Services</label>
                  <button
                    type="button"
                    onClick={addPurpose}
                    className="text-purple-600 font-bold hover:text-purple-800"
                  >
                    + Add Service
                  </button>
                </div>
                {formData.purpose.map((p, i) => (
                  <input
                    key={i}
                    type="text"
                    value={p}
                    placeholder="e.g. whatsapp"
                    onChange={(e) => {
                      const newPurpose = [...formData.purpose];
                      newPurpose[i] = e.target.value;
                      setFormData({ ...formData, purpose: newPurpose });
                    }}
                    className="w-full mb-3 px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-600"
                  />
                ))}
              </div>

              {/* PRICES */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block font-bold text-gray-700">Prices (Buy)</label>
                  <button
                    type="button"
                    onClick={addPrice}
                    className="text-purple-600 font-bold hover:text-purple-800"
                  >
                    + Add Price
                  </button>
                </div>
                {Object.entries(formData.prices).map(([service, price]) => (
                  <div key={service} className="flex gap-4 mb-3">
                    <input
                      type="text"
                      value={service}
                      placeholder="Service"
                      onChange={(e) => {
                        const newPrices = { ...formData.prices };
                        delete newPrices[service];
                        newPrices[e.target.value] = price;
                        setFormData({ ...formData, prices: newPrices });
                      }}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-300"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={price.buy || ""}
                      placeholder="Price"
                      onChange={(e) => {
                        const newPrices = { ...formData.prices };
                        newPrices[service] = { buy: parseFloat(e.target.value) || 0 };
                        setFormData({ ...formData, prices: newPrices });
                      }}
                      className="w-32 px-4 py-3 rounded-xl border border-gray-300"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-6 justify-center pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingNumber(null);
                  }}
                  className="px-8 py-3 rounded-xl bg-gray-300 text-gray-800 font-bold hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:opacity-90 transition shadow-lg"
                >
                  {editingNumber ? "Update Number" : "Add Number"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NUMBERS TABLE */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mt-8">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-5">
          <h2 className="text-2xl font-bold">All Numbers ({numbers.length})</h2>
        </div>

        {numbers.length === 0 ? (
          <p className="text-center py-20 text-gray-500 text-xl">No numbers in inventory</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-5 text-left font-bold text-gray-700">Number</th>
                  <th className="px-8 py-5 text-left font-bold text-gray-700">Country</th>
                  <th className="px-8 py-5 text-left font-bold text-gray-700">Provider</th>
                  <th className="px-8 py-5 text-left font-bold text-gray-700">Status</th>
                  <th className="px-8 py-5 text-left font-bold text-gray-700">Services</th>
                  <th className="px-8 py-5 text-left font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {numbers.map((num) => (
                  <tr key={num._id} className="border-b hover:bg-purple-50 transition">
                    <td className="px-8 py-5 font-mono font-bold">{num.number}</td>
                    <td className="px-8 py-5">{num.country}</td>
                    <td className="px-8 py-5">{num.provider}</td>
                    <td className="px-8 py-5">
                      <span
                        className={`px-4 py-2 rounded-full font-bold text-sm ${
                          num.status === "available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {num.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      {num.purpose.length > 0 ? num.purpose.join(", ") : "None"}
                    </td>
                    <td className="px-8 py-5">
                      <button
                        onClick={() => handleEdit(num)}
                        className="mr-3 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(num._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
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