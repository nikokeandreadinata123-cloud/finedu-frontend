import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/Sidebar";
import { useUser } from "../../context/UserContext";
import { API_BASE_URL } from "../../api";
import styles from "./Profile.module.css";

const TOTAL_MODUL = 3;
const TOTAL_BADGE = 6;

// Jumlah slide per modul — harus sama dengan konstanta di tiap file modul
const SLIDES_PER_MODUL = { 1: 3, 2: 3, 3: 2 };

// ─── Inject CSS animasi ke <head> (hanya keyframes & utility class, tidak duplikat module) ─
const STYLE_ID = "finedu-profile-anim";
const ANIM_CSS = `
@keyframes fePop {
  0%   { opacity:0; transform:scale(0.5) translateY(6px); }
  50%  { opacity:1; transform:scale(1.12) translateY(-3px); }
  75%  { transform:scale(0.97); }
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
  from { opacity:0; transform:translateY(14px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes feLockedIn {
  0%   { opacity:0; transform:scale(0.7) translateY(6px); }
  60%  { opacity:0.7; transform:scale(1.05) translateY(-1px); }
  100% { opacity:1; transform:scale(1) translateY(0); }
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
.fe-ring     { animation: feRing 1.1s ease-out; }
.fe-badge    { animation: fePop   0.75s cubic-bezier(0.22,1,0.36,1) both; }
.fe-check    { display:inline-block; animation: feCheck 0.6s cubic-bezier(0.22,1,0.36,1) both; }
.fe-label    { display:inline-block; animation: feLabel 0.55s cubic-bezier(0.22,1,0.36,1) both; }
.fe-row-done { animation: feBorder 2.6s ease-in-out 0.5s 2; }
.fe-fadein   { animation: feFadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
.fe-locked   { animation: feLockedIn 0.65s cubic-bezier(0.22,1,0.36,1) both; }
`;

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement("style");
  el.id = STYLE_ID;
  el.textContent = ANIM_CSS;
  document.head.appendChild(el);
}

// Inject langsung saat module load agar CSS siap sebelum render pertama
injectStyles();

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

