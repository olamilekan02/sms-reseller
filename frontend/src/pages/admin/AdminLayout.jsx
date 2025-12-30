import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const navItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/admin/users", label: "Users", icon: "👥" },
    { to: "/admin/numbers", label: "Numbers", icon: "📱" },
    { to: "/admin/wallets", label: "Wallets", icon: "💰" },
    { to: "/admin/transactions", label: "Transactions", icon: "💳" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-2xl flex flex-col border-r border-gray-200">
        {/* Header */}
        <div className="p-8 border-b border-gray-200">
          <h1 className="text-3xl font-extrabold text-purple-700">LARRYSMS</h1>
          <p className="text-sm text-gray-600 mt-1">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 py-8">
          <ul className="space-y-3">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-6 py-4 rounded-2xl font-medium text-lg transition-all duration-300 ${
                      isActive
                        ? "bg-purple-600 text-white shadow-lg"
                        : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                    }`
                  }
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-2xl font-semibold hover:opacity-90 transition shadow-lg"
          >
            <span className="text-xl">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}