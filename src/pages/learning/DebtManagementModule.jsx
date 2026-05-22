import { useState } from "react";
import { getApiUrl } from "../../api";
import "./DebtManagementModule.css";

const slides = [
  {
    id: 1,
    title: "Understanding Debt",
    emoji: "💸",
    tag: "Fundamental",
    type: "text",
    content: {
      paragraphs: [
        "Utang adalah kewajiban finansial yang harus dibayar kembali kepada pihak pemberi pinjaman, biasanya dengan tambahan bunga dalam jangka waktu yang telah disepakati. Memahami utang adalah langkah pertama yang penting dalam mengelola keuangan pribadi Anda secara efektif.",
        "Ada dua jenis utang utama: utang produktif dan utang konsumtif. Utang produktif adalah pinjaman yang digunakan untuk menghasilkan aset atau pendapatan, seperti KPR atau pinjaman usaha. Sedangkan utang konsumtif digunakan untuk memenuhi kebutuhan sehari-hari atau gaya hidup, seperti kartu kredit untuk belanja.",
        "Memahami perbedaan antara kedua jenis utang ini sangat penting agar Anda dapat membuat keputusan keuangan yang lebih bijak. Utang yang tidak dikelola dengan baik dapat mengganggu stabilitas keuangan dan berdampak pada kualitas hidup Anda.",
      ],
    },
  },
  {
    id: 2,
    title: "Creating a Debt Payment Plan",
    emoji: "📋",
    tag: "Strategi",
    type: "text",
    content: {
      paragraphs: [
        "Membuat rencana pembayaran utang yang efektif adalah langkah krusial untuk keluar dari lingkaran utang. Langkah pertama adalah mencatat seluruh utang yang dimiliki, termasuk jumlah pokok, suku bunga, dan jatuh tempo masing-masing.",
        "Pilih strategi pembayaran yang sesuai dengan kondisi keuangan Anda. Metode avalanche mengutamakan pelunasan utang dengan bunga tertinggi terlebih dahulu sehingga menghemat total bunga yang dibayar. Sementara metode snowball berfokus pada melunasi utang terkecil lebih dulu untuk membangun motivasi.",
        "Sisihkan anggaran khusus setiap bulan untuk membayar utang dan pastikan jumlahnya melebihi pembayaran minimum. Tinjau kembali rencana ini secara berkala dan sesuaikan jika ada perubahan pendapatan atau pengeluaran agar target pelunasan tetap tercapai.",
      ],
    },
  },
  {
    id: 3,
    title: "Negotiating With Creditors",
    emoji: "🤝",
    tag: "Tips & Trik",
    type: "text-list-video",
    youtubeId: "Ri0arQOegsc",
    youtubeTitle: "Debt Management | Loans and Debt | Financial Literacy | Khan Academy",
    youtubeChannel: "Khan Academy",
    content: {
      intro:
        "Bernegosiasi dengan kreditur adalah keterampilan penting yang dapat membantu Anda mendapatkan syarat pembayaran yang lebih baik. Berikut adalah langkah-langkah yang dapat Anda lakukan:",
      items: [
        "Hubungi kreditur sesegera mungkin sebelum utang jatuh tempo atau menjadi menunggak.",
        "Siapkan dokumen keuangan Anda termasuk bukti pendapatan dan pengeluaran bulanan.",
        "Ajukan permintaan penurunan suku bunga atau perpanjangan jangka waktu pembayaran.",
        "Pertimbangkan untuk meminta program restrukturisasi utang jika beban cicilan terlalu berat.",
        "Dokumentasikan semua komunikasi dan perjanjian secara tertulis untuk perlindungan hukum.",
        "Pertimbangkan bantuan dari konsultan keuangan jika negosiasi mandiri terasa sulit.",
      ],
      closing:
        "Ingat, kreditur umumnya lebih memilih untuk bernegosiasi daripada menghadapi kemacetan pembayaran. Jangan ragu untuk mengambil inisiatif dan berkomunikasi secara terbuka.",
    },
  },
];

const MODUL_ID = 1;

