import { useState } from "react";
import { getApiUrl } from "../../api";

const slides = [
  {
    id: 1,
    title: "Understanding Debt",
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
    type: "text-list",
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
const ACCENT = "#1EC99B";
const ACCENT_LIGHT = "#E1F5EE";

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
            body: JSON.stringify({
              user_id: userId,
              modul_id: MODUL_ID,
              slide_id: slide.id,
            }),
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
              body: JSON.stringify({
                user_id: userId,
                modul_id: MODUL_ID,
              }),
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
        <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A2E" }}>Manajemen Utang</span>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, maxWidth: 400, margin: "0 auto" }}>
          <div style={{ flex: 1, height: 6, background: "#E8ECF0", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progressPercent}%`, background: ACCENT, borderRadius: 99, transition: "width 0.4s ease" }} />
          </div>
          <span style={{ fontSize: 12, color: "#6B7280", whiteSpace: "nowrap" }}>{completedSlides.length}/{slides.length} selesai</span>
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ display: "flex", maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem", gap: "1.5rem" }}>
        {/* Content Area */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: "1.25rem 1.75rem", marginBottom: "1rem", border: "1px solid #E8ECF0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>
                Pelajaran {slide.id} dari {slides.length}
              </span>
              {isCompleted && (
                <span style={{ background: ACCENT_LIGHT, color: "#0F6E56", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99 }}>✓ Selesai</span>
              )}
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "#1A1A2E" }}>{slide.title}</h1>
          </div>

          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E8ECF0", overflow: "hidden" }}>
            <div style={{ padding: "1.75rem" }}>
              {slide.type === "text" && slide.content.paragraphs?.map((p, i) => (
                <p key={i} style={{ fontSize: 14, lineHeight: 1.8, color: "#374151", marginBottom: "1rem" }}>{p}</p>
              ))}
              {slide.type === "text-list" && (
                <>
                  <p style={{ fontSize: 14, lineHeight: 1.8, color: "#374151", marginBottom: "1rem" }}>{slide.content.intro}</p>
                  <ol style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
                    {slide.content.items.map((item, i) => (
                      <li key={i} style={{ fontSize: 14, lineHeight: 1.8, color: "#374151", marginBottom: 6 }}>{item}</li>
                    ))}
                  </ol>
                  <div style={{ background: ACCENT_LIGHT, padding: "1rem 1.25rem", borderLeft: `3px solid ${ACCENT}` }}>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: "#0F6E56", margin: 0 }}>{slide.content.closing}</p>
                  </div>
                </>
              )}
            </div>

            {/* Nav Buttons */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.75rem", borderTop: "1px solid #E8ECF0", background: "#FAFBFC" }}>
              <button onClick={() => setCurrentSlide((p) => Math.max(0, p - 1))} disabled={isFirst} style={{ padding: "8px 18px", borderRadius: 20, border: "1px solid #D1D5DB", background: isFirst ? "#F3F4F6" : "#fff", color: isFirst ? "#9CA3AF" : "#374151", fontSize: 13, fontWeight: 500, cursor: isFirst ? "not-allowed" : "pointer" }}>
                &lt; Sebelumnya
              </button>
              <button onClick={handleMarkComplete} style={{ padding: "8px 24px", borderRadius: 20, border: "none", background: isCompleted ? "#E8ECF0" : ACCENT, color: isCompleted ? "#6B7280" : "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "background 0.2s" }}>
                {isCompleted ? "✓ Sudah Selesai" : "Tandai Selesai"}
              </button>
              <button onClick={() => setCurrentSlide((p) => Math.min(slides.length - 1, p + 1))} disabled={isLast} style={{ padding: "8px 18px", borderRadius: 20, border: "1px solid #D1D5DB", background: isLast ? "#F3F4F6" : "#fff", color: isLast ? "#9CA3AF" : "#374151", fontSize: 13, fontWeight: 500, cursor: isLast ? "not-allowed" : "pointer" }}>
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
              <span style={{ background: ACCENT_LIGHT, color: "#0F6E56", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99 }}>{completedSlides.length}/{slides.length}</span>
            </div>
            <div style={{ padding: "0.5rem" }}>
              {slides.map((s, idx) => {
                const isActive = currentSlide === idx;
                const isDone = completedSlides.includes(s.id);
                return (
                  <button key={s.id} onClick={() => goToSlide(idx)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 8, border: "none", background: isActive ? ACCENT_LIGHT : isDone ? "#F9FAFB" : "transparent", cursor: "pointer", textAlign: "left", marginBottom: 4 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? "#0F6E56" : isDone ? "#374151" : "#6B7280", margin: 0, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</p>
                      <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0, marginTop: 2 }}>📄 Materi</p>
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
