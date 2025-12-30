import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { toast } from "react-toastify";

export default function Numbers() {
  const [numbers, setNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNumber, setEditingNumber] = useState(null);

  const [formData, setFormData] = useState({
    number: "",
    country: "",
    provider: "",
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

  const openModal = (num = null) => {
    if (num) {
      setEditingNumber(num);
      setFormData({
        number: num.number,
        country: num.country,
        provider: num.provider,
        purpose: num.purpose || [],
        prices: num.prices || {},
      });
    } else {
      setEditingNumber(null);
      setFormData({
        number: "",
        country: "",
        provider: "",
        purpose: [],
        prices: {},
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        purpose: formData.purpose.filter(p => p.trim() !== ""),
        prices: Object.fromEntries(
          Object.entries(formData.prices).filter(([_, v]) => v.buy > 0)
        ),
      };

      if (editingNumber) {
        await adminApi.patch(`/numbers/${editingNumber._id}`, payload);
        toast.success("Number updated!");
      } else {
        await adminApi.post("/numbers", payload);
        toast.success("Number added!");
      }

      setShowModal(false);
      fetchNumbers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
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

  const addField = (type) => {
    if (type === "purpose") {
      setFormData({ ...formData, purpose: [...formData.purpose, ""] });
    } else if (type === "price") {
      setFormData({ ...formData, prices: { ...formData.prices, "": { buy: 0 } } });
    }
  };

  if (loading) {
    return <p className="text-center text-3xl mt-20 font-bold text-purple-600">Loading numbers...</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800">📱 Manage Numbers</h1>
        <button
          onClick={() => openModal()}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:opacity-90 transition shadow-lg"
        >
          + Add New Number
        </button>
      </div>

      {/* NUMBERS TABLE */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-6">
          <h2 className="text-2xl font-bold">All Numbers ({numbers.length})</h2>
        </div>

        {numbers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">No numbers yet</p>
            <p className="text-gray-400 mt-4">Click "Add New Number" to get started</p>
          </div>
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
                    <td className="px-8 py-5 font-mono font-bold text-lg">{num.number}</td>
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
                      {num.purpose?.length > 0 ? num.purpose.join(", ") : "None"}
                    </td>
                    <td className="px-8 py-5">
                      <button
                        onClick={() => openModal(num)}
                        className="mr-4 px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(num._id)}
                        className="px-5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium"
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

      {/* ADD/EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl w-full mx-4 my-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-purple-800">
              {editingNumber ? "Edit Number" : "Add New Number"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block font-bold text-gray-700 mb-2">Number</label>
                  <input
                    type="text"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-600"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-600"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-2">Provider</label>
                  <input
                    type="text"
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-600"
                    required
                  />
                </div>
              </div>

              {/* SERVICES */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block font-bold text-gray-700">Supported Services</label>
                  <button
                    type="button"
                    onClick={() => addField("purpose")}
                    className="text-purple-600 font-bold hover:text-purple-800"
                  >
                    + Add Service
                  </button>
                </div>
                {formData.purpose.map((service, i) => (
                  <input
                    key={i}
                    type="text"
                    value={service}
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
                <div className="flex justify-between items-center mb-4">
                  <label className="block font-bold text-gray-700">Prices</label>
                  <button
                    type="button"
                    onClick={() => addField("price")}
                    className="text-purple-600 font-bold hover:text-purple-800"
                  >
                    + Add Price
                  </button>
                </div>
                {Object.entries(formData.prices).map(([service, price]) => (
                  <div key={service} className="flex gap-4 mb-4 items-center">
                    <input
                      type="text"
                      value={service}
                      placeholder="Service name"
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
                      className="w-40 px-4 py-3 rounded-xl border border-gray-300"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-6 pt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-10 py-4 rounded-xl bg-gray-300 text-gray-800 font-bold hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-10 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:opacity-90 transition shadow-lg"
                >
                  {editingNumber ? "Update Number" : "Add Number"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}