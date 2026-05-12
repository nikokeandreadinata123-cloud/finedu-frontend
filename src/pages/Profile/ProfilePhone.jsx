import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/Sidebar";
import { useUser } from "../../context/UserContext";
import { API_BASE_URL } from "../../api";

const TOTAL_MODUL = 3;
const TOTAL_BADGE = 3;

const CSS = `
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(8px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes popIn {
    0%  { opacity:0; transform:scale(0.5); }
    70% { transform:scale(1.2); }
    100%{ opacity:1; transform:scale(1); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes cfDrop {
    0%   { transform:translateY(0) rotate(0deg);    opacity:1; }
    100% { transform:translateY(70px) rotate(720deg); opacity:0; }
  }
  @keyframes pulse {
    0%,100% { opacity:1; }
    50%      { opacity:0.6; }
  }
  @keyframes glowPop {
    0%   { opacity:0; transform:scale(0.4) translateY(4px); filter:blur(4px); }
    60%  { opacity:1; transform:scale(1.18) translateY(-2px); filter:blur(0); }
    80%  { transform:scale(0.96); }
    100% { opacity:1; transform:scale(1) translateY(0); filter:blur(0); }
  }
  @keyframes ringPulse {
    0%   { box-shadow: 0 0 0 0 rgba(30,201,155,0.6); }
    70%  { box-shadow: 0 0 0 12px rgba(30,201,155,0); }
    100% { box-shadow: 0 0 0 0 rgba(30,201,155,0); }
  }
  @keyframes floatUp {
    0%   { opacity:1; transform:translateY(0) scale(1); }
    100% { opacity:0; transform:translateY(-32px) scale(0.7); }
  }
  @keyframes borderShimmer {
    0%   { border-color: #9ae6b4; box-shadow: 0 0 0px rgba(30,201,155,0); }
    50%  { border-color: #1EC99B; box-shadow: 0 0 12px rgba(30,201,155,0.35); }
    100% { border-color: #9ae6b4; box-shadow: 0 0 0px rgba(30,201,155,0); }
  }
  @keyframes checkBounce {
    0%   { transform: scale(0) rotate(-20deg); opacity:0; }
    50%  { transform: scale(1.3) rotate(5deg);  opacity:1; }
    75%  { transform: scale(0.92) rotate(-2deg); }
    100% { transform: scale(1) rotate(0deg); opacity:1; }
  }
  @keyframes barGlow {
    0%,100% { box-shadow: 0 0 4px rgba(30,201,155,0.4); }
    50%      { box-shadow: 0 0 12px rgba(30,201,155,0.8); }
  }
  @keyframes completeLabelSlide {
    0%   { opacity:0; transform:translateX(10px) scale(0.85); }
    60%  { opacity:1; transform:translateX(-3px) scale(1.05); }
    100% { opacity:1; transform:translateX(0) scale(1); }
  }
  @keyframes barGlow {
    0%,100% { box-shadow: 0 0 4px rgba(30,201,155,0.4); }
    50%      { box-shadow: 0 0 12px rgba(30,201,155,0.8); }
  }

  .complete-badge {
    animation: glowPop 0.55s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  .complete-bar {
    background: linear-gradient(90deg, #1EC99B 0%, #17a082 35%, #38f0be 60%, #17a082 100%) !important;
    background-size: 200% auto !important;
    animation: shimmer 1.8s linear infinite, barGlow 2s ease-in-out infinite;
  }
  .complete-row {
    animation: fadeUp 0.4s ease both;
  }
  .complete-row-done {
    animation: borderShimmer 2.5s ease-in-out 0.5s 2;
  }
  .check-icon {
    animation: checkBounce 0.5s cubic-bezier(0.34,1.56,0.64,1) 1.1s both;
    display: inline-block;
  }
  .ring-pulse {
    animation: ringPulse 0.85s ease-out 1s;
  }
  .complete-label-slide {
    animation: completeLabelSlide 0.45s cubic-bezier(0.34,1.56,0.64,1) 1.15s both;
  }
`;

