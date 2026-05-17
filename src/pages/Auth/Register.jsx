import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api";
import styles from "./Register.module.css";

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

function getPasswordStrength(password) {
  const checks = [/[A-Z]/,/[a-z]/,/[0-9]/,/[^A-Za-z0-9]/].map(r => r.test(password));
  checks.push(password.length >= 8);
  const score = checks.filter(Boolean).length;
  if (!password.length) return { score:0, label:'', color:'' };
  if (score <= 2) return { score, label:'Lemah 😬',      color:'#ef4444' };
  if (score === 3) return { score, label:'Sedang 🤔',     color:'#f59e0b' };
  if (score === 4) return { score, label:'Kuat 💪',       color:'#10b981' };
  return             { score, label:'Sangat Kuat 🔥', color:'#06b6d4' };
}

export default function Register() {
  const navigate = useNavigate();

  const [fullName,        setFullName]        = useState('');
  const [email,           setEmail]           = useState('');
  const [phone,           setPhone]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword,    setShowPassword]    = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [agree,           setAgree]           = useState(false);
  const [error,           setError]           = useState('');
  const [success,         setSuccess]         = useState('');
  const [loading,         setLoading]         = useState(false);

  const hasUpper   = /[A-Z]/.test(password);
  const hasLower   = /[a-z]/.test(password);
  const hasNumber  = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isLong     = password.length >= 8;
  const strength   = getPasswordStrength(password);

  const pwMatch    = confirmPassword.length > 0 && password === confirmPassword;
  const pwMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleRegister = async () => {
    setError(''); setSuccess('');
    if (!fullName || !email || !password || !confirmPassword) { setError("Harap isi semua field yang wajib!"); return; }
    if (!agree)    { setError("Harap setujui Syarat & Ketentuan terlebih dahulu"); return; }
    if (!hasUpper) { setError("Password harus mengandung minimal 1 huruf kapital (A-Z)!"); return; }
    if (!hasLower) { setError("Password harus mengandung minimal 1 huruf kecil (a-z)!"); return; }
    if (password.length < 6)         { setError("Password minimal 6 karakter!"); return; }
    if (password !== confirmPassword) { setError("Password dan konfirmasi password tidak cocok!"); return; }

    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE_URL}/register.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, email, phone, password }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setSuccess("Akun berhasil dibuat! Silakan login.");
        setTimeout(() => navigate('/login'), 1500);
      } else { setError(data.message || "Registrasi gagal."); }
    } catch (err) {
      console.error(err);
      setError("Gagal terhubung ke server. Pastikan XAMPP aktif.");
    } finally { setLoading(false); }
  };

  return (
    <div className={styles.root}>

      {/* ── LEFT ── */}
      <div className={styles.left}>
        <div className={`${styles.blob} ${styles.blob1}`} />
        <div className={`${styles.blob} ${styles.blob2}`} />
        <div className={`${styles.blob} ${styles.blob3}`} />
        <div className={styles.grid} />

        <div className={styles.logo}>
          <img src="/logo-finedu.jpeg" alt="Logo" />
          <span className={styles.logoTxt}>
            <span className={styles.cBlue}>Fin</span>
            <span className={styles.cGold}>Edu</span>
          </span>
        </div>

        <div className={styles.mid}>
          <h2 className={styles.headline}>
            Mulai Perjalanan<br /><em>Literasi Keuangan</em><br />Kamu 🚀
          </h2>
          <p className={styles.subtext}>
            Bergabung dengan ribuan pengguna<br />
            yang udah upgrade skill finansial<br />
            mereka bareng FinEdu.
          </p>
          <div>
            {[
              { icon:"📚", title:"Modul Pembelajaran", desc:"Akses ke puluhan modul keuangan berkualitas" },
              { icon:"🏆", title:"Badges & Sertifikat",  desc:"Dapatkan pengakuan atas pencapaian kamu" },
              { icon:"🤝", title:"Komunitas Aktif",      desc:"Belajar bareng dengan sesama Gen Z" },
            ].map((f, i) => (
              <div className={styles.featItem} key={i}>
                <div className={styles.featItemIcon}>{f.icon}</div>
                <div>
                  <p className={styles.featItemTitle}>{f.title}</p>
                  <p className={styles.featItemDesc}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.stats}>
          {[['10K+','Pengguna'],['50+','Modul'],['4.9★','Rating']].map(([n,l],i) => (
            <div className={styles.stat} key={i}>
              <div className={styles.statNum}>{n}</div>
              <div className={styles.statLbl}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div className={styles.right}>
        <div className={`${styles.deco} ${styles.deco1}`} />
        <div className={`${styles.deco} ${styles.deco2}`} />

        <div className={styles.wrap}>
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
            <span className={styles.mobileTagline}>Buat akun baru</span>
          </div>

          <div className={styles.card}>
            <div className={styles.cardLogo}>
              <img src="/logo-finedu.jpeg" alt="Logo" />
              <span className={styles.cardLogoTxt}>
                <span className={styles.cBlue}>Fin</span>
                <span className={styles.cGold}>Edu</span>
              </span>
            </div>

            <h1 className={styles.title}>Create Account ✨</h1>
            <p className={styles.subtitle}>Daftar & mulai perjalanan finansial kamu sekarang</p>

            {error   && <div className={`${styles.alert} ${styles.alertErr}`}><span>⚠️</span><span>{error}</span></div>}
            {success && <div className={`${styles.alert} ${styles.alertOk}`}><span>🎉</span><span>{success}</span></div>}

            {/* Full Name */}
            <label className={styles.label}>Full Name</label>
            <div className={styles.inputGroup}>
              <span className={styles.inputIcon}>👤</span>
              <input className={styles.inputField} type="text" placeholder="Nama lengkap kamu"
                value={fullName} onChange={e => setFullName(e.target.value)} />
            </div>

            {/* Email */}
            <label className={styles.label}>Email Address</label>
            <div className={styles.inputGroup}>
              <span className={styles.inputIcon}>✉️</span>
              <input className={styles.inputField} type="email" placeholder="nama@gmail.com"
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            {/* Phone */}
            <label className={styles.label}>
              Phone Number <span className={styles.labelOpt}>(opsional)</span>
            </label>
            <div className={styles.inputGroup}>
              <span className={styles.inputIcon}>📱</span>
              <input className={styles.inputField} type="tel" placeholder="08xxxxxxxxxx"
                value={phone} onChange={e => setPhone(e.target.value)} />
            </div>

            {/* Password */}
            <label className={styles.label}>Password</label>
            <div className={styles.inputGroup}>
              <span className={styles.inputIcon}>🔒</span>
              <input className={styles.inputField}
                type={showPassword ? "text" : "password"}
                placeholder="Min. huruf besar + kecil"
                value={password} onChange={e => setPassword(e.target.value)}
              />
              <button className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)} type="button" tabIndex={-1}>
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {/* Strength */}
            {password.length > 0 && (
              <>
                <div className={styles.strBars}>
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className={styles.strBar}
                      style={{ background: i <= strength.score ? strength.color : '#e5e7eb' }} />
                  ))}
                </div>
                <div className={styles.strMeta}>
                  <span className={styles.strLabel} style={{ color: strength.color }}>{strength.label}</span>
                </div>
                <div className={styles.hints}>
                  {[
                    [hasUpper,'Huruf Besar'],[hasLower,'Huruf Kecil'],
                    [hasNumber,'Angka'],[hasSpecial,'Simbol'],[isLong,'8+ Karakter'],
                  ].map(([ok,lbl],i) => (
                    <span key={i} className={`${styles.hint} ${ok ? styles.hintOk : styles.hintFail}`}>
                      {ok ? '✓' : '○'} {lbl}
                    </span>
                  ))}
                </div>
              </>
            )}

            {/* Confirm Password */}
            <label className={styles.label}>Confirm Password</label>
            <div className={styles.inputGroup} style={{
              boxShadow: pwMatch ? '0 0 0 2px #34D399' : pwMismatch ? '0 0 0 2px #ef4444' : 'none',
              background: pwMatch || pwMismatch ? '#fff' : undefined,
            }}>
              <span className={styles.inputIcon}>🔐</span>
              <input className={styles.inputField}
                type={showConfirm ? "text" : "password"}
                placeholder="Ulangi password kamu"
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              />
              <button className={styles.eyeBtn} onClick={() => setShowConfirm(!showConfirm)} type="button" tabIndex={-1}>
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {/* Match indicator */}
            {confirmPassword.length > 0 && (
              <div className={styles.matchRow} style={{ color: pwMatch ? '#16a34a' : '#ef4444' }}>
                <div className={styles.matchDot} style={{ background: pwMatch ? '#16a34a' : '#ef4444' }} />
                {pwMatch ? 'Password cocok ✓' : 'Password belum cocok'}
              </div>
            )}

            {/* Checkbox */}
            <label className={styles.checkboxContainer}>
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
              <span className={styles.checkboxText}>
                Saya setuju dengan{' '}
                <span className={styles.checkboxLink}>Syarat & Ketentuan</span>
                {' '}dan{' '}
                <span className={styles.checkboxLink}>Kebijakan Privasi</span>
                {' '}FinEdu
              </span>
            </label>

            <button className={styles.submitBtn} onClick={handleRegister} disabled={loading}>
              {loading ? "Sedang mendaftar... ⏳" : "Create Account →"}
            </button>

            <p className={styles.footerText}>
              Sudah punya akun?{' '}
              <span className={styles.link} onClick={() => navigate('/login')}>Sign In</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
