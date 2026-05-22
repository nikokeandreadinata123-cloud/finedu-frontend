import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { UserProvider } from "./context/UserContext";

import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import Dashboard from "./pages/Dashboard/DashboardDesktop.jsx";
import Profile from "./pages/Profile/ProfileDesktop.jsx";
import Calculator from "./pages/Calculator/CalculatorDesktop.jsx";
import Learning from "./pages/learning/Learning.jsx";

// ── NEW: Simulasi Kelola Keuangan ──
import SimulasiKelolaKeuangan from "./pages/Simulasi/SimulasiKelolaKeuangan.jsx";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/login"      element={<Login />} />
      <Route path="/register"   element={<Register />} />
      <Route path="/"           element={<Dashboard />} />
      <Route path="/dashboard"  element={<Dashboard />} />
      <Route path="/profile"    element={<Profile />} />
      <Route path="/learning"   element={<Learning />} />
      <Route path="/calculator" element={<Calculator />} />

      {/* ── NEW ROUTE ── */}
      <Route path="/simulasi"   element={<SimulasiKelolaKeuangan />} />
    </Routes>
  );
}

export default function App() {
  return (
    <UserProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </UserProvider>
  );
}
