import React, { useState } from "react";

const slides = [
  {
    id: 1,
    title: "What is Investment?",
    subtitle: "Apa itu Investasi",
    type: "text",
    content: {
      intro:
        "Investasi adalah cara untuk mengalokasikan uang dengan tujuan mendapatkan keuntungan di masa depan. Berbeda dengan menabung, investasi memiliki potensi return yang lebih tinggi namun juga memiliki risiko yang lebih besar.",
      sectionTitle: "Prinsip dasar investasi:",
      items: [
        "Diversifikasi: Jangan menaruh semua telur dalam satu keranjang.",
        "Time in market beats timing the market: Investasi jangka panjang lebih efektif.",
        "Risk vs Return: Semakin tinggi potensi keuntungan, semakin tinggi risikonya.",
        "Pahami produk investasi sebelum berinvestasi.",
      ],
      closing:
        "Rasio utang yang sehat adalah ketika total utang Anda tidak melebihi 30% dari pendapatan bulanan. Ini memastikan Anda masih memiliki cukup dana untuk kebutuhan lain dan tabungan.",
    },
  },
  {
    id: 2,
    title: "Types of Investment",
    subtitle: "Jenis-jenis Investasi",
    type: "text",
    content: {
      intro:
        "Terdapat berbagai jenis investasi yang dapat dipilih sesuai dengan profil risiko dan tujuan keuangan Anda. Memahami karakteristik masing-masing jenis investasi adalah kunci untuk membuat keputusan yang tepat.",
      sectionTitle: "Jenis investasi yang umum:",
      items: [
        "Saham: Kepemilikan sebagian perusahaan dengan potensi keuntungan tinggi namun risiko lebih besar.",
        "Reksa Dana: Kumpulan dana dari banyak investor yang dikelola oleh manajer investasi profesional.",
        "Obligasi: Surat utang yang memberikan imbal hasil tetap dengan risiko lebih rendah dari saham.",
        "Properti: Investasi aset fisik yang nilainya cenderung meningkat dalam jangka panjang.",
        "Emas: Instrumen lindung nilai yang stabil dan likuid untuk melindungi kekayaan dari inflasi.",
      ],
      closing:
        "Pilihlah jenis investasi yang sesuai dengan tujuan keuangan, jangka waktu, dan toleransi risiko Anda. Tidak ada investasi yang sempurna untuk semua orang — yang terpenting adalah konsistensi dan pemahaman mendalam terhadap instrumen yang dipilih.",
    },
  },
  {
    id: 3,
    title: "Investment Strategy",
    subtitle: "Strategi Investasi",
    type: "text",
    content: {
      intro:
        "Memiliki strategi investasi yang jelas adalah kunci keberhasilan dalam berinvestasi. Strategi yang baik mempertimbangkan tujuan keuangan, jangka waktu, dan kemampuan menanggung risiko secara bersamaan.",
      sectionTitle: "Langkah membangun strategi investasi:",
      items: [
        "Tentukan tujuan keuangan: jangka pendek, menengah, atau panjang.",
        "Kenali profil risiko Anda — konservatif, moderat, atau agresif.",
        "Alokasikan aset secara proporsional sesuai profil risiko dan tujuan.",
        "Lakukan investasi rutin (dollar-cost averaging) agar tidak terpengaruh volatilitas pasar.",
        "Evaluasi dan rebalancing portofolio secara berkala minimal setahun sekali.",
      ],
      closing:
        "Ingat, investasi terbaik adalah yang konsisten dan sesuai dengan kondisi keuangan Anda. Mulai dari jumlah kecil, tingkatkan secara bertahap, dan jangan pernah berinvestasi dengan dana darurat.",
    },
  },
];

const ACCENT = "#34D399";
const ACCENT_DARK = "#059669";
const ACCENT_LIGHT = "#D1FAE5";

