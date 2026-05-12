import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/Sidebar";
import DebtManagementModule from "./DebtManagementModule";
import InvestmentModule from "./InvestmentModule";
import BudgetingModule from "./BudgetingModule";

const MODUL_LIST = [
  {
    id: 1,
    title: "Manejemen Utang",
    desc: "Pelajari cara mengelola dan mengurangi utang secara efektif",
    icon: "📋",
    iconBg: "#F59E0B",
    pelajaran: "3 Pelajaran",
    durasi: "2 Jam",
    component: "debt",
    totalSlides: 3,
  },
  {
    id: 2,
    title: "Dasar Investasi",
    desc: "Pahami konsep dasar investasi untuk masa depan yang lebih baik",
    icon: "🎯",
    iconBg: "#3B82F6",
    pelajaran: "3 Pelajaran",
    durasi: "3 Jam",
    component: "investment",
    totalSlides: 3,
  },
  {
    id: 3,
    title: "Dasar Penganggaran",
    desc: "Buat dan kelola anggaran bulanan dengan mudah",
    icon: "📒",
    iconBg: "#F97316",
    pelajaran: "2 Pelajaran",
    durasi: "1.5 Jam",
    component: "budgeting",
    totalSlides: 2,
  },
];

// Helper baca localStorage dengan aman
function safeGetLocal(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

// Hitung progress tiap modul dari localStorage
function getLocalProgress(modulId, totalSlides) {
  const saved = safeGetLocal(`modul_${modulId}`);
  if (!saved || !saved.completed) return 0;
  return Math.round((saved.completed.length / totalSlides) * 100);
}

// Animated progress bar
function AnimatedProgressBar({ target }) {
  const [width, setWidth] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    setWidth(0);
    let startTime = null;
    const duration = 900;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setWidth(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };

    const timeout = setTimeout(() => {
      rafRef.current = requestAnimationFrame(animate);
    }, 100);

    return () => {
      clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target]);

  return (
    <div style={{ height: 6, background: "#eee", borderRadius: 99, overflow: "hidden" }}>
      <div style={{
        width: `${width}%`, height: "100%",
        background: width === 100 ? "#059669" : "#34D399",
        borderRadius: 99, transition: "none",
      }} />
    </div>
  );
}

// Animated counter
function AnimatedCounter({ target }) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    setCount(0);
    let startTime = null;
    const duration = 900;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };

    const timeout = setTimeout(() => {
      rafRef.current = requestAnimationFrame(animate);
    }, 100);

    return () => {
      clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target]);

  return <span>{count}</span>;
}

export default function Learning() {
  const [activeModule, setActiveModule] = useState(null);
  const [modulSelesai, setModulSelesai] = useState([]);
  const [userId, setUserId]             = useState(null);
  // Simpan progress lokal ke state agar aman
  const [localProgress, setLocalProgress] = useState({});

  
  useEffect(() => {
    const id = localStorage.getItem("user_id");
    if (id) setUserId(id);

    // Baca progress lokal semua modul sekaligus
    const progress = {};
    MODUL_LIST.forEach((m) => {
      progress[m.id] = getLocalProgress(m.id, m.totalSlides);
    });
    setLocalProgress(progress);
  }, []);

  const fetchProgress = () => {
    if (!userId) return;
    fetch(`/api/get_modul.php?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setModulSelesai(data.modul_selesai);
        }
      })
      .catch((err) => console.error("Gagal fetch:", err));
  };

  useEffect(() => {
    if (userId) fetchProgress();
  }, [userId]);

  const handleBack = () => {
    // Refresh progress lokal saat kembali dari modul
    const progress = {};
    MODUL_LIST.forEach((m) => {
      progress[m.id] = getLocalProgress(m.id, m.totalSlides);
    });
    setLocalProgress(progress);

    setActiveModule(null);
    fetchProgress();
  };

  if (activeModule === "debt")       return <DebtManagementModule onBack={handleBack} />;
  if (activeModule === "investment") return <InvestmentModule onBack={handleBack} />;
  if (activeModule === "budgeting")  return <BudgetingModule onBack={handleBack} />;

  return (
    <div className="flex min-h-screen" style={{ background: "#F5F5F5" }}>
      <Sidebar />

      <main style={{ flex: 1, padding: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#000", marginBottom: 4 }}>
          Learning Modules
        </h1>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 24 }}>
          Tingkatkan literasi finansial Anda
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {MODUL_LIST.map((modul) => {
            const selesai = modulSelesai.includes(modul.id);
            
            const progress = selesai ? 100 : (localProgress[modul.id] || 0);

            return (
              <div
                key={modul.id}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 20,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  border: selesai ? "2px solid #34D399" : "2px solid transparent",
                  opacity: selesai ? 0.88 : 1,
                  position: "relative",
                  transition: "border-color 0.4s, opacity 0.4s",
                }}
              >
                {/* Badge selesai */}
                {selesai && (
                  <div style={{
                    position: "absolute", top: 12, right: 12,
                    background: "#34D399", color: "#fff",
                    fontSize: 10, fontWeight: "bold",
                    padding: "3px 10px", borderRadius: 99,
                    boxShadow: "0 2px 6px rgba(52,211,153,0.35)",
                  }}>
                    ✓ Complete
                  </div>
                )}

                {/* Header ikon + judul */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, paddingRight: selesai ? 80 : 0 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: selesai ? "#D1FAE5" : modul.iconBg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, transition: "background 0.4s",
                  }}>
                    {selesai ? "🏆" : modul.icon}
                  </div>
                  <span style={{ fontSize: 15, fontWeight: "bold", color: "#000" }}>{modul.title}</span>
                </div>

                <p style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>{modul.desc}</p>

                <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: 11, color: "#888" }}>📖 {modul.pelajaran}</span>
                  <span style={{ fontSize: 11, color: "#888" }}>⏱ {modul.durasi}</span>
                </div>

                {/* Progress */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: "#666" }}>Progress</span>
                    <span style={{ fontSize: 11, fontWeight: "bold", color: selesai ? "#059669" : "#999" }}>
                      <AnimatedCounter target={progress} />%
                    </span>
                  </div>
                  <AnimatedProgressBar target={progress} />
                </div>

                {/* Status & tombol */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    color: selesai ? "#059669" : "#9CA3AF",
                    background: selesai ? "#D1FAE5" : "#F3F4F6",
                    padding: "3px 10px", borderRadius: 99,
                  }}>
                    {selesai ? "🏆 Selesai" : progress > 0 ? "Sedang Berjalan" : "Belum Dimulai"}
                  </span>

                  {selesai ? (
                    <div style={{
                      padding: "8px 20px", borderRadius: 99,
                      background: "#F0FDF4", color: "#6EE7B7",
                      fontSize: 12, fontWeight: "bold",
                      cursor: "not-allowed", userSelect: "none",
                      border: "1px solid #A7F3D0",
                    }}>
                      🔒 Terkunci
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveModule(modul.component)}
                      style={{
                        padding: "8px 20px", borderRadius: 99,
                        border: "none", background: "#34D399",
                        color: "#fff", fontSize: 12,
                        fontWeight: "bold", cursor: "pointer",
                        transition: "background 0.2s, transform 0.15s",
                      }}
                      onMouseEnter={(e) => { e.target.style.background = "#10B981"; e.target.style.transform = "scale(1.04)"; }}
                      onMouseLeave={(e) => { e.target.style.background = "#34D399"; e.target.style.transform = "scale(1)"; }}
                    >
                      {progress > 0 ? "Lanjutkan" : "Mulai"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}