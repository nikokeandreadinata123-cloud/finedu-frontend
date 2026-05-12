import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { API_BASE_URL } from "../../api";

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const features = [
  {
    emoji: "🏅",
    title: "Progres Tersimpan",
    desc: "Lanjutkan dari terakhir kali Anda belajar",
  },
  {
    emoji: "📈",
    title: "Analisis Personal",
    desc: "Lihat statistik pembelajaran Anda",
  },
  {
    emoji: "🎓",
    title: "Sertifikat Digital",
    desc: "Raih sertifikat untuk setiap pencapaian",
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useUser();

  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]     = useState(false);
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Email dan password harus diisi!");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Format email tidak valid!");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.status === "success") {
        const userId = data.user?.id ?? data.user?.user_id ?? data.id ?? null;
        if (!userId) {
          setError("User ID tidak ditemukan.");
          setLoading(false);
          return;
        }
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("user_id", userId);
        login(data.user.email, data.user.name, data.user);
        navigate('/dashboard');
      } else {
        setError(data.message || "Login gagal.");
      }
    } catch (err) {
      setError("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSignIn();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* ===== KIRI ===== */}
      <div style={{
        flex: 1,
        backgroundColor: '#34D399',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '40px',
      }}>

        {/* Logo kiri atas */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src="/logo-finedu.jpeg"
            style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }}
            alt="Logo"
          />
          <span style={{ fontSize: '26px', fontWeight: 'bold' }}>
            <span style={{ color: '#384DB8' }}>Fin</span>
            <span style={{ color: '#FFC107' }}>Edu</span>
          </span>
        </div>

        {/* Teks & fitur tengah */}
        <div>
          <h2 style={{
            color: '#fff', fontSize: '36px', fontWeight: 'bold',
            marginBottom: '12px', lineHeight: 1.2,
          }}>
            Selamat Datang<br />Kembali!
          </h2>
          <p style={{
            color: '#fff', fontSize: '15px', fontStyle: 'italic',
            opacity: 0.9, marginBottom: '36px', lineHeight: 1.7,
          }}>
            Lanjutkan perjalanan literasi<br />
            keuangan digital anda<br />
            bersama FinEdu
          </p>

          {/* Fitur */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {features.map(({ emoji, title, desc }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {/* Lingkaran putih dengan emoji */}
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  backgroundColor: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, fontSize: '20px',
                }}>
                  {emoji}
                </div>
                <div>
                  <p style={{
                    color: '#fff', fontWeight: 'bold', fontSize: '14px',
                    fontStyle: 'italic', margin: 0,
                  }}>
                    {title}
                  </p>
                  <p style={{
                    color: '#fff', fontSize: '12px', fontStyle: 'italic',
                    opacity: 0.85, margin: 0,
                  }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div />
      </div>

      {/* ===== KANAN ===== */}
      <div style={{
        width: '480px',
        minWidth: '400px',
        backgroundColor: '#F3F4F6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
      }}>
        {/* Card putih */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '20px',
          padding: '36px 32px',
          width: '100%',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        }}>

          {/* Logo kanan */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <img
              src="/logo-finedu.jpeg"
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
              alt="Logo"
            />
            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
              <span style={{ color: '#384DB8' }}>Fin</span>
              <span style={{ color: '#FFC107' }}>Edu</span>
            </span>
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#000', marginBottom: '4px' }}>
            Sign In
          </h1>
          <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '20px' }}>
            Masuk ke akun anda untuk melanjutkan
          </p>

          {/* Error */}
          {error && (
            <div style={{
              marginBottom: '14px', padding: '10px 14px', borderRadius: '10px',
              fontSize: '13px', color: '#DC2626',
              backgroundColor: '#FEF2F2', border: '1px solid #FECACA',
            }}>
              {error}
            </div>
          )}

          {/* Email */}
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#000', display: 'block', marginBottom: '6px' }}>
            Email Address
          </label>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            border: '1px solid #E0E0E0', borderRadius: '10px',
            padding: '10px 12px', marginBottom: '14px',
            backgroundColor: '#F9F9F9',
          }}>
            <span style={{ fontSize: '16px' }}>✉️</span>
            <input
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1, border: 'none', outline: 'none',
                fontSize: '13px', background: 'transparent', color: '#000',
              }}
            />
          </div>

          {/* Password */}
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#000', display: 'block', marginBottom: '6px' }}>
            Password
          </label>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            border: '1px solid #E0E0E0', borderRadius: '10px',
            padding: '10px 12px', marginBottom: '10px',
            backgroundColor: '#F9F9F9',
          }}>
            <span style={{ fontSize: '16px' }}>🔒</span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Masukan password Anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1, border: 'none', outline: 'none',
                fontSize: '13px', background: 'transparent', color: '#000',
              }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </span>
          </div>

          {/* Remember Me & Lupa Password */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: '20px',
          }}>
            <label style={{
              display: 'flex', alignItems: 'center',
              gap: '6px', cursor: 'pointer', fontSize: '13px',
            }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: '14px', height: '14px' }}
              />
              Ingat saya
            </label>
            <span style={{ color: '#448AFF', fontSize: '13px', cursor: 'pointer' }}>
              Lupa Password?
            </span>
          </div>

          {/* Tombol Sign In */}
          <button
            onClick={handleSignIn}
            disabled={loading}
            style={{
              width: '100%', padding: '12px', borderRadius: '10px',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              backgroundColor: loading ? '#6EE7B7' : '#34D399',
              color: '#fff', fontSize: '14px', fontWeight: 'bold',
              marginBottom: '14px', transition: 'opacity 0.2s',
            }}>
            {loading ? "Sedang masuk..." : "Sign In"}
          </button>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#000', marginBottom: '18px' }}>
            Belum punya akun?{' '}
            <span
              onClick={() => navigate('/register')}
              style={{ color: '#34D399', fontWeight: 'bold', cursor: 'pointer' }}>
              Daftar sekarang
            </span>
          </p>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E0E0E0' }} />
            <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Atau masuk dengan</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E0E0E0' }} />
          </div>

          {/* Google */}
          <button style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '10px', padding: '11px', borderRadius: '10px',
            border: '1px solid #E0E0E0', backgroundColor: '#fff',
            cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#000',
          }}>
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/a8hybcgu_expires_30_days.png"
              style={{ width: '18px', height: '18px', objectFit: 'contain' }}
              alt="Google"
            />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
