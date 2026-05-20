import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useUser } from "../../context/UserContext";
import styles from "./Dashboard.module.css";

/* ─────────────────────────────────────────────────
   DONUT CHART — logika tidak diubah, hanya styling
───────────────────────────────────────────────── */
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

  const r = 36;
  const circ = 2 * Math.PI * r;
  const filled = (anim / 100) * circ;

  return (
    <svg width="90" height="90" viewBox="0 0 90 90" style={{ flexShrink: 0 }}>
      <circle cx="45" cy="45" r={r} stroke="#f0f0f0" strokeWidth="10" fill="none" />
      <circle
        cx="45" cy="45" r={r}
        stroke="url(#donutGrad)" strokeWidth="10" fill="none"
        strokeDasharray={`${filled} ${circ}`}
        transform="rotate(-90 45 45)"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#34D399" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <text x="45" y="42" textAnchor="middle" fontSize="13" fontWeight="800" fill="#0a0a0f">{anim}%</text>
      <text x="45" y="55" textAnchor="middle" fontSize="8"  fill="#6b7280">Complete</text>
    </svg>
  );
};

/* ─────────────────────────────────────────────────
   PROGRESS BAR — logika tidak diubah
───────────────────────────────────────────────── */
const ProgressBar = ({ percent, color }) => {
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
    <div className={styles.pbTrack}>
      <div
        className={styles.pbFill}
        style={{ width: `${width}%`, background: color || undefined }}
      />
    </div>
  );
};

/* ─────────────────────────────────────────────────
   GET MODULE PROGRESS — tidak diubah sama sekali
───────────────────────────────────────────────── */
function getModuleProgress(modulId, totalSlides) {
  try {
    const data = JSON.parse(localStorage.getItem(`modul_${modulId}`));
    if (!data || !data.completed) return 0;
    return Math.round((data.completed.length / totalSlides) * 100);
  } catch {
    return 0;
  }
}

/* ─────────────────────────────────────────────────
   QUOTES untuk motivasi Gen Z
───────────────────────────────────────────────── */
const quotes = [
  "Investasi terbaik adalah investasi pada dirimu sendiri. 🚀",
  "Mulai dari Rp1.000 pun, yang penting mulai! 💪",
  "Literasi keuangan = kebebasan finansial. ✨",
  "Konsisten > Sempurna. Keep going! 🔥",
  "Uangmu, hidupmu, pilihanmu. 💡",
];

/* ─────────────────────────────────────────────────
   BADGES
───────────────────────────────────────────────── */
const allBadges = [
  { emoji: "🏅", label: "First Step",    earned: true  },
  { emoji: "🔥", label: "3-Day Streak",  earned: true  },
  { emoji: "📚", label: "Modul Selesai", earned: false },
  { emoji: "🎯", label: "Quiz Master",   earned: false },
  { emoji: "💎", label: "Top Learner",   earned: false },
];

