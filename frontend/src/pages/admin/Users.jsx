import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { toast } from "react-toastify";
import Currency from "../../components/Currency";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminApi.get("/users");
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (id, isBlocked) => {
    try {
      const endpoint = isBlocked ? "/unblock" : "/block";
      await adminApi.patch(`/users/${id}${endpoint}`);
      toast.success(`User ${isBlocked ? "unblocked" : "blocked"} successfully`);
      fetchUsers();
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user permanently? All data will be lost.")) return;

    try {
      await adminApi.delete(`/users/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  if (loading) {
    return <p className="text-center text-3xl mt-20 font-bold text-purple-600">Loading users...</p>;
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-8">👥 User Management</h1>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-5">
          <h2 className="text-xl font-bold">All Users ({users.length})</h2>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">No users registered yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-purple-50">
                    <td className="px-4 py-4">
                      <div className="max-w-32">
                        <p className="font-medium truncate">{user.username}</p>
                        <p className="text-sm text-gray-500 truncate">{user.fullName || "—"}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm max-w-40 truncate" title={user.email}>
                      {user.email}
                    </td>
                    <td className="px-4 py-4">
                      <Currency amount={user.wallet?.balance || 0} className="font-bold text-purple-700" />
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isBlocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                      }`}>
                        {user.isBlocked ? "BLOCKED" : "ACTIVE"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <button
                        onClick={() => handleBlock(user._id, user.isBlocked)}
                        className={`mr-2 px-3 py-1 rounded text-white text-xs font-medium ${
                          user.isBlocked ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        {user.isBlocked ? "Unblock" : "Block"}
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="px-3 py-1 bg-gray-800 text-white text-xs rounded hover:bg-gray-900"
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