export default function DebtManagementModule({ onBack }) {
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
    <div className="dm-root">
      {/* Top Bar */}
      <div className="dm-topbar">
        {onBack && (
          <button onClick={onBack} className="dm-back-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Kembali
          </button>
        )}
        <span className="dm-topbar-title">Manajemen Utang</span>
        <div className="dm-progress-wrap">
          <div className="dm-progress-track">
            <div className="dm-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="dm-progress-label">{completedSlides.length}/{slides.length} selesai</span>
        </div>
      </div>

      {/* Body */}
      <div className="dm-body">
        <div className="dm-main">
          {/* Slide Header Card */}
          <div className="dm-card">
            <div className="dm-slide-header">
              <div className="dm-slide-emoji">{slide.emoji}</div>
              <div className="dm-slide-meta">
                <div className="dm-slide-tags">
                  <span className="dm-num">Pelajaran {slide.id} dari {slides.length}</span>
                  <span className="dm-tag">{slide.tag}</span>
                  {isCompleted && <span className="dm-done-badge">✓ Selesai</span>}
                </div>
                <h1 className="dm-slide-title">{slide.title}</h1>
              </div>
            </div>
          </div>

          {/* Content Card */}
          <div className="dm-card">
            <div className="dm-content">
              {slide.type === "text" && slide.content.paragraphs?.map((p, i) => (
                <p key={i} className="dm-para">{p}</p>
              ))}

              {slide.type === "text-list-video" && (
                <>
                  <p className="dm-intro-text">{slide.content.intro}</p>
                  <ul className="dm-list">
                    {slide.content.items.map((item, i) => (
                      <li key={i} className="dm-list-item">
                        <span className="dm-list-dot">{i + 1}</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="dm-closing-box">
                    <p className="dm-closing-text">💡 {slide.content.closing}</p>
                  </div>

                  {/* Video Section */}
                  <div className="dm-video-section">
                    <div className="dm-video-label">
                      <span className="dm-video-label-text">Video Pembelajaran</span>
                      <span className="dm-yt-badge">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                        </svg>
                        YouTube
                      </span>
                    </div>
                    <div className="dm-video-frame">
                      <iframe
                        src={`https://www.youtube.com/embed/${slide.youtubeId}?rel=0&modestbranding=1`}
                        title={slide.youtubeTitle}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                    <div className="dm-video-source">
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

            {/* Nav Buttons */}
            <div className="dm-nav">
              <button onClick={() => setCurrentSlide((p) => Math.max(0, p - 1))} disabled={isFirst} className="dm-btn-prev">
                ← Sebelumnya
              </button>
              <button onClick={handleMarkComplete} className={`dm-btn-complete ${isCompleted ? "done" : "active"}`}>
                {isCompleted ? "✓ Sudah Selesai" : "Tandai Selesai ✦"}
              </button>
              <button onClick={() => setCurrentSlide((p) => Math.min(slides.length - 1, p + 1))} disabled={isLast} className="dm-btn-next">
                Selanjutnya →
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="dm-sidebar">
          <div className="dm-sidebar-inner">
            <div className="dm-sidebar-header">
              <h2 className="dm-sidebar-title">Daftar Pelajaran</h2>
              <span className="dm-sidebar-count">{completedSlides.length}/{slides.length}</span>
            </div>
            <div className="dm-sidebar-list">
              {slides.map((s, idx) => {
                const isActive = currentSlide === idx;
                const isDone = completedSlides.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => goToSlide(idx)}
                    className={`dm-sidebar-btn ${isActive ? "active" : isDone ? "done" : ""}`}
                  >
                    <span className="dm-sidebar-emoji">{s.emoji}</span>
                    <div className="dm-sidebar-info">
                      <p className="dm-sidebar-name">{s.title}</p>
                      <p className="dm-sidebar-sub">📄 Materi{s.type === "text-list-video" ? " + 🎬 Video" : ""}</p>
                    </div>
                    <span className={`dm-sidebar-status ${isDone ? "done-s" : isActive ? "active-s" : "idle-s"}`}>
                      {isDone ? "✓" : isActive ? "Aktif" : "—"}
                    </span>
                  </button>
                );
              })}
            </div>
            {completedSlides.length === slides.length && (
              <div className="dm-complete-banner">
                <p className="dm-complete-title">🎉 Modul Selesai!</p>
                <p className="dm-complete-sub">Semua materi telah dipelajari</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
