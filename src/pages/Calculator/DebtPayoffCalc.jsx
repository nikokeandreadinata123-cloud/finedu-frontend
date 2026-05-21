import React, { useState } from "react";

export default function DebtPayoffCalc() {
  const [debtAmount, setDebtAmount]     = useState("10,000,000");
  const [monthlyPayment, setMonthlyPayment] = useState("500,000");
  const [interestRate, setInterestRate] = useState("18");
  const [result, setResult]             = useState(null);
  const [error, setError]               = useState("");

  const formatRupiah = (val) => {
    const num = val.replace(/\D/g, "");
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleHitung = () => {
    setError("");
    const P = parseFloat(debtAmount.replace(/,/g, ""));
    const payment = parseFloat(monthlyPayment.replace(/,/g, ""));
    const annualRate = parseFloat(interestRate);

    if (!P || !payment || isNaN(annualRate)) {
      setError("Semua field wajib diisi dengan benar.");
      return;
    }

    const r = annualRate / 100 / 12;

    // Cek apakah pembayaran cukup untuk menutupi bunga bulan pertama
    const firstMonthInterest = P * r;
    if (payment <= firstMonthInterest) {
      setError(`Pembayaran bulanan terlalu kecil! Minimal Rp ${Math.ceil(firstMonthInterest + 1).toLocaleString("id-ID")} untuk menutupi bunga.`);
      return;
    }

    // Simulasi amortisasi saldo menurun
    let balance = P;
    let months = 0;
    let totalPaid = 0;
    const MAX_MONTHS = 600; // batas 50 tahun

    while (balance > 0 && months < MAX_MONTHS) {
      const interest = balance * r;
      const principal = Math.min(payment - interest, balance);
      balance -= principal;
      totalPaid += principal + interest;
      months++;
    }

    const totalInterest = totalPaid - P;
    const years = Math.floor(months / 12);
    const remainMonths = months % 12;

    setResult({ months, years, remainMonths, totalPaid, totalInterest });
  };

  const handleReset = () => {
    setDebtAmount("10,000,000");
    setMonthlyPayment("500,000");
    setInterestRate("18");
    setResult(null);
    setError("");
  };

  const fmt = (num) => "Rp " + Math.round(num).toLocaleString("id-ID");

  const durationLabel = result
    ? result.years > 0
      ? `${result.years} thn ${result.remainMonths > 0 ? result.remainMonths + " bln" : ""}`
      : `${result.months} bulan`
    : "-";

  return (
    <div className="calc-card">
      {/* Header */}
      <div className="calc-card-header">
        <div className="calc-card-icon calc-card-icon--purple">💳</div>
        <div>
          <h2 className="calc-card-title">Debt Payoff Calculator</h2>
          <p className="calc-card-subtitle calc-card-subtitle--purple">Kalkulator Pelunasan Hutang</p>
          <p className="calc-card-desc">Hitung berapa lama waktu yang dibutuhkan untuk melunasi hutang Anda sepenuhnya</p>
        </div>
      </div>

      {/* Body */}
      <div className="calc-card-body">
        <div className="calc-input-grid calc-input-grid--3">
          <div className="calc-field">
            <label>Total Hutang</label>
            <span className="calc-field-hint">Jumlah hutang pokok (Rp)</span>
            <div className="calc-input-wrap">
              <span className="calc-input-prefix">Rp</span>
              <input type="text" value={debtAmount}
                onChange={(e) => setDebtAmount(formatRupiah(e.target.value))} />
            </div>
          </div>
          <div className="calc-field">
            <label>Pembayaran Bulanan</label>
            <span className="calc-field-hint">Jumlah bayar tiap bulan (Rp)</span>
            <div className="calc-input-wrap">
              <span className="calc-input-prefix">Rp</span>
              <input type="text" value={monthlyPayment}
                onChange={(e) => setMonthlyPayment(formatRupiah(e.target.value))} />
            </div>
          </div>
          <div className="calc-field">
            <label>Suku Bunga</label>
            <span className="calc-field-hint">Bunga tahunan (%)</span>
            <div className="calc-input-wrap">
              <span className="calc-input-prefix">%</span>
              <input type="number" value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)} />
            </div>
          </div>
        </div>

        {error && (
          <div style={{ background: "#fff1f2", border: "1px solid rgba(244,63,94,0.25)", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
            <p style={{ fontSize: 12.5, color: "#e11d48", margin: 0 }}>⚠️ {error}</p>
          </div>
        )}

        <div className="calc-actions">
          <button className="calc-btn-primary calc-btn-primary--purple" onClick={handleHitung}>
            Hitung Pelunasan
          </button>
          <button className="calc-btn-secondary" onClick={handleReset}>Reset</button>
        </div>

        {result && (
          <>
            <div className="calc-results calc-results--3">
              <div className="calc-result-card calc-result-card--amber">
                <span className="calc-result-label">Waktu Pelunasan</span>
                <span className="calc-result-value calc-result-value--amber">{durationLabel}</span>
                <span className="calc-result-sub">{result.months} bulan total</span>
              </div>
              <div className="calc-result-card calc-result-card--purple">
                <span className="calc-result-label">Total Dibayar</span>
                <span className="calc-result-value calc-result-value--purple">{fmt(result.totalPaid)}</span>
                <span className="calc-result-sub">keseluruhan</span>
              </div>
              <div className="calc-result-card calc-result-card--red">
                <span className="calc-result-label">Total Bunga</span>
                <span className="calc-result-value calc-result-value--red">{fmt(result.totalInterest)}</span>
                <span className="calc-result-sub">biaya bunga</span>
              </div>
            </div>
          </>
        )}

        <div className="calc-info-box">
          <span className="calc-info-box-icon">💡</span>
          <p>Menggunakan metode <strong>amortisasi saldo menurun</strong> — bunga dihitung dari sisa hutang setiap bulan. Semakin besar pembayaran bulanan, semakin cepat hutang lunas.</p>
        </div>
      </div>
    </div>
  );
}