/* ─────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────── */
export default function DashboardDesktop() {
  const { user } = useUser();
  const navigate  = useNavigate();
  const displayName = user?.name || "Pengguna";

  const [refresh, setRefresh] = useState(0);

  /* ── Auto refresh — logika tidak diubah ── */
  useEffect(() => {
    const interval = setInterval(() => {
      setRefresh((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  /* ── Modules data — tidak diubah ── */
  const modules = [
    {
      id: 1,
      title: "Manajemen Utang",
      desc: "Pelajari cara mengelola dan mengurangi utang secara efektif",
      emoji: "📋",
      iconBg: "#FFF7ED",
      iconColor: "#F59E0B",
      totalSlides: 3,
    },
    {
      id: 2,
      title: "Dasar Investasi",
      desc: "Pahami konsep dasar investasi untuk masa depan yang lebih baik",
      emoji: "🎯",
      iconBg: "#EFF6FF",
      iconColor: "#3B82F6",
      totalSlides: 3,
    },
    {
      id: 3,
      title: "Dasar Penganggaran",
      desc: "Buat dan kelola anggaran bulanan dengan mudah",
      emoji: "📒",
      iconBg: "#FFF7ED",
      iconColor: "#F97316",
      totalSlides: 2,
    },
  ];

  const progresses    = modules.map((m) => getModuleProgress(m.id, m.totalSlides));
  const totalProgress = progresses.reduce((a, b) => a + b, 0) / modules.length;

  const todayQuote = quotes[new Date().getDay() % quotes.length];

  /* streak hari (simulasi — bisa dihubungkan ke backend nanti) */
  const streakDays = 3;
  const weekDays   = ["S","M","T","W","T"];

  return (
    <div className={styles.root}>
      <Sidebar />

      <main className={styles.main}>

        {/* ── GREETING ── */}
        <div className={styles.header}>
          <h1 className={styles.greeting}>
            Halo, <span>{displayName}</span>! 👋
          </h1>
          <p className={styles.subGreeting}>
            Lanjutkan perjalanan literasi keuangan kamu hari ini
          </p>
        </div>

        {/* ── STAT CARDS ── */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={`${styles.statIconBox} ${styles.blue}`}>📈</div>
            <div>
              <div className={styles.statNum}>{Math.round(totalProgress)}%</div>
              <div className={styles.statLabel}>Progress</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIconBox} ${styles.green}`}>✅</div>
            <div>
              <div className={styles.statNum}>
                {progresses.filter(p => p === 100).length}/{modules.length}
              </div>
              <div className={styles.statLabel}>Selesai</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIconBox} ${styles.orange}`}>🔥</div>
            <div>
              <div className={styles.statNum}>{streakDays}</div>
              <div className={styles.statLabel}>Streak</div>
            </div>
          </div>
        </div>

        {/* ── 2-COL: PROGRESS + STREAK ── */}
        <div className={styles.gridTwo}>

          {/* Progress Card */}
          <div className={styles.progressCard}>
            <div className={styles.cardTitle}>
              <span>📊</span> Progres Belajar
            </div>
            <div className={styles.donutWrap}>
              <DonutChart percent={Math.round(totalProgress)} />
              <div className={styles.progressBars}>
                {modules.map((mod, i) => (
                  <div className={styles.pbRow} key={mod.id}>
                    <div className={styles.pbLabel}>
                      <span>{mod.emoji} {mod.title}</span>
                      <span>{progresses[i]}%</span>
                    </div>
                    <ProgressBar percent={progresses[i]} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Streak + Quote Card */}
          <div className={styles.streakCard}>
            <div className={styles.streakTop}>
              <div className={styles.streakLabel}>🔥 Daily Streak</div>
              <div className={styles.streakNum}>{streakDays}</div>
              <div className={styles.streakSub}>Hari berturut-turut belajar</div>
              <div className={styles.streakDots}>
                {weekDays.map((d, i) => (
                  <div
                    key={i}
                    className={`${styles.streakDot} ${i < streakDays ? styles.done : ''}`}
                    title={d}
                  >
                    {i < streakDays ? '✓' : d}
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.quoteBox}>
              "{todayQuote}"
            </div>
          </div>
        </div>

        {/* ── MODULES ── */}
        <div>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>📚 Module Kamu</span>
            <button className={styles.seeAll} onClick={() => navigate('/learning')}>
              Lihat Semua →
            </button>
          </div>

          <div className={styles.moduleGrid}>
            {modules.map((mod, i) => {
              const progress    = progresses[i];
              const isDone      = progress === 100;
              const isOngoing   = progress > 0 && progress < 100;
              const statusClass = isDone ? styles.statusDone : isOngoing ? styles.statusOngoing : styles.statusNew;
              const statusText  = isDone ? "✓ Selesai" : isOngoing ? "⏳ Berlangsung" : "✨ Baru";

              /* gradient warna per modul */
              const gradients = [
                "linear-gradient(135deg, #f59e0b, #f97316)",
                "linear-gradient(135deg, #3b82f6, #6366f1)",
                "linear-gradient(135deg, #f97316, #ef4444)",
              ];

              return (
                <div
                  key={mod.id}
                  className={styles.moduleCard}
                  onClick={() => navigate('/learning')}
                >
                  <div
                    className={styles.moduleIconWrap}
                    style={{ background: mod.iconBg }}
                  >
                    {mod.emoji}
                  </div>
                  <div className={styles.moduleCardTitle}>{mod.title}</div>
                  <div className={styles.moduleCardDesc}>{mod.desc}</div>
                  <div className={`${styles.moduleStatus} ${statusClass}`}>
                    {statusText}
                  </div>
                  <div className={styles.modulePbRow}>
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className={styles.modulePbTrack}>
                    <div
                      className={styles.modulePbFill}
                      style={{
                        width: `${progress}%`,
                        background: gradients[i],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── BADGES ── */}
        <div className={styles.badgeSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>🏆 Badges Kamu</span>
          </div>
          <div className={styles.badgeGrid}>
            {allBadges.map((b, i) => (
              <div
                key={i}
                className={`${styles.badgeChip} ${b.earned ? styles.earned : styles.locked}`}
              >
                <span className={styles.badgeEmoji}>{b.emoji}</span>
                {b.label}
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
