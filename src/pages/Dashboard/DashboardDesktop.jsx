import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useUser } from "../../context/UserContext";

// ==========================

// ==========================
const DonutChart = ({ percent }) => {
  const [anim, setAnim] = useState(0);

  useEffect(() => {
    let start = null;

    const animate = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / 800, 1);
      const eased = 1 - Math.pow(1 - p, 3);

      setAnim(Math.round(eased * percent));

      if (p < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [percent]);

  const r = 40;
  const circ = 2 * Math.PI * r;
  const filled = (anim / 100) * circ;

  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} stroke="#D9D9D9" strokeWidth="12" fill="none" />
      <circle
        cx="50" cy="50" r={r}
        stroke="#34D399" strokeWidth="12" fill="none"
        strokeDasharray={`${filled} ${circ}`}
        transform="rotate(-90 50 50)"
        strokeLinecap="round"
      />
      <text x="50" y="47" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#000">{anim}%</text>
      <text x="50" y="61" textAnchor="middle" fontSize="9" fill="#555">Complete</text>
    </svg>
  );
};

// ==========================

// ==========================
const ProgressBar = ({ percent }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    let start = null;

    const animate = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / 700, 1);
      const eased = 1 - Math.pow(1 - p, 3);

      setWidth(Math.round(eased * percent));

      if (p < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [percent]);

  return (
    <div style={{ height: 6, background: "#E5E7EB", borderRadius: 99 }}>
      <div
        style={{
          width: `${width}%`,
          height: 6,
          background: "#34D399",
          borderRadius: 99,
        }}
      />
    </div>
  );
};

// ==========================

// ==========================
function getModuleProgress(modulId, totalSlides) {
  try {
    const data = JSON.parse(localStorage.getItem(`modul_${modulId}`));

    if (!data || !data.completed) return 0;

    return Math.round((data.completed.length / totalSlides) * 100);
  } catch {
    return 0;
  }
}

// ==========================

// ==========================
export default function DashboardDesktop() {
  const { user } = useUser();
  const navigate = useNavigate();
  const displayName = user?.name || "Pengguna";

  const [refresh, setRefresh] = useState(0);

  // 🔥 auto refresh kalau balik dari modul
  useEffect(() => {
    const interval = setInterval(() => {
      setRefresh((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ==========================
  
  // ==========================
  const modules = [
    {
      id: 1,
      title: "Manajemen Utang",
      desc: "Pelajari cara mengelola dan mengurangi utang secara efektif",
      emoji: "📋",
      iconBg: "#F59E0B",
      totalSlides: 3,
    },
    {
      id: 2,
      title: "Dasar Investasi",
      desc: "Pahami konsep dasar investasi untuk masa depan yang lebih baik",
      emoji: "🎯",
      iconBg: "#3B82F6",
      totalSlides: 3,
    },
    {
      id: 3,
      title: "Dasar Penganggaran",
      desc: "Buat dan kelola anggaran bulanan dengan mudah",
      emoji: "📒",
      iconBg: "#F97316",
      totalSlides: 2,
    },
  ];

  // ==========================
  
  // ==========================
  const progresses = modules.map((m) =>
    getModuleProgress(m.id, m.totalSlides)
  );

  const totalProgress =
    progresses.reduce((a, b) => a + b, 0) / modules.length;

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#FBF9F9' }}>
      <Sidebar />

      <div className="flex-1 pt-8 px-8 pb-8">

        {/* HEADER */}
        <span className="block text-[#000000] text-[32px] font-bold mb-5">
          Selamat Datang, {displayName}!
        </span>

        {/* GLOBAL PROGRESS */}
        <div className="bg-white rounded-2xl p-5 mb-6" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <span className="block text-[#000000] text-base font-semibold mb-4">Progres Belajar</span>
          <div className="flex items-center gap-6">
            <div className="shrink-0">
              <DonutChart percent={Math.round(totalProgress)} />
            </div>
            <div className="flex-1">
              <ProgressBar percent={Math.round(totalProgress)} />
              <p style={{ fontSize: 12, marginTop: 6, color: '#6B7280' }}>
                Total Progress: {Math.round(totalProgress)}%
              </p>
            </div>
          </div>
        </div>

        {/* MODULE LIST */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-[#000000] text-base font-semibold">Module</span>
          <span
            className="text-sm cursor-pointer"
            style={{ color: '#34D399' }}
            onClick={() => navigate('/learning')}>
            Lihat Semua →
          </span>
        </div>

        <div className="flex gap-4">
          {modules.map((mod) => {
            const progress = getModuleProgress(mod.id, mod.totalSlides);
            const statusLabel = progress === 100 ? "Selesai" : progress === 0 ? "Belum dimulai" : "Sedang berjalan";

            return (
              <div
                key={mod.id}
                className="flex-1 bg-white rounded-2xl p-4"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              >
                {/* Icon + Title */}
                <div className="flex items-center gap-2 mb-2">
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    backgroundColor: mod.iconBg,
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 18, flexShrink: 0,
                  }}>
                    {mod.emoji}
                  </div>
                  <span className="text-[#000000] text-sm font-semibold">{mod.title}</span>
                </div>

                {/* Desc */}
                <span className="block text-xs mb-3" style={{ color: '#6B7280' }}>{mod.desc}</span>

                {/* Status */}
                <span className="block text-xs mb-2" style={{ color: '#6B7280' }}>{statusLabel}</span>

                {/* Progress */}
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-[#000000]">Progress</span>
                  <span className="text-xs text-[#000000]">{progress}%</span>
                </div>
                <ProgressBar percent={progress} />
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}