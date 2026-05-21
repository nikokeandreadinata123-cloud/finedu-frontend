import React, { useState } from "react";

export default function LoanSimulatorCalc() {
  const [loanAmount, setLoanAmount] = useState("10,000,000");
  const [interestRate, setInterestRate] = useState("12");
  const [loanTerm, setLoanTerm] = useState("12");
  const [result, setResult] = useState(null);

  const formatRupiah = (val) => {
    const num = val.replace(/\D/g, "");
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleHitung = () => {
    const P = parseFloat(loanAmount.replace(/,/g, ""));
    const r = parseFloat(interestRate) / 100 / 12;
    const n = parseFloat(loanTerm);
    if (!P || !r || !n) return;
    const monthly = r === 0
      ? P / n
      : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setResult({ monthly, total: monthly * n, totalInterest: (monthly * n) - P });
  };

  const handleReset = () => {
    setLoanAmount("10,000,000");
    setInterestRate("12");
    setLoanTerm("12");
    setResult(null);
  };

  const fmt = (num) => "Rp " + Math.round(num).toLocaleString("id-ID");

  return (
    <div className="calc-card">
      {/* Header */}
      <div className="calc-card-header">
        <div className="calc-card-icon calc-card-icon--green">🏦</div>
        <div>
          <h2 className="calc-card-title">Loan Simulator</h2>
          <p className="calc-card-subtitle calc-card-subtitle--green">Simulasi Pinjaman</p>
          <p className="calc-card-desc">Hitung cicilan bulanan dan total pembayaran untuk pinjaman Anda</p>
        </div>
      </div>

      {/* Body */}
      <div className="calc-card-body">
        <div className="calc-input-grid calc-input-grid--3">
          <div className="calc-field">
            <label>Loan Amount</label>
            <span className="calc-field-hint">Jumlah pinjaman (Rp)</span>
            <div className="calc-input-wrap">
              <span className="calc-input-prefix">Rp</span>
              <input type="text" value={loanAmount}
                onChange={(e) => setLoanAmount(formatRupiah(e.target.value))} />
            </div>
          </div>
          <div className="calc-field">
            <label>Interest Rate</label>
            <span className="calc-field-hint">Suku bunga (% / tahun)</span>
            <div className="calc-input-wrap">
              <span className="calc-input-prefix">%</span>
              <input type="number" value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)} />
            </div>
          </div>
          <div className="calc-field">
            <label>Loan Term</label>
            <span className="calc-field-hint">Jangka waktu (bulan)</span>
            <div className="calc-input-wrap">
              <span className="calc-input-prefix">📅</span>
              <input type="number" value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="calc-actions">
          <button className="calc-btn-primary calc-btn-primary--green" onClick={handleHitung}>
            Hitung Cicilan
          </button>
          <button className="calc-btn-secondary" onClick={handleReset}>Reset</button>
        </div>

        {result && (
          <div className="calc-results calc-results--3">
            <div className="calc-result-card calc-result-card--green">
              <span className="calc-result-label">Cicilan Bulanan</span>
              <span className="calc-result-value calc-result-value--green">{fmt(result.monthly)}</span>
              <span className="calc-result-sub">per bulan</span>
            </div>
            <div className="calc-result-card calc-result-card--blue">
              <span className="calc-result-label">Total Pembayaran</span>
              <span className="calc-result-value calc-result-value--blue">{fmt(result.total)}</span>
              <span className="calc-result-sub">keseluruhan</span>
            </div>
            <div className="calc-result-card calc-result-card--red">
              <span className="calc-result-label">Total Bunga</span>
              <span className="calc-result-value calc-result-value--red">{fmt(result.totalInterest)}</span>
              <span className="calc-result-sub">biaya bunga</span>
            </div>
          </div>
        )}

        <div className="calc-info-box">
          <span className="calc-info-box-icon">💡</span>
          <p>Perhitungan menggunakan metode <strong>amortisasi standar</strong>. Pastikan kemampuan bayar bulanan tidak melebihi 30% dari penghasilan.</p>
        </div>
      </div>
    </div>
  );
}
