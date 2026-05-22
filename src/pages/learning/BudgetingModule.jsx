import React, { useState } from "react";
import { getApiUrl } from "../../api";
import "./BudgetingModule.css";

const slides = [
  {
    id: 1,
    title: "Apa itu Budgeting?",
    subtitle: "Penganggaran Dasar",
    emoji: "💰",
    tag: "Fundamental",
    type: "text",
    content: {
      intro: "Penganggaran (budgeting) adalah proses merencanakan pendapatan dan pengeluaran Anda dalam periode tertentu. Ini adalah salah satu kebiasaan keuangan paling penting yang bisa Anda miliki.",
      sectionTitle: "Manfaat membuat anggaran:",
      items: [
        "Kontrol penuh terhadap kemana uang Anda pergi setiap bulannya.",
        "Membantu mencapai tujuan keuangan jangka pendek dan jangka panjang.",
        "Mengurangi stres finansial karena Anda tahu kondisi keuangan Anda.",
        "Membiasakan diri untuk menabung secara konsisten setiap bulan.",
      ],
      closing: "Banyak orang merasa tidak perlu membuat anggaran karena merasa sudah tahu kemana uang mereka pergi. Namun kenyataannya, tanpa anggaran yang tertulis, pengeluaran impulsif sering kali tidak terkendali.",
    },
  },
  {
    id: 2,
    title: "Metode 50/30/20",
    subtitle: "Strategi Penganggaran",
    emoji: "🥧",
    tag: "Strategi",
    type: "text-method",
    content: {
      intro: "Aturan Kebutuhan: Alokasikan anggaran untuk hal-hal yang benar-benar dibutuhkan untuk kehidupan sehari-hari.",
      methods: [
        { percent: "50%", label: "Kebutuhan", color: "#10B981", colorLight: "rgba(16,185,129,0.06)", colorBorder: "rgba(16,185,129,0.2)", desc: "Kebutuhan: Belanjakan tidak lebih dari setengah penghasilan untuk kebutuhan pokok sehari-hari." },
        { percent: "30%", label: "Keinginan", color: "#3B82F6", colorLight: "rgba(59,130,246,0.06)", colorBorder: "rgba(59,130,246,0.2)", desc: "Keinginan: Sisihkan 3 dari 10 bagian penghasilan untuk menikmati hidup dan keinginan pribadi." },
        { percent: "20%", label: "Tabungan", color: "#8B5CF6", colorLight: "rgba(139,92,246,0.06)", colorBorder: "rgba(139,92,246,0.2)", desc: "Tabungan: Prioritaskan minimal 2 dari 10 bagian untuk menabung dan berinvestasi demi masa depan." },
      ],
    },
  },
  {
    id: 3,
    title: "Melacak Arus Kas",
    subtitle: "Dasar-dasar Penganggaran",
    emoji: "📊",
    tag: "Praktik",
    type: "text-video",
    youtubeId: "_gRtUlpncWY",
    youtubeTitle: "Apa itu Budget - Penjelasan Singkat dan Jelas",
    youtubeChannel: "Ruang Tanya",
    content: {
      paragraphs: [
        "Catat setiap pengeluaran, sekecil apapun, karena pengeluaran kecil yang sering dilakukan bisa membuat Anda tidak sadar telah menghabiskan banyak uang.",
        "Gunakan aplikasi keuangan atau spreadsheet sederhana untuk membantu melacak pemasukan dan pengeluaran Anda setiap hari dengan lebih mudah dan terorganisir.",
        "Evaluasi arus kas Anda setiap akhir bulan. Bandingkan dengan target anggaran yang sudah Anda buat dan cari area yang bisa diperbaiki untuk bulan berikutnya.",
      ],
      closing: "Dengan memahami arus kas Anda, Anda akan lebih mudah membuat keputusan keuangan yang bijak dan menghindari pengeluaran yang tidak perlu.",
    },
  },
];

const MODUL_ID = 3;

