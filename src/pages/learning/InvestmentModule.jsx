import React, { useState } from "react";
import { getApiUrl } from "../../api";
import "./InvestmentModule.css";

const slides = [
  {
    id: 1,
    title: "What is Investment?",
    subtitle: "Apa itu Investasi",
    emoji: "📈",
    tag: "Fundamental",
    type: "text",
    content: {
      intro: "Investasi adalah cara untuk mengalokasikan uang dengan tujuan mendapatkan keuntungan di masa depan. Berbeda dengan menabung, investasi memiliki potensi return yang lebih tinggi namun juga memiliki risiko yang lebih besar.",
      sectionTitle: "Prinsip dasar investasi:",
      items: [
        "Diversifikasi: Jangan menaruh semua telur dalam satu keranjang.",
        "Time in market beats timing the market: Investasi jangka panjang lebih efektif.",
        "Risk vs Return: Semakin tinggi potensi keuntungan, semakin tinggi risikonya.",
        "Pahami produk investasi sebelum berinvestasi.",
      ],
      closing: "Rasio utang yang sehat adalah ketika total utang Anda tidak melebihi 30% dari pendapatan bulanan. Ini memastikan Anda masih memiliki cukup dana untuk kebutuhan lain dan tabungan.",
    },
  },
  {
    id: 2,
    title: "Types of Investment",
    subtitle: "Jenis-jenis Investasi",
    emoji: "🏦",
    tag: "Eksplorasi",
    type: "text",
    content: {
      intro: "Terdapat berbagai jenis investasi yang dapat dipilih sesuai dengan profil risiko dan tujuan keuangan Anda. Memahami karakteristik masing-masing jenis investasi adalah kunci untuk membuat keputusan yang tepat.",
      sectionTitle: "Jenis investasi yang umum:",
      items: [
        "Saham: Kepemilikan sebagian perusahaan dengan potensi keuntungan tinggi namun risiko lebih besar.",
        "Reksa Dana: Kumpulan dana dari banyak investor yang dikelola oleh manajer investasi profesional.",
        "Obligasi: Surat utang yang memberikan imbal hasil tetap dengan risiko lebih rendah dari saham.",
        "Properti: Investasi aset fisik yang nilainya cenderung meningkat dalam jangka panjang.",
        "Emas: Instrumen lindung nilai yang stabil dan likuid untuk melindungi kekayaan dari inflasi.",
      ],
      closing: "Pilihlah jenis investasi yang sesuai dengan tujuan keuangan, jangka waktu, dan toleransi risiko Anda. Tidak ada investasi yang sempurna untuk semua orang — yang terpenting adalah konsistensi dan pemahaman mendalam terhadap instrumen yang dipilih.",
    },
  },
  {
    id: 3,
    title: "Investment Strategy",
    subtitle: "Strategi Investasi",
    emoji: "🎯",
    tag: "Strategi",
    type: "text-video",
    youtubeId: "xDiRHt9vlqI",
    youtubeTitle: "Penjelasan Semua Jenis Investasi Keuangan dalam 4 Menit",
    youtubeChannel: "Edutektif",
    content: {
      intro: "Memiliki strategi investasi yang jelas adalah kunci keberhasilan dalam berinvestasi. Strategi yang baik mempertimbangkan tujuan keuangan, jangka waktu, dan kemampuan menanggung risiko secara bersamaan.",
      sectionTitle: "Langkah membangun strategi investasi:",
      items: [
        "Tentukan tujuan keuangan: jangka pendek, menengah, atau panjang.",
        "Kenali profil risiko Anda — konservatif, moderat, atau agresif.",
        "Alokasikan aset secara proporsional sesuai profil risiko dan tujuan.",
        "Lakukan investasi rutin (dollar-cost averaging) agar tidak terpengaruh volatilitas pasar.",
        "Evaluasi dan rebalancing portofolio secara berkala minimal setahun sekali.",
      ],
      closing: "Ingat, investasi terbaik adalah yang konsisten dan sesuai dengan kondisi keuangan Anda. Mulai dari jumlah kecil, tingkatkan secara bertahap, dan jangan pernah berinvestasi dengan dana darurat.",
    },
  },
];

const MODUL_ID = 2;

