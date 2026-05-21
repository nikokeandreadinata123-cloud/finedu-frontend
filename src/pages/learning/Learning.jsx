import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/Sidebar";
import DebtManagementModule from "./DebtManagementModule";
import InvestmentModule from "./InvestmentModule";
import BudgetingModule from "./BudgetingModule";
import "./Learning.css";
import { getApiUrl } from "../../api";

const MODUL_LIST = [
  {
    id: 1,
    title: "Manejemen Utang",
    desc: "Pelajari cara mengelola dan mengurangi utang secara efektif",
    icon: "📋",
    iconColorClass: "module-icon-wrap--amber",
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
    iconColorClass: "module-icon-wrap--blue",
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
    iconColorClass: "module-icon-wrap--orange",
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

// ─── Animated Progress Bar ───
function AnimatedProgressBar({ target, done, active }) {
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

  const fillClass = done
    ? "module-progress-fill--done"
    : active
    ? "module-progress-fill--active"
    : "module-progress-fill--idle";

  return (
    <div className="module-progress-track">
      <div
        className={`module-progress-fill ${fillClass}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

// ─── Animated Counter ───
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

// ─── Main Learning Component ───
export default function Learning() {
  const [activeModule, setActiveModule]   = useState(null);
  const [modulSelesai, setModulSelesai]   = useState([]);
  const [userId, setUserId]               = useState(null);
  const [localProgress, setLocalProgress] = useState({});

  useEffect(() => {
    const id = localStorage.getItem("user_id");
    if (id) setUserId(id);

    const progress = {};
    MODUL_LIST.forEach((m) => {
      progress[m.id] = getLocalProgress(m.id, m.totalSlides);
    });
    setLocalProgress(progress);
  }, []);

  const fetchProgress = () => {
    if (!userId) return;
    fetch(getApiUrl(`/get_modul.php?user_id=${userId}`))
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
    <div className="learning-root">
      <Sidebar />

      <main className="learning-main" style={{ minWidth: 0 }}>
        {/* ── Header ── */}
        <div className="learning-header">
          <div className="learning-header-eyebrow">Financial Literacy</div>
          <h1 className="learning-header-title">
            Learning <span>Modules</span>
          </h1>
          <p className="learning-header-sub">
            Tingkatkan literasi finansial Anda
          </p>
        </div>

        {/* ── Stats Row — hanya Total Modul ── */}
        <div className="learning-stats-row">
          <div className="learning-stat-chip">
            📚 Total Modul <b>{MODUL_LIST.length}</b>
          </div>
        </div>

        {/* ── Module Grid ── */}
        <div className="learning-grid">
          {MODUL_LIST.map((modul) => {
            const selesai  = modulSelesai.includes(modul.id);
            const progress = selesai ? 100 : (localProgress[modul.id] || 0);
            const isActive = !selesai && progress > 0;

            const pctClass = selesai
              ? "module-progress-pct--done"
              : isActive
              ? "module-progress-pct--active"
              : "module-progress-pct--idle";

            const statusClass = selesai
              ? "module-status-badge--done"
              : isActive
              ? "module-status-badge--active"
              : "module-status-badge--idle";

            return (
              <div
                key={modul.id}
                className={`module-card${selesai ? " module-card--done" : ""}`}
              >
                {/* Done badge */}
                {selesai && (
                  <div className="module-badge-done">✓ Complete</div>
                )}

                {/* Decorative corner accent */}
                <div className="module-card-corner" aria-hidden="true">
                  <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="72" cy="0" r="48"
                      fill={selesai ? "rgba(52,211,153,0.07)" : "rgba(52,211,153,0.04)"}
                    />
                    <circle cx="72" cy="0" r="26"
                      fill={selesai ? "rgba(52,211,153,0.1)" : "rgba(52,211,153,0.06)"}
                    />
                  </svg>
                </div>

                {/* Header: icon + title */}
                <div className="module-card-header" style={{ paddingRight: selesai ? 90 : 0 }}>
                  <div className={`module-icon-wrap ${selesai ? "module-icon-wrap--done" : modul.iconColorClass}`}>
                    {selesai ? "🏆" : modul.icon}
                  </div>
                  <span className="module-card-title">{modul.title}</span>
                </div>

                {/* Description */}
                <p className="module-card-desc">{modul.desc}</p>

                {/* Meta chips */}
                <div className="module-meta">
                  <span className="module-meta-chip">📖 {modul.pelajaran}</span>
                  <span className="module-meta-chip">⏱ {modul.durasi}</span>
                </div>

                {/* Progress */}
                <div className="module-progress-label">
                  <span className="module-progress-text">Progress</span>
                  <span className={`module-progress-pct ${pctClass}`}>
                    <AnimatedCounter target={progress} />%
                  </span>
                </div>
                <AnimatedProgressBar target={progress} done={selesai} active={isActive} />

                {/* Footer: status + CTA */}
                <div className="module-card-footer">
                  <span className={`module-status-badge ${statusClass}`}>
                    {selesai ? "🏆 Selesai" : isActive ? "Sedang Berjalan" : "Belum Dimulai"}
                  </span>

                  {selesai ? (
                    <div className="module-btn-locked">🔒 Terkunci</div>
                  ) : (
                    <button
                      className={`module-btn ${isActive ? "module-btn--continue" : "module-btn--start"}`}
                      onClick={() => setActiveModule(modul.component)}
                    >
                      {isActive ? "Lanjutkan →" : "Mulai →"}
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