export default function BudgetingModule({ onBack }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [completedSlides, setCompletedSlides] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(`modul_${MODUL_ID}`));
      return saved?.completed || [];
    } catch { return []; }
  });

  const slide = slides[currentSlide];
  const isCompleted = completedSlides.includes(slide.id);
  const isFirst = currentSlide === 0;
  const isLast = currentSlide === slides.length - 1;
  const progressPercent = Math.round((completedSlides.length / slides.length) * 100);

  const handleMarkComplete = async () => {
    if (!isCompleted) {
      const updated = [...completedSlides, slide.id];
      setCompletedSlides(updated);
      localStorage.setItem(`modul_${MODUL_ID}`, JSON.stringify({ completed: updated }));
      const userId = localStorage.getItem("user_id");
      if (userId) {
        try {
          await fetch(getApiUrl("/simpan_slide.php"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, modul_id: MODUL_ID, slide_id: slide.id }),
          });
        } catch (err) { console.error("Gagal simpan slide:", err); }
        if (updated.length === slides.length) {
          try {
            await fetch(getApiUrl("/selesai_modul.php"), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ user_id: userId, modul_id: MODUL_ID }),
            });
          } catch (err) { console.error("Gagal simpan modul selesai:", err); }
        }
      }
    }
    if (!isLast) setTimeout(() => setCurrentSlide((prev) => prev + 1), 200);
  };

  const goToSlide = (idx) => setCurrentSlide(idx);

  return (
    <div className="bud-root">
      {/* Top Bar */}
      <div className="bud-topbar">
        {onBack && (
          <button onClick={onBack} className="bud-back-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Kembali
          </button>
        )}
        <span className="bud-topbar-title">Dasar Penganggaran</span>
        <div className="bud-progress-wrap">
          <div className="bud-progress-track">
            <div className="bud-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="bud-progress-label">{completedSlides.length}/{slides.length} selesai</span>
        </div>
      </div>

      {/* Body */}
      <div className="bud-body">
        <div className="bud-main">
          {/* Header Card */}
          <div className="bud-card">
            <div className="bud-slide-header">
              <div className="bud-slide-emoji">{slide.emoji}</div>
              <div className="bud-slide-meta">
                <div className="bud-slide-tags">
                  <span className="bud-num">Pelajaran {slide.id} dari {slides.length}</span>
                  <span className="bud-tag">{slide.tag}</span>
                  {isCompleted && <span className="bud-done-badge">✓ Selesai</span>}
                </div>
                <h1 className="bud-slide-title">{slide.title}</h1>
                <p className="bud-slide-subtitle">{slide.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Content Card */}
          <div className="bud-card">
            <div className="bud-content">
              {/* Type: text */}
              {slide.type === "text" && (
                <>
                  <p className="bud-para">{slide.content.intro}</p>
                  {slide.content.sectionTitle && <p className="bud-section-title">{slide.content.sectionTitle}</p>}
                  {slide.content.items?.length > 0 && (
                    <ul className="bud-list">
                      {slide.content.items.map((item, i) => (
                        <li key={i} className="bud-list-item">
                          <span className="bud-list-dot">{i + 1}</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {slide.content.closing && (
                    <div className="bud-closing"><p>{slide.content.closing}</p></div>
                  )}
                </>
              )}

              {/* Type: text-method */}
              {slide.type === "text-method" && (
                <>
                  <p className="bud-para">{slide.content.intro}</p>
                  <div className="bud-method-bars">
                    {slide.content.methods.map((m, i) => (
                      <div key={i} className="bud-method-bar" style={{ background: m.colorLight, border: `1.5px solid ${m.colorBorder}` }}>
                        <span className="bud-method-bar-pct" style={{ color: m.color }}>{m.percent}</span>
                        <span className="bud-method-bar-label">{m.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bud-method-details">
                    {slide.content.methods.map((m, i) => (
                      <div key={i} className="bud-method-detail" style={{ background: m.colorLight, border: `1.5px solid ${m.colorBorder}` }}>
                        <div className="bud-method-icon" style={{ background: m.color }}>
                          <span className="bud-method-icon-pct">{m.percent}</span>
                          <span className="bud-method-icon-label">{m.label}</span>
                        </div>
                        <p className="bud-method-desc">{m.desc}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Type: text-video */}
              {slide.type === "text-video" && (
                <>
                  {slide.content.paragraphs?.map((p, i) => (
                    <p key={i} className="bud-para">{p}</p>
                  ))}
                  {slide.content.closing && (
                    <div className="bud-closing"><p>{slide.content.closing}</p></div>
                  )}

                  {/* Video */}
                  <div className="bud-video-section">
                    <div className="bud-video-label">
                      <span className="bud-video-label-text">Video Pembelajaran</span>
                      <span className="bud-yt-badge">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                        </svg>
                        YouTube
                      </span>
                    </div>
                    <div className="bud-video-frame">
                      <iframe
                        src={`https://www.youtube.com/embed/${slide.youtubeId}?rel=0&modestbranding=1`}
                        title={slide.youtubeTitle}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                    <div className="bud-video-source">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#EF4444">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                      </svg>
                      <span>Sumber:</span>
                      <a href={`https://www.youtube.com/watch?v=${slide.youtubeId}`} target="_blank" rel="noopener noreferrer">
                        {slide.youtubeTitle} — {slide.youtubeChannel}
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Nav */}
            <div className="bud-nav">
              <button onClick={() => goToSlide(Math.max(0, currentSlide - 1))} disabled={isFirst} className="bud-btn-prev">
                ← Sebelumnya
              </button>
              <button onClick={handleMarkComplete} className={`bud-btn-complete ${isCompleted ? "done" : "active"}`}>
                {isCompleted ? "✓ Sudah Selesai" : "Tandai Selesai ✦"}
              </button>
              <button onClick={() => goToSlide(Math.min(slides.length - 1, currentSlide + 1))} disabled={isLast} className="bud-btn-next">
                Selanjutnya →
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="bud-sidebar">
          <div className="bud-sidebar-inner">
            <div className="bud-sidebar-header">
              <h2 className="bud-sidebar-title">Daftar Pelajaran</h2>
              <span className="bud-sidebar-count">{completedSlides.length}/{slides.length}</span>
            </div>
            <div className="bud-sidebar-list">
              {slides.map((s, idx) => {
                const isActive = currentSlide === idx;
                const isDone = completedSlides.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => goToSlide(idx)}
                    className={`bud-sidebar-btn ${isActive ? "active" : isDone ? "done" : ""}`}
                  >
                    <span className="bud-sidebar-emoji">{s.emoji}</span>
                    <div className="bud-sidebar-info">
                      <p className="bud-sidebar-name">{s.title}</p>
                      <p className="bud-sidebar-sub">{s.subtitle}{s.type === "text-video" ? " · 🎬" : ""}</p>
                    </div>
                    <span className={`bud-sidebar-status ${isDone ? "done-s" : isActive ? "active-s" : "idle-s"}`}>
                      {isDone ? "✓" : isActive ? "Aktif" : "—"}
                    </span>
                  </button>
                );
              })}
            </div>
            {completedSlides.length === slides.length && (
              <div className="bud-complete-banner">
                <p className="bud-complete-title">🎉 Modul Selesai!</p>
                <p className="bud-complete-sub">Semua materi telah dipelajari</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