const CONFETTI_COLORS = ["#1EC99B","#3B82F6","#F59E0B","#8B5CF6","#EC4899","#38f0be","#FF6B6B"];

function MiniConfetti({ active }) {
  if (!active) return null;
  const dots = Array.from({ length: 18 }, (_, i) => ({
    left: `${4 + i * 5.2}%`,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: `${(i * 0.05).toFixed(2)}s`,
    size: `${4 + (i % 4) * 2}px`,
    isCircle: i % 3 === 0,
    duration: `${0.9 + (i % 3) * 0.25}s`,
  }));
  return (
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0,
      height: 55, overflow: "hidden", pointerEvents: "none", zIndex: 10,
    }}>
      {dots.map((d, i) => (
        <div key={i} style={{
          position: "absolute", left: d.left, top: "-4px",
          width: d.size, height: d.size,
          background: d.color,
          borderRadius: d.isCircle ? "50%" : "2px",
          animationName: "cfDrop",
          animationDuration: d.duration,
          animationDelay: d.delay,
          animationTimingFunction: "ease-out",
          animationFillMode: "forwards",
        }} />
      ))}
    </div>
  );
}

function AnimatedModulBar({ target, selesai }) {
  const [width, setWidth]               = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [ringActive, setRingActive]     = useState(false);
  const rafRef    = useRef(null);
  const prevSelesai = useRef(selesai);

  useEffect(() => {
    const wasSelesai = prevSelesai.current;
    prevSelesai.current = selesai;

    setWidth(0);
    setShowComplete(false);
    setShowConfetti(false);
    setRingActive(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    let startTime = null;
    const duration = 1000;

    const timeout = setTimeout(() => {
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setWidth(Math.round(eased * target));
        if (t < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else if (selesai) {
          setTimeout(() => {
            setRingActive(true);
            setShowComplete(true);
            if (!wasSelesai) setShowConfetti(true);
          }, 100);
        }
      };
      rafRef.current = requestAnimationFrame(animate);
    }, 300);

    return () => {
      clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, selesai]);

  return (
    <div style={{ position: "relative" }}>
      <MiniConfetti active={showConfetti} />

      {/* Progress bar wrapper */}
      <div
        className={ringActive && selesai ? "ring-pulse" : ""}
        style={{
          width: "100%", height: "9px",
          backgroundColor: "#e2e8f0",
          borderRadius: "99px", overflow: "hidden",
          position: "relative",
        }}
      >
        {width > 0 && (
          <div
            className={selesai && width === 100 ? "complete-bar" : ""}
            style={{
              height: "100%",
              borderRadius: "99px",
              ...(selesai && width === 100
                ? {}
                : { backgroundColor: "#1EC99B" }
              ),
              width: `${width}%`,
              transition: "none",
            }}
          />
        )}
      </div>

      {/* Complete badge — muncul dengan glowPop + label slide */}
      {showComplete && selesai && (
        <div
          className="complete-badge"
          style={{
            position: "absolute", right: 0, top: "-26px",
            display: "flex", alignItems: "center", gap: 4,
            background: "linear-gradient(90deg, #1EC99B, #17a082)",
            color: "#fff", fontSize: "10px", fontWeight: 700,
            padding: "3px 10px", borderRadius: 99,
            letterSpacing: "0.06em", whiteSpace: "nowrap",
            boxShadow: "0 2px 12px rgba(30,201,155,0.5)",
          }}
        >
          <span className="check-icon">✓</span>
          <span className="complete-label-slide">Complete!</span>
        </div>
      )}
    </div>
  );
}

function AnimatedCounter({ target }) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    setCount(0);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    let startTime = null;
    const duration = 900;
    const timeout = setTimeout(() => {
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const t = Math.min((timestamp - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setCount(Math.round(eased * target));
        if (t < 1) rafRef.current = requestAnimationFrame(animate);
      };
      rafRef.current = requestAnimationFrame(animate);
    }, 300);
    return () => {
      clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target]);

  return <span>{count}</span>;
}

const ProfilePhone = () => {
  const { user, login } = useUser();
  const [showModal, setShowModal]       = useState(false);
  const [editName, setEditName]         = useState("");
  const [editPhone, setEditPhone]       = useState("");
  const [loading, setLoading]           = useState(false);
  const [successMsg, setSuccessMsg]     = useState("");
  const [errorMsg, setErrorMsg]         = useState("");
  const [modulSelesai, setModulSelesai] = useState([]);

  const fetchProgress = () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;
    fetch(`${API_BASE_URL}/get_modul.php?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") setModulSelesai(data.modul_selesai);
      })
      .catch((err) => console.error("Gagal fetch progress:", err));
  };

  useEffect(() => {
    fetchProgress();
    const handleFocus = () => fetchProgress();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const totalSelesai   = modulSelesai.length;
  const progressPersen = Math.round((totalSelesai / TOTAL_MODUL) * 100);

  const badges = [
    { icon: "📋", color: "#4A90D9", label: "Pembelajar Keuangan", desc: "Selesaikan 1 modul pembelajaran", diperoleh: totalSelesai >= 1 },
    { icon: "⚡", color: "#E91E63", label: "Setengah Jalan",      desc: "Selesaikan 2 modul pembelajaran", diperoleh: totalSelesai >= 2 },
    { icon: "🏆", color: "#4DC57F", label: "Master Keuangan",     desc: "Selesaikan semua modul (3/3)",    diperoleh: totalSelesai >= TOTAL_MODUL },
  ];

  const badgeDiperoleh = badges.filter((b) => b.diperoleh).length;

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
      const res = await fetch(`${API_BASE_URL}/edit_profile.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user?.id, full_name: editName, phone: editPhone }),
      });
      const data = await res.json();
      if (data.status === "success") {
        const updatedUser = { ...user, name: editName, phone: editPhone };
        login(updatedUser.email, updatedUser.name, updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setSuccessMsg("Profil berhasil diperbarui!");
        setTimeout(() => setShowModal(false), 1200);
      } else {
        setErrorMsg(data.message || "Gagal memperbarui profil");
      }
    } catch (err) {
      setErrorMsg("Gagal terhubung ke server. Pastikan XAMPP aktif.");
    } finally {
      setLoading(false);
    }
  };

  const MODUL_NAMES = { 1: "Manajemen Utang", 2: "Dasar Investasi", 3: "Dasar Penganggaran" };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F5F5F5" }}>
      <style>{CSS}</style>
      <Sidebar />
      <main className="flex-1 overflow-y-auto" style={{ padding: "20px 24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "bold", color: "#000", marginBottom: "2px" }}>Profile</h1>
        <p style={{ fontSize: "11px", color: "#888", marginBottom: "12px" }}>
          Lihat pencapaian dan riwayat pembelajaran Anda
        </p>

        {/* User Info */}
        <div style={{
          backgroundColor: "#fff", borderRadius: "14px", padding: "12px 16px",
          marginBottom: "10px", display: "flex", alignItems: "center", gap: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}>
          <div style={{
            width: "38px", height: "38px", borderRadius: "50%",
            backgroundColor: "#1EC99B", display: "flex", alignItems: "center",
            justifyContent: "center", color: "#fff", fontSize: "13px",
            fontWeight: "bold", flexShrink: 0,
          }}>
            {getInitials(user?.name)}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "13px", fontWeight: "bold", color: "#000", margin: 0 }}>{user?.name || "Pengguna"}</p>
            <p style={{ fontSize: "11px", color: "#888", margin: 0 }}>{user?.email || "-"}</p>
            <p style={{ fontSize: "10px", color: "#aaa", margin: 0 }}>Bergabung sejak Januari 2024</p>
          </div>
          <button onClick={openModal} style={{
            fontSize: "11px", padding: "5px 12px", borderRadius: "8px",
            border: "1px solid #E0E0E0", backgroundColor: "#fff", cursor: "pointer",
          }}>
            Edit Profile
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px", marginBottom: "10px" }}>
          <div style={{
            backgroundColor: "#fff", borderRadius: "14px", padding: "10px",
            textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}>
            <strong style={{ display: "block", fontSize: "16px", fontWeight: "bold", color: "#000" }}>
              <AnimatedCounter target={totalSelesai} />/{TOTAL_MODUL}
            </strong>
            <span style={{ fontSize: "10px", color: "#888" }}>Modul Selesai</span>
          </div>
          <div style={{
            backgroundColor: "#fff", borderRadius: "14px", padding: "10px",
            textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}>
            <strong style={{ display: "block", fontSize: "16px", fontWeight: "bold", color: "#000" }}>
              <AnimatedCounter target={badgeDiperoleh} />/{TOTAL_BADGE}
            </strong>
            <span style={{ fontSize: "10px", color: "#888" }}>Badge Diperoleh</span>
          </div>
        </div>

        {/* Progress Modul */}
        <div style={{
          backgroundColor: "#fff", borderRadius: "14px", padding: "12px 16px",
          marginBottom: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}>
          <p style={{ fontSize: "13px", fontWeight: "bold", color: "#000", margin: "0 0 10px 0" }}>Progress Modul</p>
          {[1, 2, 3].map((id) => {
            const selesai = modulSelesai.includes(id);
            return (
              <div
                key={id}
                className={`complete-row${selesai ? " complete-row-done" : ""}`}
                style={{
                  marginBottom: "18px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  background: selesai
                    ? "linear-gradient(90deg, #f0fff4, #e6fffa)"
                    : "#f9fafb",
                  border: selesai ? "1px solid #9ae6b4" : "1px solid #e2e8f0",
                  transition: "background 0.4s, border 0.4s",
                  animationDelay: `${id * 0.08}s`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", marginBottom: "10px",
                }}>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: selesai ? "#2d3748" : "#444" }}>
                    {MODUL_NAMES[id]}
                  </span>
                  {selesai ? (
                    <span style={{
                      fontSize: "10px", fontWeight: 700, color: "#17a082",
                      backgroundColor: "#e6fffa", padding: "2px 10px",
                      borderRadius: "99px", display: "flex", alignItems: "center",
                      gap: "3px", border: "1px solid #81e6d9",
                    }}>
                      <span className="check-icon">✓</span> Selesai
                    </span>
                  ) : (
                    <span style={{ fontSize: "11px", color: "#aaa" }}>Belum</span>
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
          <p style={{ fontSize: "11px", color: "#888", marginTop: "4px", textAlign: "right" }}>
            <AnimatedCounter target={progressPersen} />% selesai
          </p>
        </div>

        {/* Badge & Achievement */}
        <div style={{
          backgroundColor: "#fff", borderRadius: "14px", padding: "12px 16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}>
          <p style={{ fontSize: "13px", fontWeight: "bold", color: "#000", margin: "0 0 2px 0" }}>Badge & Achievement</p>
          <p style={{ fontSize: "10px", color: "#888", margin: "0 0 10px 0" }}>Kumpulkan badge dengan menyelesaikan modul</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
            {badges.map((badge, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: "8px",
                backgroundColor: badge.diperoleh ? "#F0FDF4" : "#F8F8F8",
                borderRadius: "10px", padding: "8px",
                border: badge.diperoleh ? "1px solid #BBF7D0" : "1px solid transparent",
                transition: "all 0.4s",
              }}>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "8px",
                  backgroundColor: badge.diperoleh ? badge.color : "#D0D0D0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "13px", flexShrink: 0,
                  opacity: badge.diperoleh ? 1 : 0.45,
                  transition: "background-color 0.4s, opacity 0.4s",
                }}>
                  {badge.icon}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: "11px", fontWeight: "bold", color: "#000", margin: "0 0 1px 0" }}>{badge.label}</p>
                  <p style={{ fontSize: "10px", color: "#888", margin: "0 0 2px 0" }}>{badge.desc}</p>
                  <p style={{
                    fontSize: "10px",
                    color: badge.diperoleh ? "#059669" : "#999",
                    margin: 0,
                    fontWeight: badge.diperoleh ? 600 : 400,
                  }}>
                    {badge.diperoleh ? "🏆 Diperoleh!" : "🔒 Belum diperoleh"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal Edit Profile */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: "#fff", borderRadius: "16px", padding: "24px",
            width: "360px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "bold", margin: 0 }}>Edit Profile</h2>
              <button onClick={() => setShowModal(false)} style={{
                background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#888",
              }}>✕</button>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <div style={{
                width: "60px", height: "60px", borderRadius: "50%",
                backgroundColor: "#1EC99B", display: "flex", alignItems: "center",
                justifyContent: "center", color: "#fff", fontSize: "20px", fontWeight: "bold",
              }}>
                {getInitials(editName || user?.name)}
              </div>
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "#333", display: "block", marginBottom: "4px" }}>Nama Lengkap</label>
              <input
                type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                style={{
                  width: "100%", padding: "9px 12px", borderRadius: "10px",
                  border: "1px solid #E0E0E0", fontSize: "13px", outline: "none",
                  boxSizing: "border-box", backgroundColor: "#F9F9F9",
                }}
              />
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "#333", display: "block", marginBottom: "4px" }}>Email</label>
              <input
                type="email" value={user?.email || ""} disabled
                style={{
                  width: "100%", padding: "9px 12px", borderRadius: "10px",
                  border: "1px solid #E0E0E0", fontSize: "13px", boxSizing: "border-box",
                  backgroundColor: "#F0F0F0", color: "#999", cursor: "not-allowed",
                }}
              />
              <p style={{ fontSize: "10px", color: "#aaa", margin: "3px 0 0 0" }}>Email tidak dapat diubah</p>
            </div>
            <div style={{ marginBottom: "18px" }}>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "#333", display: "block", marginBottom: "4px" }}>No. Telepon</label>
              <input
                type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)}
                placeholder="Masukkan nomor telepon"
                style={{
                  width: "100%", padding: "9px 12px", borderRadius: "10px",
                  border: "1px solid #E0E0E0", fontSize: "13px", outline: "none",
                  boxSizing: "border-box", backgroundColor: "#F9F9F9",
                }}
              />
            </div>
            {errorMsg && (
              <div style={{
                marginBottom: "12px", padding: "8px 12px", borderRadius: "8px",
                backgroundColor: "#FEF2F2", color: "#DC2626", fontSize: "12px",
                border: "1px solid #FECACA",
              }}>{errorMsg}</div>
            )}
            {successMsg && (
              <div style={{
                marginBottom: "12px", padding: "8px 12px", borderRadius: "8px",
                backgroundColor: "#F0FDF4", color: "#16A34A", fontSize: "12px",
                border: "1px solid #BBF7D0",
              }}>{successMsg}</div>
            )}
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => setShowModal(false)} style={{
                flex: 1, padding: "10px", borderRadius: "10px",
                border: "1px solid #E0E0E0", backgroundColor: "#fff",
                fontSize: "13px", fontWeight: "600", cursor: "pointer",
              }}>Batal</button>
              <button onClick={handleSave} disabled={loading} style={{
                flex: 1, padding: "10px", borderRadius: "10px", border: "none",
                backgroundColor: loading ? "#6EE7B7" : "#1EC99B",
                color: "#fff", fontSize: "13px", fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
              }}>
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePhone;
