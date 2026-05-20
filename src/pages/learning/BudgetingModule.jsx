import React, { useState } from "react";
import { getApiUrl } from "../../api";

const slides = [
  {
    id: 1,
    title: "Apa itu Budgeting?",
    subtitle: "Penganggaran Dasar",
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
    type: "text-method",
    content: {
      intro: "Aturan Kebutuhan: Alokasikan anggaran untuk hal-hal yang benar-benar dibutuhkan untuk kehidupan sehari-hari.",
      methods: [
        { percent: "50%", label: "Kebutuhan", color: "#34D399", colorLight: "#D1FAE5", desc: "Kebutuhan: Belanjakan tidak lebih dari setengah penghasilan untuk kebutuhan pokok sehari-hari." },
        { percent: "30%", label: "Keinginan", color: "#60A5FA", colorLight: "#DBEAFE", desc: "Keinginan: Sisihkan 3 dari 10 bagian penghasilan untuk menikmati hidup dan keinginan pribadi." },
        { percent: "20%", label: "Tabungan", color: "#A78BFA", colorLight: "#EDE9FE", desc: "Tabungan: Prioritaskan minimal 2 dari 10 bagian untuk menabung dan berinvestasi demi masa depan." },
      ],
    },
  },
  {
    id: 3,
    title: "Melacak Arus Kas",
    subtitle: "Dasar-dasar Penganggaran",
    type: "text",
    content: {
      intro: "Arus kas adalah aliran uang masuk dan keluar dari keuangan Anda. Melacak arus kas secara rutin adalah kunci untuk memastikan Anda selalu berada di jalur yang benar secara finansial.",
      sectionTitle: null,
      items: [],
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
const ACCENT = "#34D399";
const ACCENT_DARK = "#059669";
const ACCENT_LIGHT = "#D1FAE5";

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

  // ─── Simpan slide selesai ke localStorage DAN Railway ───
  const handleMarkComplete = async () => {
    if (!isCompleted) {
      const updated = [...completedSlides, slide.id];
      setCompletedSlides(updated);

      // 1. Simpan ke localStorage
      localStorage.setItem(`modul_${MODUL_ID}`, JSON.stringify({ completed: updated }));

      // 2. Kirim slide selesai ke Railway
      const userId = localStorage.getItem("user_id");
      if (userId) {
        try {
          await fetch(getApiUrl("/api/simpan_slide.php"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, modul_id: MODUL_ID, slide_id: slide.id }),
          });
        } catch (err) {
          console.error("Gagal simpan slide:", err);
        }

        // 3. Jika semua slide selesai, simpan modul selesai ke Railway
        if (updated.length === slides.length) {
          try {
            await fetch(getApiUrl("/api/selesai_modul.php"), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ user_id: userId, modul_id: MODUL_ID }),
            });
          } catch (err) {
            console.error("Gagal simpan modul selesai:", err);
          }
        }
      }
    }

    if (!isLast) {
      setTimeout(() => setCurrentSlide((prev) => prev + 1), 200);
    }
  };

  const goToSlide = (idx) => setCurrentSlide(idx);

  return (
    <div style={{ minHeight: "100vh", background: "#FBF9F9", fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif", color: "#1A1A2E" }}>
      {/* Top Bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E8ECF0", padding: "0 2rem", display: "flex", alignItems: "center", gap: 16, height: 60, position: "sticky", top: 0, zIndex: 100 }}>
        {onBack && (
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "#6B7280", fontSize: 14, padding: "4px 8px", borderRadius: 6 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Kembali
          </button>
        )}
        <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A2E" }}>Dasar Penganggaran</span>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, maxWidth: 400, margin: "0 auto" }}>
          <div style={{ flex: 1, height: 6, background: "#E8ECF0", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progressPercent}%`, background: ACCENT, borderRadius: 99, transition: "width 0.4s ease" }} />
          </div>
          <span style={{ fontSize: 12, color: "#6B7280", whiteSpace: "nowrap" }}>{completedSlides.length}/{slides.length} selesai</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem", gap: "1.5rem" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: "1.25rem 1.75rem", marginBottom: "1rem", border: "1px solid #E8ECF0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>
                Pelajaran {slide.id} dari {slides.length}
              </span>
              {isCompleted && (
                <span style={{ background: ACCENT_LIGHT, color: ACCENT_DARK, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99 }}>✓ Selesai</span>
              )}
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "#1A1A2E" }}>{slide.title}</h1>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: "4px 0 0" }}>{slide.subtitle}</p>
          </div>

          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E8ECF0", overflow: "hidden" }}>
            <div style={{ padding: "1.75rem" }}>
              {slide.type === "text" && (
                <>
                  <p style={{ fontSize: 14, lineHeight: 1.8, color: "#374151", marginBottom: "1.25rem" }}>{slide.content.intro}</p>
                  {slide.content.sectionTitle && <p style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E", marginBottom: "0.75rem" }}>{slide.content.sectionTitle}</p>}
                  {slide.content.items?.length > 0 && (
                    <ul style={{ paddingLeft: "1.25rem", marginBottom: "1.25rem" }}>
                      {slide.content.items.map((item, i) => (
                        <li key={i} style={{ fontSize: 14, lineHeight: 1.8, color: "#374151", marginBottom: 6 }}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {slide.content.paragraphs?.map((p, i) => (
                    <p key={i} style={{ fontSize: 14, lineHeight: 1.8, color: "#374151", marginBottom: "1rem" }}>{p}</p>
                  ))}
                  {slide.content.closing && <p style={{ fontSize: 14, lineHeight: 1.8, color: "#374151" }}>{slide.content.closing}</p>}
                </>
              )}
              {slide.type === "text-method" && (
                <>
                  <p style={{ fontSize: 14, lineHeight: 1.8, color: "#374151", marginBottom: "1.25rem" }}>{slide.content.intro}</p>
                  <div style={{ display: "flex", gap: 8, marginBottom: "1.25rem" }}>
                    {slide.content.methods.map((m, i) => (
                      <div key={i} style={{ flex: 1, borderRadius: 10, background: m.color, padding: "12px 8px", textAlign: "center" }}>
                        <span style={{ fontSize: 20, fontWeight: 800, color: "#fff", display: "block" }}>{m.percent}</span>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>{m.label}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {slide.content.methods.map((m, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 16px", borderRadius: 10, background: m.colorLight, border: `1px solid ${m.color}30` }}>
                        <div style={{ width: 52, height: 52, borderRadius: 10, background: m.color, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ fontSize: 16, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{m.percent}</span>
                          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>{m.label}</span>
                        </div>
                        <p style={{ fontSize: 14, lineHeight: 1.7, color: "#374151", margin: 0 }}>{m.desc}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Nav Buttons */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.75rem", borderTop: "1px solid #E8ECF0", background: "#FAFBFC" }}>
              <button onClick={() => goToSlide(Math.max(0, currentSlide - 1))} disabled={isFirst} style={{ padding: "8px 18px", borderRadius: 20, border: "1px solid #D1D5DB", background: isFirst ? "#F3F4F6" : "#fff", color: isFirst ? "#9CA3AF" : "#374151", fontSize: 13, fontWeight: 500, cursor: isFirst ? "not-allowed" : "pointer" }}>
                &lt; Sebelumnya
              </button>
              <button onClick={handleMarkComplete} style={{ padding: "8px 24px", borderRadius: 20, border: "none", background: isCompleted ? "#E8ECF0" : ACCENT, color: isCompleted ? "#6B7280" : "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "background 0.2s" }}>
                {isCompleted ? "✓ Sudah Selesai" : "Tandai Selesai"}
              </button>
              <button onClick={() => goToSlide(Math.min(slides.length - 1, currentSlide + 1))} disabled={isLast} style={{ padding: "8px 18px", borderRadius: 20, border: "1px solid #D1D5DB", background: isLast ? "#F3F4F6" : "#fff", color: isLast ? "#9CA3AF" : "#374151", fontSize: 13, fontWeight: 500, cursor: isLast ? "not-allowed" : "pointer" }}>
                Selanjutnya &gt;
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ width: 260, flexShrink: 0 }}>
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E8ECF0", overflow: "hidden", position: "sticky", top: 76 }}>
            <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #E8ECF0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E", margin: 0 }}>Daftar Pelajaran</h2>
              <span style={{ background: ACCENT_LIGHT, color: ACCENT_DARK, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99 }}>{completedSlides.length}/{slides.length}</span>
            </div>
            <div style={{ padding: "0.5rem" }}>
              {slides.map((s, idx) => {
                const isActive = currentSlide === idx;
                const isDone = completedSlides.includes(s.id);
                return (
                  <button key={s.id} onClick={() => goToSlide(idx)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 8, border: "none", background: isActive ? ACCENT_LIGHT : isDone ? "#F9FAFB" : "transparent", cursor: "pointer", textAlign: "left", marginBottom: 4 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? ACCENT_DARK : isDone ? "#374151" : "#6B7280", margin: 0, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</p>
                      <p style={{ fontSize: 11, color: "#9CA3AF", margin: "3px 0 0" }}>{s.subtitle}</p>
                    </div>
                    <span style={{ marginLeft: 8, padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: isDone ? ACCENT : isActive ? ACCENT : "#E8ECF0", color: isDone || isActive ? "#fff" : "#9CA3AF", whiteSpace: "nowrap", flexShrink: 0 }}>
                      {isDone ? "Selesai" : isActive ? "Aktif" : "Materi"}
                    </span>
                  </button>
                );
              })}
            </div>
            {completedSlides.length === slides.length && (
              <div style={{ margin: "0.5rem", padding: "12px", background: ACCENT, borderRadius: 8, textAlign: "center" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>🎉 Modul Selesai!</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", margin: "4px 0 0" }}>Anda telah menyelesaikan semua materi</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