// ─── BadgeItem: animasi sama seperti modul (state-driven) ────────────────────
function BadgeItem({ badge, index, earnedKey }) {
  const [animState, setAnimState] = useState("idle");
  const prevEarned = useRef(badge.diperoleh);
  const isMounted  = useRef(false);

  // Mount pertama → semua badge animasi masuk (earned: pop, locked: fadein)
  // Delay bertahap per index supaya muncul satu per satu
  useEffect(() => {
    const DELAY = index * 130; // 130ms per badge → smooth waterfall
    const POP_DURATION = 900;  // durasi pop + ring

    if (badge.diperoleh) {
      const t1 = setTimeout(() => setAnimState("popping"), DELAY);
      const t2 = setTimeout(() => setAnimState("done"),    DELAY + POP_DURATION);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    } else {
      // locked juga animasi masuk (fe-locked via className di icon)
      setAnimState("locked");
    }

    // Set mounted SETELAH effect pertama selesai setup
    const tm = setTimeout(() => { isMounted.current = true; }, DELAY + POP_DURATION + 100);
    return () => clearTimeout(tm);
  }, []); // eslint-disable-line

  // Badge baru terbuka saat runtime (false → true)
  useEffect(() => {
    if (!isMounted.current) return;
    if (badge.diperoleh && !prevEarned.current) {
      setAnimState("idle");
      const t1 = setTimeout(() => setAnimState("popping"), 60);
      const t2 = setTimeout(() => setAnimState("done"),    960);
      prevEarned.current = true;
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    if (!badge.diperoleh) prevEarned.current = false;
  }, [badge.diperoleh, earnedKey]);

  const isPopping = animState === "popping";
  const isDone    = animState === "done";
  const isLocked  = animState === "locked";

  return (
    <div
      className="fe-fadein"
      style={{
        animationDelay: `${index * 0.13}s`,
        display:"flex", flexDirection:"column", alignItems:"center",
        textAlign:"center", gap:"6px",
        background: badge.diperoleh ? "#F0FDF4" : "#F8F9FA",
        borderRadius:"12px", padding:"16px 12px",
        border: badge.diperoleh ? "1px solid #BBF7D0" : "1px solid transparent",
        boxShadow: badge.diperoleh ? "0 2px 8px rgba(30,201,155,0.12)" : "none",
        opacity: badge.diperoleh ? 1 : 0.55,
        transition:"background 0.5s ease, border 0.5s ease, box-shadow 0.5s ease, opacity 0.5s ease",
        minWidth:0, overflow:"hidden", boxSizing:"border-box",
      }}
    >
      <div
        key={`icon-${index}-${earnedKey}-${animState}`}
        className={[
          isPopping              ? "fe-badge" : "",
          (isPopping || isDone) && badge.diperoleh ? "fe-ring" : "",
          isLocked               ? "fe-locked" : "",
        ].filter(Boolean).join(" ")}
        style={{
          width:"44px", height:"44px", borderRadius:"12px",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:"22px", flexShrink:0,
          backgroundColor: badge.diperoleh ? badge.color : "#D1D5DB",
          filter: badge.diperoleh ? "none" : "grayscale(1)",
          animationDelay: `${index * 0.13 + 0.06}s`,
          transition:"background-color 0.5s ease, filter 0.5s ease",
        }}
      >
        {badge.icon}
      </div>
      <p style={{ fontSize:"12px", fontWeight:700, color:"#111827", margin:0, lineHeight:1.3, wordBreak:"break-word", width:"100%" }}>
        {badge.label}
      </p>
      <p style={{ fontSize:"11px", color:"#6B7280", margin:0, lineHeight:1.3, wordBreak:"break-word", width:"100%" }}>
        {badge.desc}
      </p>
      <p style={{ fontSize:"11px", fontWeight:700, margin:0, color: badge.diperoleh ? "#059669" : "#9CA3AF",
                  transition:"color 0.5s ease" }}>
        {badge.diperoleh ? "🏆 Diperoleh!" : "🔒 Belum"}
      </p>
    </div>
  );
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
  // Track streak sebagai state agar animasi badge bisa dipicu saat berubah
  const [streakDays,   setStreakDays]   = useState(() =>
    parseInt(user?.streak ?? localStorage.getItem("streak") ?? "0", 10)
  );
  // earnedKeys: init dengan key=1 untuk badge yang SUDAH earned saat mount → animasi fePop langsung
  const [earnedKeys, setEarnedKeys] = useState(() => {
    const streak = parseInt(user?.streak ?? localStorage.getItem("streak") ?? "0", 10);
    const moduls = (() => { try { return JSON.parse(localStorage.getItem("modul_selesai") || "[]"); } catch { return []; } })();
    const total  = moduls.length;
    return {
      0: streak >= 1 ? 1 : 0,   // First Step
      1: streak >= 3 ? 1 : 0,   // 3-Day Streak
      2: total  >= 1 ? 1 : 0,   // Modul Selesai
      3: total  >= 1 ? 1 : 0,   // Pembelajar Keuangan
      4: total  >= 2 ? 1 : 0,   // Setengah Jalan
      5: total  >= 3 ? 1 : 0,   // Master Keuangan
    };
  });
  // prevEarnedRef: init sesuai kondisi awal — useEffect hanya trigger badge yang BARU terbuka
  const prevEarnedRef = useRef((() => {
    const streak = parseInt(user?.streak ?? localStorage.getItem("streak") ?? "0", 10);
    const moduls = (() => { try { return JSON.parse(localStorage.getItem("modul_selesai") || "[]"); } catch { return []; } })();
    const total  = moduls.length;
    return {
      0: streak >= 1,   // First Step
      1: streak >= 3,   // 3-Day Streak
      2: total  >= 1,   // Modul Selesai
      3: total  >= 1,   // Pembelajar Keuangan
      4: total  >= 2,   // Setengah Jalan
      5: total  >= 3,   // Master Keuangan
    };
  })());

  // injectStyles sudah dipanggil di module level — tidak perlu useEffect lagi

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

  // Sync streakDays dari user context setiap kali user berubah
  useEffect(() => {
    const val = parseInt(user?.streak ?? localStorage.getItem("streak") ?? "0", 10);
    if (!isNaN(val)) setStreakDays(val);
  }, [user]);

  const badges = [
    { icon:"🏅", color:"#F59E0B", label:"First Step",           desc:"Login pertama kali",                 diperoleh: streakDays >= 1              },
    { icon:"🔥", color:"#EF4444", label:"3-Day Streak",          desc:"Login 3 hari berturut-turut",         diperoleh: streakDays >= 3              },
    { icon:"📚", color:"#8B5CF6", label:"Modul Selesai",         desc:"Selesaikan minimal 1 modul",          diperoleh: totalSelesai >= 1            },
    { icon:"📋", color:"#4A90D9", label:"Pembelajar Keuangan",   desc:"Selesaikan 1 modul pembelajaran",     diperoleh: totalSelesai >= 1            },
    { icon:"⚡", color:"#E91E63", label:"Setengah Jalan",        desc:"Selesaikan 2 modul pembelajaran",     diperoleh: totalSelesai >= 2            },
    { icon:"🏆", color:"#4DC57F", label:"Master Keuangan",       desc:"Selesaikan semua modul (3/3)",        diperoleh: totalSelesai >= TOTAL_MODUL  },
  ];

  // Deteksi badge yang baru terbuka → naikkan earnedKey → re-mount → animasi fePop
  useEffect(() => {
    const newlyEarned = [];
    badges.forEach((badge, i) => {
      if (badge.diperoleh && !(prevEarnedRef.current?.[i] ?? false)) newlyEarned.push(i);
    });
    prevEarnedRef.current = Object.fromEntries(badges.map((b, i) => [i, b.diperoleh]));
    if (newlyEarned.length > 0) {
      setEarnedKeys(prev => {
        const next = { ...prev };
        newlyEarned.forEach(i => { next[i] = (prev[i] ?? 0) + 1; });
        return next;
      });
    }
  }, [streakDays, totalSelesai]);

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
              <BadgeItem
                key={`badgeitem-${i}-${earnedKeys[i]??0}`}
                badge={badge}
                index={i}
                earnedKey={earnedKeys[i] ?? 0}
              />
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
