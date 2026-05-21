import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/Sidebar";
import { useUser } from "../../context/UserContext";
import { API_BASE_URL } from "../../api";
import styles from "./Profile.module.css";

const TOTAL_MODUL = 3;
const TOTAL_BADGE = 3;

// Jumlah slide per modul — harus sama dengan konstanta di tiap file modul
const SLIDES_PER_MODUL = { 1: 3, 2: 3, 3: 2 };

// ─── Inject CSS animasi ke <head> (hanya keyframes & utility class, tidak duplikat module) ─
const STYLE_ID = "finedu-profile-anim";
const ANIM_CSS = `
@keyframes fePop {
  0%   { opacity:0; transform:scale(0.4) translateY(4px); }
  60%  { opacity:1; transform:scale(1.18) translateY(-2px); }
  80%  { transform:scale(0.96); }
  100% { opacity:1; transform:scale(1) translateY(0); }
}
@keyframes feShimmer {
  0%   { background-position:-200% center; }
  100% { background-position:200% center; }
}
@keyframes feGlow {
  0%,100% { box-shadow:0 0 4px rgba(30,201,155,0.35); }
  50%      { box-shadow:0 0 16px rgba(30,201,155,0.9); }
}
@keyframes feRing {
  0%   { box-shadow:0 0 0 0 rgba(30,201,155,0.6); }
  70%  { box-shadow:0 0 0 12px rgba(30,201,155,0); }
  100% { box-shadow:0 0 0 0 rgba(30,201,155,0); }
}
@keyframes feCheck {
  0%   { transform:scale(0) rotate(-20deg); opacity:0; }
  55%  { transform:scale(1.35) rotate(5deg); opacity:1; }
  75%  { transform:scale(0.92); }
  100% { transform:scale(1) rotate(0deg); opacity:1; }
}
@keyframes feLabel {
  0%   { opacity:0; transform:translateX(10px); }
  65%  { opacity:1; transform:translateX(-2px); }
  100% { opacity:1; transform:translateX(0); }
}
@keyframes feBorder {
  0%,100% { border-color:#9ae6b4; box-shadow:none; }
  50%      { border-color:#1EC99B; box-shadow:0 0 12px rgba(30,201,155,0.3); }
}
@keyframes feFadeUp {
  from { opacity:0; transform:translateY(10px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes feCfDrop {
  0%   { transform:translateY(0) rotate(0deg); opacity:1; }
  100% { transform:translateY(72px) rotate(720deg); opacity:0; }
}

.fe-bar-done {
  background: linear-gradient(90deg,#1EC99B 0%,#17a082 35%,#38f0be 60%,#17a082 100%) !important;
  background-size: 200% auto !important;
  animation: feShimmer 1.8s linear infinite, feGlow 2s ease-in-out infinite;
}
.fe-ring     { animation: feRing 0.85s ease-out; }
.fe-badge    { animation: fePop 0.55s cubic-bezier(0.34,1.56,0.64,1) both; }
.fe-check    { display:inline-block; animation: feCheck 0.48s cubic-bezier(0.34,1.56,0.64,1) both; }
.fe-label    { display:inline-block; animation: feLabel 0.42s cubic-bezier(0.34,1.56,0.64,1) both; }
.fe-row-done { animation: feBorder 2.6s ease-in-out 0.5s 2; }
.fe-fadein   { animation: feFadeUp 0.4s ease both; }
`;

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement("style");
  el.id = STYLE_ID;
  el.textContent = ANIM_CSS;
  document.head.appendChild(el);
}

// ─── Baca status modul dari localStorage ────────────────────────────────────
function getModulSelesaiFromLocal() {
  const selesai = [];
  for (const [id, totalSlides] of Object.entries(SLIDES_PER_MODUL)) {
    try {
      const saved = JSON.parse(localStorage.getItem(`modul_${id}`));
      if (saved && Array.isArray(saved.completed) && saved.completed.length >= totalSlides) {
        selesai.push(Number(id));
      }
    } catch (_) {}
  }
  return selesai;
}

