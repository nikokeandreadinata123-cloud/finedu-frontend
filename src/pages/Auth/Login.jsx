import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { API_BASE_URL } from "../../api";
import styles from "./Login.module.css";

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const features = [
  { emoji: "🏅", title: "Progres Tersimpan", desc: "Lanjutkan dari terakhir kali kamu belajar" },
  { emoji: "📈", title: "Analisis Personal",  desc: "Lihat statistik pembelajaran kamu" },
  { emoji: "🎓", title: "Sertifikat Digital", desc: "Raih sertifikat untuk setiap pencapaian" },
];

function getPasswordStrength(password) {
  const checks = [/[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/].map(r => r.test(password));
  checks.push(password.length >= 8);
  const score = checks.filter(Boolean).length;
  if (!password.length) return { score: 0, label: '', color: '' };
  if (score <= 2) return { score, label: 'Lemah',      color: '#ef4444' };
  if (score === 3) return { score, label: 'Sedang',     color: '#f59e0b' };
  if (score === 4) return { score, label: 'Kuat',       color: '#10b981' };
  return             { score, label: 'Sangat Kuat', color: '#06b6d4' };
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useUser();

  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe,   setRememberMe]   = useState(false);
  const [error,        setError]        = useState('');
  const [loading,      setLoading]      = useState(false);

  const hasUpper   = /[A-Z]/.test(password);
  const hasLower   = /[a-z]/.test(password);
  const hasNumber  = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isLong     = password.length >= 8;
  const strength   = getPasswordStrength(password);

  const handleSignIn = async () => {
    if (!email || !password) { setError("Email dan password harus diisi!"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Format email tidak valid!"); return; }
    if (!hasUpper) { setError("Password harus mengandung minimal 1 huruf kapital (A-Z)!"); return; }
    if (!hasLower) { setError("Password harus mengandung minimal 1 huruf kecil (a-z)!"); return; }

    setLoading(true); setError('');
    try {
      const res  = await fetch(`${API_BASE_URL}/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.status === "success") {
        const userId = data.user?.id ?? data.user?.user_id ?? data.id ?? null;
        if (!userId) { setError("User ID tidak ditemukan."); setLoading(false); return; }
        localStorage.setItem("token",   data.token);
        localStorage.setItem("user",    JSON.stringify(data.user));
        localStorage.setItem("user_id", userId);
        login(data.user.email, data.user.name, data.user);
        navigate('/dashboard');
      } else { setError(data.message || "Login gagal."); }
    } catch { setError("Gagal terhubung ke server."); }
    finally  { setLoading(false); }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSignIn(); };

  return (
    <div className={styles.root}>

      {/* ── LEFT (hidden tablet/mobile) ── */}
      <div className={styles.left}>
        <div className={`${styles.blob} ${styles.blob1}`} />
        <div className={`${styles.blob} ${styles.blob2}`} />
        <div className={`${styles.blob} ${styles.blob3}`} />
        <div className={styles.grid} />
        <div className={styles.badge}>🔥 10K+ pengguna aktif</div>

        <div className={styles.logo}>
          <img src="/logo-finedu.jpeg" alt="Logo" />
          <span className={styles.logoTxt}>
            <span className={styles.cBlue}>Fin</span>
            <span className={styles.cGold}>Edu</span>
          </span>
        </div>

        <div className={styles.mid}>
          <h2 className={styles.headline}>
            Selamat Datang<br /><span>Kembali!</span>
          </h2>
          <p className={styles.subtext}>
            Lanjutkan perjalanan literasi<br />
            keuangan digital kamu<br />
            bersama FinEdu ✨
          </p>
          <div>
            {features.map(({ emoji, title, desc }, i) => (
              <div className={styles.featCard} key={i}>
                <div className={styles.featIcon}>{emoji}</div>
                <div>
                  <p className={styles.featTitle}>{title}</p>
                  <p className={styles.featDesc}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.rating}>⭐ Rating 4.9/5</div>
        </div>

        <div />
      </div>

      {/* ── RIGHT ── */}
      <div className={styles.right}>
        <div className={`${styles.deco} ${styles.deco1}`} />
        <div className={`${styles.deco} ${styles.deco2}`} />

        {/* Mobile header */}
        <div className={styles.mobileHeader}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <img src="/logo-finedu.jpeg" alt="Logo"
              style={{ width:'36px', height:'36px', borderRadius:'30px', objectFit:'cover', border:'2px solid rgba(52,211,153,.5)' }} />
            <span className={styles.mobileLogoTxt}>
              <span className={styles.cBlue}>Fin</span>
              <span className={styles.cGold}>Edu</span>
            </span>
          </div>
          <span style={{ fontSize:'12px', color:'#94a3b8', fontWeight:500 }}>Masuk ke akunmu</span>
        </div>

        <div className={styles.card}>
          <div className={styles.cardLogo}>
            <img src="/logo-finedu.jpeg" alt="Logo" />
            <span className={styles.cardLogoTxt}>
              <span className={styles.cBlue}>Fin</span>
              <span className={styles.cGold}>Edu</span>
            </span>
          </div>

          <h1 className={styles.title}>Sign In 👋</h1>
          <p className={styles.subtitle}>Masuk ke akun kamu untuk lanjut belajar</p>

          {error && (
            <div className={styles.errorBox}>
              <span>⚠️</span><span>{error}</span>
            </div>
          )}

          <label className={styles.label}>Email Address</label>
          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}>✉️</span>
            <input className={styles.input} type="email" placeholder="nama@email.com"
              value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKeyDown} />
          </div>

          <label className={styles.label}>Password</label>
          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}>🔒</span>
            <input className={styles.input}
              type={showPassword ? "text" : "password"}
              placeholder="Min. huruf besar + kecil"
              value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKeyDown}
            />
            <button className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)} type="button" tabIndex={-1}>
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          {password.length > 0 && (
            <>
              <div className={styles.strBars}>
                {[1,2,3,4,5].map(i => (
                  <div key={i} className={styles.strBar}
                    style={{ background: i <= strength.score ? strength.color : '#e5e7eb' }} />
                ))}
              </div>
              <p className={styles.strLabel} style={{ color: strength.color }}>{strength.label}</p>
              <div className={styles.hints}>
                {[
                  [hasUpper,'Huruf Besar'],[hasLower,'Huruf Kecil'],
                  [hasNumber,'Angka'],[hasSpecial,'Simbol'],[isLong,'8+ Karakter'],
                ].map(([ok, lbl], i) => (
                  <span key={i} className={`${styles.hint} ${ok ? styles.hintOk : styles.hintFail}`}>
                    {ok ? '✓' : '○'} {lbl}
                  </span>
                ))}
              </div>
            </>
          )}

          <div className={styles.optionsRow}>
            <label className={styles.rememberMe}>
              <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
              Ingat saya
            </label>
            <span className={styles.forgotPassword}>Lupa Password?</span>
          </div>

          <button className={styles.buttonPrimary} onClick={handleSignIn} disabled={loading}>
            {loading ? "Sedang masuk... ⏳" : "Sign In →"}
          </button>

          <p className={styles.footerText}>
            Belum punya akun?{' '}
            <span className={styles.footerLink} onClick={() => navigate('/register')}>Daftar sekarang</span>
          </p>
        </div>
      </div>
    </div>
  );
}
