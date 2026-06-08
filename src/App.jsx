import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext";

import Login      from "./pages/Auth/Login.jsx";
import Register   from "./pages/Auth/Register.jsx";
import Dashboard  from "./pages/Dashboard/DashboardDesktop.jsx";
import Profile    from "./pages/Profile/ProfileDesktop.jsx";
import Calculator from "./pages/Calculator/CalculatorDesktop.jsx";
import Learning   from "./pages/learning/Learning.jsx";
import SimulasiKelolaKeuangan from "./pages/Simulasi/SimulasiKelolaKeuangan.jsx";

// ── Komponen: Popup Sign Up setelah 30 menit tidak login ──
function SignUpReminder() {
  const { user } = useUser();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [show, setShow] = useState(false);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isLoggedIn = !!user?.id;

  useEffect(() => {
    // Hanya tampilkan reminder jika belum login dan bukan di halaman auth
    if (isLoggedIn || isAuthPage) return;

    const THIRTY_MINUTES = 30 * 60 * 1000;
    const timer = setTimeout(() => {
      setShow(true);
    }, THIRTY_MINUTES);

    return () => clearTimeout(timer);
  }, [isLoggedIn, isAuthPage]);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '20px',
    }}>
      <div style={{
        background: '#fff', borderRadius: '20px', padding: '36px 32px',
        maxWidth: '400px', width: '100%', textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎯</div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
          Yuk, Mulai Belajar!
        </h2>
        <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
          Buat akun gratis dan mulai perjalanan literasi keuangan kamu bersama ribuan pengguna FinEdu.
        </p>
        <button
          onClick={() => { setShow(false); navigate('/register'); }}
          style={{
            width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
            background: 'linear-gradient(135deg, #34D399, #059669)',
            color: '#fff', fontWeight: 700, fontSize: '15px', cursor: 'pointer',
            marginBottom: '10px',
          }}
        >
          Daftar Sekarang →
        </button>
        <button
          onClick={() => { setShow(false); navigate('/login'); }}
          style={{
            width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
            background: 'transparent', color: '#475569', fontWeight: 600,
            fontSize: '14px', cursor: 'pointer', marginBottom: '10px',
          }}
        >
          Sudah punya akun? Sign In
        </button>
        <button
          onClick={() => setShow(false)}
          style={{
            background: 'none', border: 'none', color: '#94a3b8',
            fontSize: '13px', cursor: 'pointer',
          }}
        >
          Nanti saja
        </button>
      </div>
    </div>
  );
}

// ── Komponen: Protected Route (hanya bisa diakses jika sudah login) ──
function ProtectedRoute({ children }) {
  const { user } = useUser();
  if (!user?.id) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <>
      <SignUpReminder />
      <Routes location={location} key={location.pathname}>
        {/* ✅ Halaman awal redirect ke /login */}
        <Route path="/"           element={<Navigate to="/login" replace />} />

        {/* Halaman publik */}
        <Route path="/login"      element={<Login />} />
        <Route path="/register"   element={<Register />} />

        {/* Halaman yang butuh login */}
        <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile"    element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/learning"   element={<ProtectedRoute><Learning /></ProtectedRoute>} />
        <Route path="/calculator" element={<ProtectedRoute><Calculator /></ProtectedRoute>} />
        <Route path="/simulasi"   element={<ProtectedRoute><SimulasiKelolaKeuangan /></ProtectedRoute>} />
      </Routes>
    </>
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
