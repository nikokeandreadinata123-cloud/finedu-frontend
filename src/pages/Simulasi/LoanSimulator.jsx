import React, { useState } from "react";
import { fmtShort } from "./simulasiHelpers";

export default function LoanSimulator() {
  const [amount, setAmount] = useState("10000000");
  const [rate,   setRate]   = useState("12");
  const [term,   setTerm]   = useState("12");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const P = parseFloat(amount.replace(/\D/g, "")) || 0;
    const r = parseFloat(rate) / 100 / 12;
    const n = parseInt(term) || 0;
    if (!P || !r || !n) return;

    const monthly  = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total    = monthly * n;
    const interest = total - P;
    setResult({ monthly, total, interest });
  };

  const reset = () => {
    setAmount("10000000");
    setRate("12");
    setTerm("12");
    setResult(null);
  };

  return (
    <div className="skk-card">
      <div className="skk-card-header">
        <div className="skk-card-icon blue">🏦</div>
        <div>
          <h2 className="skk-card-title">Kalkulator Cicilan Pinjaman</h2>
          <p className="skk-card-subtitle">Simulasi Pinjaman Bank</p>
          <p className="skk-card-desc">
            Masukkan jumlah pinjaman, bunga tahunan, dan berapa lama kamu mau mencicil.
            Kalkulator ini akan menghitung berapa yang harus kamu bayar setiap bulan.
          </p>
        </div>
      </div>

      <div className="skk-card-body">
        <div className="skk-form-grid">
          <div className="skk-field">
            <label className="skk-label">
              Jumlah Pinjaman
              <span className="skk-label-sub">Berapa uang yang ingin kamu pinjam (Rp)</span>
            </label>
            <div className="skk-input-wrap">
              <span className="skk-input-prefix">Rp</span>
              <input
                className="skk-input"
                type="text"
                value={Number(amount.replace(/\D/g, "")).toLocaleString("id-ID")}
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
              />
            </div>
          </div>

          <div className="skk-field">
            <label className="skk-label">
              Bunga per Tahun
              <span className="skk-label-sub">Suku bunga tahunan dari bank (% per tahun)</span>
            </label>
            <div className="skk-input-wrap">
              <span className="skk-input-prefix">%</span>
              <input
                className="skk-input"
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                min="0" max="100"
              />
            </div>
          </div>

          <div className="skk-field">
            <label className="skk-label">
              Lama Cicilan
              <span className="skk-label-sub">Berapa bulan kamu ingin mencicil</span>
            </label>
            <div className="skk-input-wrap">
              <span className="skk-input-prefix">📅</span>
              <input
                className="skk-input"
                type="number"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                min="1" max="360"
              />
            </div>
          </div>
        </div>

        <div className="skk-btn-row">
          <button className="skk-btn-primary" onClick={calculate}>⚡ Hitung Cicilan Saya</button>
          <button className="skk-btn-secondary" onClick={reset}>Mulai Ulang</button>
        </div>

        <div className="skk-info-box">
          <span>💡</span>
          <p>
            Perhitungan menggunakan metode <strong>amortisasi standar</strong> — artinya setiap bulan
            kamu membayar jumlah yang sama, dengan porsi bunga yang semakin berkurang seiring waktu.
            Sebaiknya cicilan bulanan tidak melebihi <strong>30% dari penghasilan</strong> agar keuangan tetap sehat.
          </p>
        </div>

        {result && (
          <div className="skk-result">
            <p className="skk-result-title">📊 Hasil Perhitungan Cicilanmu</p>
            <div className="skk-result-grid">
              <div className="skk-result-card blue-card">
                <p className="skk-result-label">Cicilan Setiap Bulan</p>
                <p className="skk-result-value">{fmtShort(result.monthly)}</p>
              </div>
              <div className="skk-result-card green-card">
                <p className="skk-result-label">Total yang Kamu Bayar</p>
                <p className="skk-result-value">{fmtShort(result.total)}</p>
              </div>
              <div className="skk-result-card red-card">
                <p className="skk-result-label">Total Bunga yang Kamu Bayar</p>
                <p className="skk-result-value">{fmtShort(result.interest)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
