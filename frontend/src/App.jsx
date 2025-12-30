// App.jsx
import { Routes, Route } from "react-router-dom";

/* ===== USER PAGES ===== */
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import BuyNumber from "./pages/BuyNumber";
import Messages from "./pages/Messages";
import Transactions from "./pages/Transactions"; // ← User transactions
import FundWallet from "./pages/FundWallet";
import ForgotPassword from "./pages/ForgotPassword";

/* ===== ADMIN PAGES ===== */
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import Numbers from "./pages/admin/Numbers";
import Rentals from "./pages/admin/Rentals";
import Wallets from "./pages/admin/Wallets";
import AdminTransactions from "./pages/admin/Transactions"; // ← Admin transactions (separate file)

/* ===== ADMIN PROTECTED ROUTE ===== */
import AdminRoute from "./pages/admin/AdminRoute";

function App() {
  return (
    <Routes>
      {/* ================= USER ROUTES ================= */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/buy" element={<BuyNumber />} />
      <Route path="/dashboard/messages/:numberId" element={<Messages />} />
      <Route path="/dashboard/transactions" element={<Transactions />} /> {/* User transactions */}
      <Route path="/dashboard/fund-wallet" element={<FundWallet />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ================= ADMIN ROUTES ================= */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Routes with Layout */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/numbers" element={<Numbers />} />
          <Route path="/admin/rentals" element={<Rentals />} />
          <Route path="/admin/wallets" element={<Wallets />} />
          <Route path="/admin/transactions" element={<AdminTransactions />} /> {/* Admin all transactions */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;