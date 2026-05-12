import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');
    setSuccess('');

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Harap isi semua field yang wajib!");
      return;
    }
    if (!agree) {
      setError("Harap setujui Syarat & Ketentuan terlebih dahulu");
      return;
    }
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok!");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter!");
      return;
    }

    setLoading(true);

    try {
      
      const res = await fetch(`${API_BASE_URL}/register.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email,
          phone,
          password,
        }),
      });

      const data = await res.json();

      if (data.status === "success") {
        setSuccess("Akun berhasil dibuat! Silakan login.");
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(data.message || "Registrasi gagal.");
      }
    } catch (err) {
      console.error(err);
      setError("Gagal terhubung ke server. Pastikan XAMPP aktif.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* ===== KIRI - Hijau ===== */}
      <div className="flex flex-col justify-between p-10 flex-1" style={{ backgroundColor: '#34D399' }}>
        <div className="flex items-center gap-2">
          <img src="/logo-finedu.jpeg"
            className="w-12 h-12 object-fill rounded-full" alt="Logo"/>
          <span className="text-[28px] font-bold">
            <span style={{ color: '#384DB8' }}>Fin</span>
            <span style={{ color: '#FFC107' }}>Edu</span>
          </span>
        </div>
        <div>
          <h2 className="text-white text-[36px] font-bold mb-4">Mulai Perjalanan Literasi<br />Keuangan Anda</h2>
          <p className="text-white text-base mb-10" style={{ opacity: 0.9 }}>
            Bergabunglah dengan ribuan<br />pengguna yang telah<br />meningkatkan finansial mereka<br />bersama FinEdu.
          </p>
          <div className="flex flex-col gap-5">
            {[
              { icon: "📚", title: "Modul Pembelajaran", desc: "Akses ke puluhan modul keuangan berkualitas" },
              { icon: "🏆", title: "Badges dan sertifikat", desc: "Dapatkan pengakuan atas pencapaian Anda" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                  <span className="text-lg">{f.icon}</span>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{f.title}</p>
                  <p className="text-white text-xs" style={{ opacity: 0.85 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div></div>
      </div>

      {/* ===== KANAN - Form Register ===== */}
      {}
      <div style={{
        width: '480px', minWidth: '400px',
        backgroundColor: '#F3F4F6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '32px 24px', overflowY: 'auto',
      }}>
        {/* Card putih */}
        <div style={{
          backgroundColor: '#fff', borderRadius: '20px',
          padding: '32px 28px', width: '100%',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        }}>

          {/* Logo kanan */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <img src="/logo-finedu.jpeg"
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
              alt="Logo"/>
            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
              <span style={{ color: '#384DB8' }}>Fin</span>
              <span style={{ color: '#FFC107' }}>Edu</span>
            </span>
          </div>

          <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#000', marginBottom: '4px' }}>Create Account</h1>
          <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '16px' }}>
            Daftar untuk memulai pembelajaran finansial anda
          </p>

          {/* Error */}
          {error && (
            <div style={{
              marginBottom: '12px', padding: '10px 14px', borderRadius: '10px',
              fontSize: '13px', color: '#DC2626',
              backgroundColor: '#FEF2F2', border: '1px solid #FECACA',
            }}>
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div style={{
              marginBottom: '12px', padding: '10px 14px', borderRadius: '10px',
              fontSize: '13px', color: '#16A34A',
              backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0',
            }}>
              {success}
            </div>
          )}

          {/* Fields: Full Name, Email, Phone */}
          {[
            { label: 'Full Name', icon: '👤', type: 'text', placeholder: 'Masukan nama lengkap Anda', value: fullName, onChange: setFullName },
            { label: 'Email Address', icon: '✉️', type: 'email', placeholder: 'nama@gmail.com', value: email, onChange: setEmail },
            { label: 'Phone Number', icon: '📞', type: 'tel', placeholder: 'Xxxxxxxx', value: phone, onChange: setPhone },
          ].map((field, i) => (
            <div key={i}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#000', display: 'block', marginBottom: '6px' }}>
                {field.label}
              </label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                border: '1px solid #E0E0E0', borderRadius: '10px',
                padding: '10px 12px', marginBottom: '12px',
                backgroundColor: '#F9F9F9',
              }}>
                <span style={{ fontSize: '16px' }}>{field.icon}</span>
                <input
                  type={field.type} placeholder={field.placeholder} value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13px', background: 'transparent', color: '#000' }}
                />
              </div>
            </div>
          ))}

          {/* Password */}
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#000', display: 'block', marginBottom: '6px' }}>
            Password
          </label>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            border: '1px solid #E0E0E0', borderRadius: '10px',
            padding: '10px 12px', marginBottom: '12px',
            backgroundColor: '#F9F9F9',
          }}>
            <span style={{ fontSize: '16px' }}>🔒</span>
            <input
              type={showPassword ? "text" : "password"} placeholder="Minimal 6 karakter"
              value={password} onChange={(e) => setPassword(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13px', background: 'transparent', color: '#000' }}
            />
            <span onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </span>
          </div>

          {/* Confirm Password */}
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#000', display: 'block', marginBottom: '6px' }}>
            Confirm Password
          </label>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            border: '1px solid #E0E0E0', borderRadius: '10px',
            padding: '10px 12px', marginBottom: '12px',
            backgroundColor: '#F9F9F9',
          }}>
            <span style={{ fontSize: '16px' }}>🔒</span>
            <input
              type={showConfirm ? "text" : "password"} placeholder="Konfirmasi password anda"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13px', background: 'transparent', color: '#000' }}
            />
            <span onClick={() => setShowConfirm(!showConfirm)}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
            </span>
          </div>

          {/* Checkbox */}
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '16px', cursor: 'pointer' }}>
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)}
              style={{ width: '14px', height: '14px', marginTop: '2px', flexShrink: 0 }}/>
            <span style={{ fontSize: '12px', color: '#000' }}>
              Saya setuju dengan{' '}
              <span style={{ fontWeight: '600', color: '#34D399', cursor: 'pointer' }}>Syarat & Ketentuan</span>
              {' '}dan{' '}
              <span style={{ fontWeight: '600', color: '#34D399', cursor: 'pointer' }}>Kebijakan Privasi</span>
            </span>
          </label>

          {/* Tombol Create Account */}
          <button
            onClick={handleRegister}
            disabled={loading}
            style={{
              width: '100%', padding: '12px', borderRadius: '10px',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              backgroundColor: loading ? '#6EE7B7' : '#34D399',
              color: '#fff', fontSize: '14px', fontWeight: 'bold',
              marginBottom: '12px', transition: 'opacity 0.2s',
            }}>
            {loading ? "Sedang mendaftar..." : "Create Account"}
          </button>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#000', marginBottom: '16px' }}>
            Sudah punya akun?{' '}
            <span onClick={() => navigate('/login')}
              style={{ color: '#34D399', fontWeight: 'bold', cursor: 'pointer' }}>
              Sign In
            </span>
          </p>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E0E0E0' }} />
            <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Atau daftar dengan</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E0E0E0' }} />
          </div>

          {/* Google */}
          <button style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '10px', padding: '11px', borderRadius: '10px',
            border: '1px solid #E0E0E0', backgroundColor: '#fff',
            cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#000',
          }}>
            <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/a8hybcgu_expires_30_days.png"
              style={{ width: '18px', height: '18px', objectFit: 'contain' }} alt="Google"/>
            Google
          </button>
        </div>
      </div>
    </div>
  );
}