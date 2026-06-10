import React, { useState } from "react";

// Format angka ke format Rupiah Indonesia (pakai titik sebagai pemisah ribuan)
const formatRupiah = (val) => {
  const num = val.replace(/\D/g, "");
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const toNumber = (val) => parseFloat(val.replace(/\./g, "")) || 0;

const fmt = (num) => "Rp " + Math.round(num).toLocaleString("id-ID");

export default function DebtPayoffCalc() {
  const [debtAmount,      setDebtAmount]      = useState("10.000.000");
  const [monthlyPayment,  setMonthlyPayment]  = useState("500.000");
  const [interestRate,    setInterestRate]    = useState("18");
  const [result,          setResult]          = useState(null);
  const [error,           setError]           = useState("");

  const handleHitung = () => {
    setError("");

    const P       = toNumber(debtAmount);
    const payment = toNumber(monthlyPayment);
    const annualRate = parseFloat(interestRate);

    // Validasi input
    if (!P || P <= 0) {
      setError("Jumlah hutang harus lebih dari 0. Silakan isi dengan benar.");
      return;
    }
    if (!payment || payment <= 0) {
      setError("Pembayaran bulanan harus lebih dari 0. Silakan isi dengan benar.");
      return;
    }
    if (isNaN(annualRate) || annualRate < 0) {
      setError("Bunga per tahun tidak boleh kosong atau negatif.");
      return;
    }

    const r = annualRate / 100 / 12;

    // Validasi: pembayaran harus bisa menutupi bunga bulan pertama
    const bungaBulanPertama = P * r;
    if (payment <= bungaBulanPertama) {
      setError(
        `Pembayaran bulanan terlalu kecil! Dengan bunga ${annualRate}% per tahun, ` +
        `bunga bulan pertama saja sudah ${fmt(bungaBulanPertama)}. ` +
        `Naikkan pembayaran bulanan minimal menjadi ${fmt(Math.ceil(bungaBulanPertama + 1))} ` +
        `agar hutangmu benar-benar berkurang setiap bulan.`
      );
      return;
    }

    // Simulasi amortisasi saldo menurun
    let balance   = P;
    let months    = 0;
    let totalPaid = 0;
    const MAX_MONTHS = 600; // batas maksimal 50 tahun

    while (balance > 0 && months < MAX_MONTHS) {
      const bunga    = balance * r;
      const pokok    = Math.min(payment - bunga, balance);
      balance       -= pokok;
      totalPaid     += pokok + bunga;
      months++;
    }

    const totalInterest  = totalPaid - P;
    const years          = Math.floor(months / 12);
    const remainMonths   = months % 12;

    setResult({ months, years, remainMonths, totalPaid, totalInterest });
  };

  const handleReset = () => {
    setDebtAmount("10.000.000");
    setMonthlyPayment("500.000");
    setInterestRate("18");
    setResult(null);
    setError("");
  };

  const durationLabel = result
    ? result.years > 0
      ? `${result.years} tahun${result.remainMonths > 0 ? ` ${result.remainMonths} bulan` : ""}`
      : `${result.months} bulan`
    : "-";

  return (
    <div className="calc-card">
      {/* ── Header ── */}
      <div className="calc-card-header">
        <div className="calc-card-icon calc-card-icon--purple">💳</div>
        <div>
          <h2 className="calc-card-title">Rencana Melunasi Hutang</h2>
          <p className="calc-card-subtitle calc-card-subtitle--purple">Kalkulator Pelunasan Hutang</p>
          <p className="calc-card-desc">
            Masukkan total hutang, berapa yang sanggup kamu bayar setiap bulan, dan bunga yang
            berlaku. Kalkulator ini akan menghitung berapa lama hutangmu bisa lunas sepenuhnya.
          </p>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="calc-card-body">
        <div className="calc-input-grid calc-input-grid--3">

          {/* Total Hutang */}
          <div className="calc-field">
            <label>Total Hutang Saat Ini</label>
            <span className="calc-field-hint">
              Jumlah total sisa hutang yang belum lunas
            </span>
            <div className="calc-input-wrap">
              <span className="calc-input-prefix">Rp</span>
              <input
                type="text"
                value={debtAmount}
                onChange={(e) => setDebtAmount(formatRupiah(e.target.value))}
                placeholder="Contoh: 10.000.000"
              />
            </div>
          </div>

          {/* Pembayaran Bulanan */}
          <div className="calc-field">
            <label>Sanggup Bayar Setiap Bulan</label>
            <span className="calc-field-hint">
              Berapa yang bisa kamu bayar tiap bulan — semakin besar, semakin cepat lunas
            </span>
            <div className="calc-input-wrap">
              <span className="calc-input-prefix">Rp</span>
              <input
                type="text"
                value={monthlyPayment}
                onChange={(e) => setMonthlyPayment(formatRupiah(e.target.value))}
                placeholder="Contoh: 500.000"
              />
            </div>
          </div>

          {/* Suku Bunga */}
          <div className="calc-field">
            <label>Bunga per Tahun</label>
            <span className="calc-field-hint">
              Bunga tahunan dari hutangmu — cek di surat perjanjian atau aplikasi pinjaman
            </span>
            <div className="calc-input-wrap">
              <span className="calc-input-prefix">%</span>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                min="0"
                max="100"
                placeholder="Contoh: 18"
              />
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
          <button className="calc-btn-primary calc-btn-primary--purple" onClick={handleHitung}>
            💳 Hitung Rencana Pelunasan
          </button>
          <button className="calc-btn-secondary" onClick={handleReset}>Mulai Ulang</button>
        </div>

        {/* Hasil Perhitungan */}
        {result && (
          <div className="calc-results calc-results--3">
            <div className="calc-result-card calc-result-card--amber">
              <span className="calc-result-label">Perkiraan Hutang Lunas</span>
              <span className="calc-result-value calc-result-value--amber">{durationLabel}</span>
              <span className="calc-result-sub">{result.months} bulan total</span>
            </div>
            <div className="calc-result-card calc-result-card--purple">
              <span className="calc-result-label">Total yang Kamu Bayar</span>
              <span className="calc-result-value calc-result-value--purple">{fmt(result.totalPaid)}</span>
              <span className="calc-result-sub">sampai hutang benar-benar lunas</span>
            </div>
            <div className="calc-result-card calc-result-card--red">
              <span className="calc-result-label">Total Bunga yang Dibayar</span>
              <span className="calc-result-value calc-result-value--red">{fmt(result.totalInterest)}</span>
              <span className="calc-result-sub">biaya ekstra akibat bunga hutang</span>
            </div>
          </div>
        )}

        {/* Kotak Info */}
        <div className="calc-info-box">
          <span className="calc-info-box-icon">💡</span>
          <p>
            Perhitungan menggunakan metode <strong>amortisasi saldo menurun</strong> — bunga
            dihitung dari sisa hutang setiap bulan, bukan dari hutang awal. Artinya setiap bulan
            porsi bunga yang kamu bayar semakin kecil seiring hutang yang berkurang.{" "}
            <strong>Semakin besar pembayaran bulanan, semakin cepat hutang lunas dan semakin sedikit bunga yang kamu bayar.</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
