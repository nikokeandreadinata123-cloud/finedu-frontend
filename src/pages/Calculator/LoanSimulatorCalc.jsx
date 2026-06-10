import React, { useState } from "react";

// Format angka ke format Rupiah Indonesia (pakai titik sebagai pemisah ribuan)
const formatRupiah = (val) => {
  const num = val.replace(/\D/g, "");
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const toNumber = (val) => parseFloat(val.replace(/\./g, "")) || 0;

const fmt = (num) => "Rp " + Math.round(num).toLocaleString("id-ID");

export default function LoanSimulatorCalc() {
  const [loanAmount,   setLoanAmount]   = useState("10.000.000");
  const [interestRate, setInterestRate] = useState("12");
  const [loanTerm,     setLoanTerm]     = useState("12");
  const [result,       setResult]       = useState(null);
  const [error,        setError]        = useState("");

  const handleHitung = () => {
    setError("");
    const P = toNumber(loanAmount);
    const r = parseFloat(interestRate) / 100 / 12;
    const n = parseFloat(loanTerm);

    if (!P || P <= 0) {
      setError("Jumlah pinjaman harus lebih dari 0. Silakan isi dengan benar.");
      return;
    }
    if (!interestRate || parseFloat(interestRate) < 0) {
      setError("Bunga per tahun tidak boleh kosong atau negatif.");
      return;
    }
    if (!n || n <= 0) {
      setError("Lama cicilan harus minimal 1 bulan.");
      return;
    }

    const monthly = r === 0
      ? P / n
      : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    const total         = monthly * n;
    const totalInterest = total - P;

    setResult({ monthly, total, totalInterest });
  };

  const handleReset = () => {
    setLoanAmount("10.000.000");
    setInterestRate("12");
    setLoanTerm("12");
    setResult(null);
    setError("");
  };

  return (
    <div className="calc-card">
      {/* ── Header ── */}
      <div className="calc-card-header">
        <div className="calc-card-icon calc-card-icon--green">🏦</div>
        <div>
          <h2 className="calc-card-title">Kalkulator Cicilan Pinjaman</h2>
          <p className="calc-card-subtitle calc-card-subtitle--green">Simulasi Pinjaman Bank</p>
          <p className="calc-card-desc">Isi jumlah pinjaman, bunga, dan lama cicilan.</p>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="calc-card-body">
        <div className="calc-input-grid calc-input-grid--3">

          {/* Jumlah Pinjaman */}
          <div className="calc-field">
            <label>Jumlah Pinjaman</label>
            <span className="calc-field-hint">Total pinjaman dari bank</span>
            <div className="calc-input-wrap">
              <span className="calc-input-prefix">Rp</span>
              <input
                type="text"
                value={loanAmount}
                onChange={(e) => setLoanAmount(formatRupiah(e.target.value))}
                placeholder="Contoh: 10.000.000"
              />
            </div>
          </div>

          {/* Bunga per Tahun */}
          <div className="calc-field">
            <label>Bunga per Tahun</label>
            <span className="calc-field-hint">Suku bunga tahunan dari bank</span>
            <div className="calc-input-wrap">
              <span className="calc-input-prefix">%</span>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                min="0"
                max="100"
                placeholder="Contoh: 12"
              />
            </div>
          </div>

          {/* Lama Cicilan */}
          <div className="calc-field">
            <label>Lama Cicilan</label>
            <span className="calc-field-hint">Durasi cicilan (maks. 360 bulan)</span>
            <div className="calc-input-wrap">
              <input
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                min="1"
                max="360"
                placeholder="Contoh: 12"
              />
              <span className="calc-input-suffix">bulan</span>
            </div>
          </div>

        </div>

        {/* Pesan Error */}
        {error && (
          <div style={{
            background: "#fff1f2",
            border: "1px solid rgba(244,63,94,0.25)",
            borderRadius: 10,
            padding: "10px 14px",
            marginBottom: 16,
          }}>
            <p style={{ fontSize: 12.5, color: "#e11d48", margin: 0 }}>⚠️ {error}</p>
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="calc-actions">
          <button className="calc-btn-primary calc-btn-primary--green" onClick={handleHitung}>
            ⚡ Hitung Cicilan Saya
          </button>
          <button className="calc-btn-secondary" onClick={handleReset}>Mulai Ulang</button>
        </div>

        {/* Hasil Perhitungan */}
        {result && (
          <div className="calc-results calc-results--3">
            <div className="calc-result-card calc-result-card--green">
              <span className="calc-result-label">Cicilan Setiap Bulan</span>
              <span className="calc-result-value calc-result-value--green">{fmt(result.monthly)}</span>
              <span className="calc-result-sub">yang harus kamu bayar tiap bulan</span>
            </div>
            <div className="calc-result-card calc-result-card--blue">
              <span className="calc-result-label">Total yang Kamu Bayar</span>
              <span className="calc-result-value calc-result-value--blue">{fmt(result.total)}</span>
              <span className="calc-result-sub">keseluruhan sampai lunas</span>
            </div>
            <div className="calc-result-card calc-result-card--red">
              <span className="calc-result-label">Total Bunga yang Dibayar</span>
              <span className="calc-result-value calc-result-value--red">{fmt(result.totalInterest)}</span>
              <span className="calc-result-sub">biaya tambahan dari bunga bank</span>
            </div>
          </div>
        )}

        {/* Kotak Info */}
        <div className="calc-info-box">
          <span className="calc-info-box-icon">💡</span>
          <p>
            Menggunakan metode <strong>amortisasi standar</strong>. Idealnya cicilan bulanan tidak melebihi <strong>30% penghasilan</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