export default function InvestmentModule({ onBack }) {
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
    <div className="inv-root">
      {/* Top Bar */}
      <div className="inv-topbar">
        {onBack && (
          <button onClick={onBack} className="inv-back-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Kembali
          </button>
        )}
        <span className="inv-topbar-title">Dasar Investasi</span>
        <div className="inv-progress-wrap">
          <div className="inv-progress-track">
            <div className="inv-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="inv-progress-label">{completedSlides.length}/{slides.length} selesai</span>
        </div>
      </div>

      {/* Body */}
      <div className="inv-body">
        <div className="inv-main">
          {/* Header Card */}
          <div className="inv-card">
            <div className="inv-slide-header">
              <div className="inv-slide-emoji">{slide.emoji}</div>
              <div className="inv-slide-meta">
                <div className="inv-slide-tags">
                  <span className="inv-num">Pelajaran {slide.id} dari {slides.length}</span>
                  <span className="inv-tag">{slide.tag}</span>
                  {isCompleted && <span className="inv-done-badge">✓ Selesai</span>}
                </div>
                <h1 className="inv-slide-title">{slide.title}</h1>
                <p className="inv-slide-subtitle">{slide.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Content Card */}
          <div className="inv-card">
            <div className="inv-content">
              <p className="inv-para">{slide.content.intro}</p>
              {slide.content.sectionTitle && (
                <p className="inv-section-title">{slide.content.sectionTitle}</p>
              )}
              {slide.content.items?.length > 0 && (
                <ul className="inv-list">
                  {slide.content.items.map((item, i) => (
                    <li key={i} className="inv-list-item">
                      <span className="inv-list-icon">{i + 1}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="inv-para">{slide.content.closing}</p>

              {/* Video Section for slide 3 */}
              {slide.type === "text-video" && (
                <div className="inv-video-section">
                  <div className="inv-video-label">
                    <span className="inv-video-label-text">Video Pembelajaran</span>
                    <span className="inv-yt-badge">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                      </svg>
                      YouTube
                    </span>
                  </div>
                  <div className="inv-video-frame">
                    <iframe
                      src={`https://www.youtube.com/embed/${slide.youtubeId}?rel=0&modestbranding=1`}
                      title={slide.youtubeTitle}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <div className="inv-video-source">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#EF4444">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                    </svg>
                    <span>Sumber:</span>
                    <a href={`https://www.youtube.com/watch?v=${slide.youtubeId}`} target="_blank" rel="noopener noreferrer">
                      {slide.youtubeTitle} — {slide.youtubeChannel}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Nav */}
            <div className="inv-nav">
              <button onClick={() => goToSlide(Math.max(0, currentSlide - 1))} disabled={isFirst} className="inv-btn-prev">
                ← Sebelumnya
              </button>
              <button onClick={handleMarkComplete} className={`inv-btn-complete ${isCompleted ? "done" : "active"}`}>
                {isCompleted ? "✓ Sudah Selesai" : "Tandai Selesai ✦"}
              </button>
              <button onClick={() => goToSlide(Math.min(slides.length - 1, currentSlide + 1))} disabled={isLast} className="inv-btn-next">
                Selanjutnya →
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="inv-sidebar">
          <div className="inv-sidebar-inner">
            <div className="inv-sidebar-header">
              <h2 className="inv-sidebar-title">Daftar Pelajaran</h2>
              <span className="inv-sidebar-count">{completedSlides.length}/{slides.length}</span>
            </div>
            <div className="inv-sidebar-list">
              {slides.map((s, idx) => {
                const isActive = currentSlide === idx;
                const isDone = completedSlides.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => goToSlide(idx)}
                    className={`inv-sidebar-btn ${isActive ? "active" : isDone ? "done" : ""}`}
                  >
                    <span className="inv-sidebar-emoji">{s.emoji}</span>
                    <div className="inv-sidebar-info">
                      <p className="inv-sidebar-name">{s.title}</p>
                      <p className="inv-sidebar-sub">{s.subtitle}{s.type === "text-video" ? " · 🎬" : ""}</p>
                    </div>
                    <span className={`inv-sidebar-status ${isDone ? "done-s" : isActive ? "active-s" : "idle-s"}`}>
                      {isDone ? "✓" : isActive ? "Aktif" : "—"}
                    </span>
                  </button>
                );
              })}
            </div>
            {completedSlides.length === slides.length && (
              <div className="inv-complete-banner">
                <p className="inv-complete-title">🎉 Modul Selesai!</p>
                <p className="inv-complete-sub">Semua materi telah dipelajari</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