// ─── Confetti ────────────────────────────────────────────────────────────────
const CF_COLORS = ["#1EC99B","#3B82F6","#F59E0B","#8B5CF6","#EC4899","#38f0be","#FF6B6B"];

function MiniConfetti({ active }) {
  if (!active) return null;
  return (
    <div style={{ position:"absolute", top:0, left:0, right:0, height:55, overflow:"hidden", pointerEvents:"none", zIndex:10 }}>
      {Array.from({ length: 18 }, (_, i) => (
        <div key={i} style={{
          position:"absolute",
          left:`${4 + i * 5.2}%`,
          top:"-4px",
          width:`${4 + (i % 4) * 2}px`,
          height:`${4 + (i % 4) * 2}px`,
          background: CF_COLORS[i % CF_COLORS.length],
          borderRadius: i % 3 === 0 ? "50%" : "2px",
          animation:`feCfDrop ${0.9 + (i % 3) * 0.25}s ${(i * 0.05).toFixed(2)}s ease-out forwards`,
        }} />
      ))}
    </div>
  );
}

// ─── Animated Bar ─────────────────────────────────────────────────────────────
function AnimatedModulBar({ target, selesai }) {
  const [width,        setWidth]        = useState(0);
  const [showBadge,    setShowBadge]    = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [ringKey,      setRingKey]      = useState(0);
  const [barDone,      setBarDone]      = useState(false);
  const rafRef      = useRef(null);
  const prevSelesai = useRef(selesai);

  useEffect(() => {
    injectStyles();
    const wasSelesai = prevSelesai.current;
    prevSelesai.current = selesai;

    setWidth(0);
    setShowBadge(false);
    setShowConfetti(false);
    setBarDone(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    if (target === 0) return;

    let startTime = null;
    const DURATION = 1000;
    const tid = setTimeout(() => {
      const step = (ts) => {
        if (!startTime) startTime = ts;
        const t     = Math.min((ts - startTime) / DURATION, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setWidth(Math.round(eased * target));
        if (t < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          setBarDone(true);
          setRingKey(k => k + 1);
          setTimeout(() => {
            setShowBadge(true);
            if (!wasSelesai) setShowConfetti(true);
          }, 120);
        }
      };
      rafRef.current = requestAnimationFrame(step);
    }, 300);

    return () => {
      clearTimeout(tid);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, selesai]);

  return (
    <div style={{ position:"relative" }}>
      <MiniConfetti active={showConfetti} />

      <div
        key={`ring-${ringKey}`}
        className={ringKey > 0 ? "fe-ring" : ""}
        style={{ width:"100%", height:"9px", backgroundColor:"#e2e8f0", borderRadius:"99px", overflow:"hidden", position:"relative" }}
      >
        {width > 0 && (
          <div
            className={barDone ? "fe-bar-done" : ""}
            style={{
              height:"100%",
              borderRadius:"99px",
              width:`${width}%`,
              ...(!barDone ? { backgroundColor:"#1EC99B" } : {}),
            }}
          />
        )}
      </div>

      {showBadge && (
        <div className="fe-badge" style={{
          position:"absolute", right:0, top:"-26px",
          display:"flex", alignItems:"center", gap:4,
          background:"linear-gradient(90deg,#1EC99B,#17a082)",
          color:"#fff", fontSize:"10px", fontWeight:700,
          padding:"3px 10px", borderRadius:99,
          letterSpacing:"0.06em", whiteSpace:"nowrap",
          boxShadow:"0 2px 12px rgba(30,201,155,0.5)",
        }}>
          <span className="fe-check" style={{ animationDelay:"0.05s" }}>✓</span>
          <span className="fe-label" style={{ animationDelay:"0.12s" }}>Complete!</span>
        </div>
      )}
    </div>
  );
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target }) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    setCount(0);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    let startTime = null;
    const DURATION = 900;
    const tid = setTimeout(() => {
      const step = (ts) => {
        if (!startTime) startTime = ts;
        const t = Math.min((ts - startTime) / DURATION, 1);
        setCount(Math.round((1 - Math.pow(1 - t, 3)) * target));
        if (t < 1) rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    }, 300);
    return () => { clearTimeout(tid); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target]);

  return <span>{count}</span>;
}

// ─── Main Component ───────────────────────────────────────────────────────────
const ProfileDesktop = () => {
  const { user, login } = useUser();
  const [showModal,    setShowModal]    = useState(false);
  const [editName,     setEditName]     = useState("");
  const [editPhone,    setEditPhone]    = useState("");
  const [loading,      setLoading]      = useState(false);
  const [successMsg,   setSuccessMsg]   = useState("");
  const [errorMsg,     setErrorMsg]     = useState("");
  const [modulSelesai, setModulSelesai] = useState([]);

  useEffect(() => { injectStyles(); }, []);

  // ── Fetch progress: coba API dulu, fallback ke localStorage ─────────────
  const fetchProgress = () => {
    const userId = localStorage.getItem("user_id");

    const localSelesai = getModulSelesaiFromLocal();
    setModulSelesai(localSelesai);

    if (!userId) return;
    fetch(`${API_BASE_URL}/get_modul.php?user_id=${userId}`)
      .then(r => r.json())
      .then(d => {
        if (d.status === "success" && Array.isArray(d.modul_selesai)) {
          const merged = Array.from(new Set([...d.modul_selesai, ...localSelesai]));
          setModulSelesai(merged);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchProgress();
    window.addEventListener("focus", fetchProgress);
    const interval = setInterval(fetchProgress, 3000);
    return () => {
      window.removeEventListener("focus", fetchProgress);
      clearInterval(interval);
    };
  }, []);

  const totalSelesai   = modulSelesai.length;
  const progressPersen = Math.round((totalSelesai / TOTAL_MODUL) * 100);

  const badges = [
    { icon:"📋", color:"#4A90D9", label:"Pembelajar Keuangan", desc:"Selesaikan 1 modul pembelajaran", diperoleh: totalSelesai >= 1 },
    { icon:"⚡", color:"#E91E63", label:"Setengah Jalan",      desc:"Selesaikan 2 modul pembelajaran", diperoleh: totalSelesai >= 2 },
    { icon:"🏆", color:"#4DC57F", label:"Master Keuangan",     desc:"Selesaikan semua modul (3/3)",    diperoleh: totalSelesai >= TOTAL_MODUL },
  ];
  const badgeDiperoleh = badges.filter(b => b.diperoleh).length;

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  };

  const openModal = () => {
    setEditName(user?.name || "");
    setEditPhone(user?.phone || "");
    setSuccessMsg(""); setErrorMsg("");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editName.trim()) { setErrorMsg("Nama tidak boleh kosong"); return; }
    setLoading(true); setErrorMsg("");
    try {
      const res  = await fetch(`${API_BASE_URL}/edit_profile.php`, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ id: user?.id, full_name: editName, phone: editPhone }),
      });
      const data = await res.json();
      if (data.status === "success") {
        const updated = { ...user, name: editName, phone: editPhone };
        login(updated.email, updated.name, updated);
        localStorage.setItem("user", JSON.stringify(updated));
        setSuccessMsg("Profil berhasil diperbarui!");
        setTimeout(() => setShowModal(false), 1200);
      } else {
        setErrorMsg(data.message || "Gagal memperbarui profil");
      }
    } catch {
      setErrorMsg("Gagal terhubung ke server. Pastikan XAMPP aktif.");
    } finally {
      setLoading(false);
    }
  };

  const MODUL_NAMES = { 1:"Manajemen Utang", 2:"Dasar Investasi", 3:"Dasar Penganggaran" };

  return (
    <div className={styles.profileWrapper}>
      <Sidebar />

      <main className={styles.profileMain}>

        {/* ── Page Header ── */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Profile</h1>
          <p className={styles.pageSubtitle}>Lihat pencapaian dan riwayat pembelajaran kamu</p>
        </div>

        {/* ── User Info Card ── */}
        <div className={styles.userCard}>
          <div className={styles.avatar}>
            {getInitials(user?.name)}
          </div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user?.name || "Pengguna"}</p>
            <p className={styles.userEmail}>{user?.email || "-"}</p>
            <p className={styles.userJoined}>Bergabung sejak Januari 2024</p>
          </div>
          <button onClick={openModal} className={styles.editBtn}>
            Edit Profile
          </button>
        </div>

        {/* ── Stats Grid ── */}
        <div className={styles.statsGrid}>
          {[
            { value: totalSelesai,   total: TOTAL_MODUL, label: "Modul Selesai" },
            { value: badgeDiperoleh, total: TOTAL_BADGE,  label: "Badge Diperoleh" },
          ].map((s, i) => (
            <div key={i} className={styles.statCard}>
              <strong className={styles.statValue}>
                <span><AnimatedCounter target={s.value} /></span>/{s.total}
              </strong>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Progress Modul ── */}
        <div className={styles.progressCard}>
          <p className={styles.sectionTitle}>Progress Modul</p>

          {[1, 2, 3].map((id, idx) => {
            const selesai = modulSelesai.includes(id);
            return (
              <div
                key={id}
                className={[
                  styles.modulRow,
                  selesai ? styles.modulDone : "",
                  "fe-fadein",
                  selesai ? "fe-row-done" : "",
                ].join(" ")}
                style={{ animationDelay:`${idx * 0.08}s` }}
              >
                <div className={styles.modulRowHeader}>
                  <span className={styles.modulName}>{MODUL_NAMES[id]}</span>
                  {selesai ? (
                    <span className={styles.badgeDone}>
                      <span className="fe-check">✓</span> Selesai
                    </span>
                  ) : (
                    <span className={styles.badgePending}>Belum</span>
                  )}
                </div>

                <AnimatedModulBar
                  key={`bar-${id}-${selesai}`}
                  target={selesai ? 100 : 0}
                  selesai={selesai}
                />
              </div>
            );
          })}

          <p className={styles.progressFooter}>
            <span><AnimatedCounter target={progressPersen} />%</span> selesai
          </p>
        </div>

        {/* ── Badge & Achievement ── */}
        <div className={styles.badgeCard}>
          <p className={styles.sectionTitle}>Badge &amp; Achievement</p>
          <p className={styles.sectionSubtitle}>Kumpulkan badge dengan menyelesaikan modul</p>

          <div className={styles.badgeGrid}>
            {badges.map((badge, i) => (
              <div
                key={i}
                className={[styles.badgeItem, badge.diperoleh ? styles.badgeEarned : ""].join(" ")}
              >
                <div
                  className={[styles.badgeIcon, badge.diperoleh ? "" : styles.locked].join(" ")}
                  style={{ backgroundColor: badge.diperoleh ? badge.color : undefined }}
                >
                  {badge.icon}
                </div>
                <p className={styles.badgeLabel}>{badge.label}</p>
                <p className={styles.badgeDesc}>{badge.desc}</p>
                <p className={[styles.badgeStatus, badge.diperoleh ? styles.earned : styles.locked].join(" ")}>
                  {badge.diperoleh ? "🏆 Diperoleh!" : "🔒 Belum"}
                </p>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* ── Modal Edit Profile ── */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Edit Profile</h2>
              <button onClick={() => setShowModal(false)} className={styles.modalClose}>✕</button>
            </div>

            <div className={styles.modalAvatar}>
              <div className={styles.modalAvatarCircle}>
                {getInitials(editName || user?.name)}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nama Lengkap</label>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className={styles.formInput}
              />
              <p className={styles.formHint}>Email tidak dapat diubah</p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>No. Telepon</label>
              <input
                type="tel"
                value={editPhone}
                onChange={e => setEditPhone(e.target.value)}
                placeholder="Masukkan nomor telepon"
                className={styles.formInput}
              />
            </div>

            {errorMsg   && <div className={styles.alertError}>{errorMsg}</div>}
            {successMsg && <div className={styles.alertSuccess}>{successMsg}</div>}

            <div className={styles.modalActions}>
              <button onClick={() => setShowModal(false)} className={styles.btnCancel}>Batal</button>
              <button onClick={handleSave} disabled={loading} className={styles.btnSave}>
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDesktop;