export default function InvestmentModule({ onBack }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [completedSlides, setCompletedSlides] = useState([]);

  const slide = slides[currentSlide];
  const isCompleted = completedSlides.includes(slide.id);
  const isFirst = currentSlide === 0;
  const isLast = currentSlide === slides.length - 1;
  const progressPercent = Math.round((completedSlides.length / slides.length) * 100);

  const handleMarkComplete = () => {
    if (!isCompleted) {
      setCompletedSlides((prev) => [...prev, slide.id]);
    }
    if (!isLast) {
      setTimeout(() => setCurrentSlide((prev) => prev + 1), 200);
    }
  };

  const goToSlide = (idx) => setCurrentSlide(idx);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FBF9F9",
        fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
        color: "#1A1A2E",
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #E8ECF0",
          padding: "0 2rem",
          display: "flex",
          alignItems: "center",
          gap: 16,
          height: 60,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {onBack && (
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#6B7280",
              fontSize: 14,
              padding: "4px 8px",
              borderRadius: 6,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Kembali
          </button>
        )}
        <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A2E" }}>
          Dasar Investasi
        </span>

        {/* Progress */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, maxWidth: 400, margin: "0 auto" }}>
          <div style={{ flex: 1, height: 6, background: "#E8ECF0", borderRadius: 99, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${progressPercent}%`,
                background: ACCENT,
                borderRadius: 99,
                transition: "width 0.4s ease",
              }}
            />
          </div>
          <span style={{ fontSize: 12, color: "#6B7280", whiteSpace: "nowrap" }}>
            {completedSlides.length}/{slides.length} selesai
          </span>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          display: "flex",
          maxWidth: 1100,
          margin: "0 auto",
          padding: "2rem 1.5rem",
          gap: "1.5rem",
        }}
      >
        {/* Main Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Slide Header */}
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "1.25rem 1.75rem",
              marginBottom: "1rem",
              border: "1px solid #E8ECF0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>
                Pelajaran {slide.id} dari {slides.length}
              </span>
              {isCompleted && (
                <span style={{ background: ACCENT_LIGHT, color: ACCENT_DARK, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99 }}>
                  ✓ Selesai
                </span>
              )}
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "#1A1A2E" }}>
              {slide.title}
            </h1>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: "4px 0 0" }}>{slide.subtitle}</p>
          </div>

          {/* Slide Content */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E8ECF0", overflow: "hidden" }}>
            <div style={{ padding: "1.75rem" }}>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: "#374151", marginBottom: "1.25rem" }}>
                {slide.content.intro}
              </p>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E", marginBottom: "0.75rem" }}>
                {slide.content.sectionTitle}
              </p>
              <ul style={{ paddingLeft: "1.25rem", marginBottom: "1.25rem" }}>
                {slide.content.items.map((item, i) => (
                  <li key={i} style={{ fontSize: 14, lineHeight: 1.8, color: "#374151", marginBottom: 6 }}>
                    {item}
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: "#374151" }}>
                {slide.content.closing}
              </p>
            </div>

            {/* Nav Buttons */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 1.75rem",
                borderTop: "1px solid #E8ECF0",
                background: "#FAFBFC",
              }}
            >
              <button
                onClick={() => goToSlide(Math.max(0, currentSlide - 1))}
                disabled={isFirst}
                style={{
                  padding: "8px 18px",
                  borderRadius: 20,
                  border: "1px solid #D1D5DB",
                  background: isFirst ? "#F3F4F6" : "#fff",
                  color: isFirst ? "#9CA3AF" : "#374151",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: isFirst ? "not-allowed" : "pointer",
                }}
              >
                &lt; Sebelumnya
              </button>

              <button
                onClick={handleMarkComplete}
                style={{
                  padding: "8px 24px",
                  borderRadius: 20,
                  border: "none",
                  background: isCompleted ? "#E8ECF0" : ACCENT,
                  color: isCompleted ? "#6B7280" : "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
              >
                {isCompleted ? "✓ Sudah Selesai" : "Tandai Selesai"}
              </button>

              <button
                onClick={() => goToSlide(Math.min(slides.length - 1, currentSlide + 1))}
                disabled={isLast}
                style={{
                  padding: "8px 18px",
                  borderRadius: 20,
                  border: "1px solid #D1D5DB",
                  background: isLast ? "#F3F4F6" : "#fff",
                  color: isLast ? "#9CA3AF" : "#374151",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: isLast ? "not-allowed" : "pointer",
                }}
              >
                Selanjutnya &gt;
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ width: 260, flexShrink: 0 }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #E8ECF0",
              overflow: "hidden",
              position: "sticky",
              top: 76,
            }}
          >
            <div
              style={{
                padding: "1rem 1.25rem",
                borderBottom: "1px solid #E8ECF0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E", margin: 0 }}>
                Daftar Pelajaran
              </h2>
              <span style={{ background: ACCENT_LIGHT, color: ACCENT_DARK, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99 }}>
                {completedSlides.length}/{slides.length}
              </span>
            </div>

            <div style={{ padding: "0.5rem" }}>
              {slides.map((s, idx) => {
                const isActive = currentSlide === idx;
                const isDone = completedSlides.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => goToSlide(idx)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: "none",
                      background: isActive ? ACCENT_LIGHT : isDone ? "#F9FAFB" : "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      marginBottom: 4,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? ACCENT_DARK : isDone ? "#374151" : "#6B7280",
                          margin: 0,
                          lineHeight: 1.3,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {s.title}
                      </p>
                      <p style={{ fontSize: 11, color: "#9CA3AF", margin: "3px 0 0" }}>
                        {s.subtitle}
                      </p>
                    </div>
                    <span
                      style={{
                        marginLeft: 8,
                        padding: "3px 10px",
                        borderRadius: 99,
                        fontSize: 11,
                        fontWeight: 600,
                        background: isDone ? ACCENT : isActive ? ACCENT : "#E8ECF0",
                        color: isDone || isActive ? "#fff" : "#9CA3AF",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {isDone ? "Selesai" : isActive ? "Aktif" : "Materi"}
                    </span>
                  </button>
                );
              })}
            </div>

            {completedSlides.length === slides.length && (
              <div style={{ margin: "0.5rem", padding: "12px", background: ACCENT, borderRadius: 8, textAlign: "center" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>🎉 Modul Selesai!</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", margin: "4px 0 0" }}>
                  Anda telah menyelesaikan semua materi
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
