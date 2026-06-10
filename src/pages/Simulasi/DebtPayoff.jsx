import React, { useState } from "react";
import { fmtShort } from "./simulasiHelpers";

export default function DebtPayoff() {
  const [debts, setDebts] = useState([
    { id: 1, name: "Kredit Tanpa Agunan Bank", balance: 15000000, rate: 18, min: 500000 },
    { id: 2, name: "Kartu Kredit",             balance:  8000000, rate: 24, min: 300000 },
  ]);
  const [method, setMethod] = useState("avalanche");
  const [extra,  setExtra]  = useState("500000");
  const [result, setResult] = useState(null);

  const addDebt = () => {
    setDebts([...debts, { id: Date.now(), name: "Utang Baru", balance: 5000000, rate: 12, min: 200000 }]);
  };

  const updateDebt = (id, field, val) => {
    setDebts(debts.map((d) => (d.id === id ? { ...d, [field]: val } : d)));
  };

  const removeDebt = (id) => setDebts(debts.filter((d) => d.id !== id));

  const calculate = () => {
    const extraPay = parseFloat(extra.replace(/\D/g, "")) || 0;

    const fresh = debts.map((d) => ({
      ...d,
      balance: parseFloat(d.balance) || 0,
      rate:    parseFloat(d.rate)    || 0,
      min:     parseFloat(d.min)     || 0,
    }));

    const sorted =
      method === "avalanche"
        ? [...fresh].sort((a, b) => b.rate    - a.rate)
        : [...fresh].sort((a, b) => a.balance - b.balance);

    let months        = 0;
    let totalInterest = 0;
    const order       = [];

    while (sorted.some((d) => d.balance > 0) && months < 600) {
      months++;
      let extra_left = extraPay;

      sorted.forEach((d) => {
        if (d.balance <= 0) return;
        const interest = d.balance * (d.rate / 100 / 12);
        totalInterest += interest;
        d.balance     += interest;
        d.balance     -= d.min;
        if (d.balance < 0) d.balance = 0;
      });

      for (let d of sorted) {
        if (d.balance > 0 && extra_left > 0) {
          const pay   = Math.min(d.balance, extra_left);
          d.balance  -= pay;
          extra_left -= pay;
          break;
        }
      }

      sorted.forEach((d) => {
        if (d.balance <= 0 && !order.find((o) => o.name === d.name)) {
          order.push({ name: d.name, months });
        }
      });
    }

    setResult({ months, totalInterest, order });
  };

  const inputStyle = {
    border: "none", background: "transparent",
    fontFamily: "var(--font-body)", fontSize: "13px",
    color: "var(--gray-700)", fontWeight: 500,
  };

  return (
    <div className="skk-card">
      <div className="skk-card-header">
        <div className="skk-card-icon blue">💳</div>
        <div>
          <h2 className="skk-card-title">Rencana Melunasi Semua Utang</h2>
          <p className="skk-card-subtitle">Simulasi Pelunasan Utang</p>
          <p className="skk-card-desc">
            Masukkan daftar utang kamu, pilih strategi yang sesuai, dan tambahkan pembayaran
            ekstra jika bisa. Kalkulator ini akan menunjukkan berapa lama semua utangmu bisa lunas.
          </p>
        </div>
      </div>

      <div className="skk-card-body">
        {/* Tabel utang */}
        <div className="skk-debt-table-wrap">
          <table className="skk-debt-table">
            <thead>
              <tr>
                <th>Nama Utang</th>
                <th>Sisa Utang (Rp)</th>
                <th>Bunga per Tahun (%)</th>
                <th>Bayar Minimum (Rp)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {debts.map((d) => (
                <tr key={d.id}>
                  <td>
                    <input style={{ ...inputStyle, width: "100%" }}
                      value={d.name}
                      onChange={(e) => updateDebt(d.id, "name", e.target.value)} />
                  </td>
                  <td>
                    <input style={{ ...inputStyle, width: "80px" }}
                      type="number" value={d.balance}
                      onChange={(e) => updateDebt(d.id, "balance", e.target.value)} />
                  </td>
                  <td>
                    <input style={{ ...inputStyle, width: "40px" }}
                      type="number" value={d.rate}
                      onChange={(e) => updateDebt(d.id, "rate", e.target.value)} />
                  </td>
                  <td>
                    <input style={{ ...inputStyle, width: "80px" }}
                      type="number" value={d.min}
                      onChange={(e) => updateDebt(d.id, "min", e.target.value)} />
                  </td>
                  <td>
                    <button
                      onClick={() => removeDebt(d.id)}
                      style={{ border: "none", background: "var(--red-light)", color: "var(--red)", borderRadius: "6px", padding: "4px 8px", cursor: "pointer", fontSize: "12px" }}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={addDebt}
          style={{ marginTop: "12px", border: "1.5px dashed var(--gray-200)", background: "transparent", borderRadius: "var(--radius-md)", padding: "10px 16px", cursor: "pointer", color: "var(--gray-500)", fontSize: "13px", fontFamily: "var(--font-body)", width: "100%", transition: "var(--transition)" }}
        >
          + Tambah Utang Baru
        </button>

        <div className="skk-form-grid-2" style={{ marginTop: "20px" }}>
          <div className="skk-field">
            <label className="skk-label">
              Strategi Pelunasan <span className="skk-label-sub">Pilih cara yang paling cocok untukmu</span>
            </label>
            <select className="skk-select" value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="avalanche">⚡ Lunasi bunga tertinggi dulu — lebih hemat total bunga</option>
              <option value="snowball">🏔 Lunasi saldo terkecil dulu — lebih cepat terasa hasilnya</option>
            </select>
          </div>

          <div className="skk-field">
            <label className="skk-label">
              Pembayaran Ekstra Setiap Bulan <span className="skk-label-sub">Tambahan di luar bayar minimum</span>
            </label>
            <div className="skk-input-wrap">
              <span className="skk-input-prefix">Rp</span>
              <input
                className="skk-input" type="text"
                value={Number(extra.replace(/\D/g, "")).toLocaleString("id-ID")}
                onChange={(e) => setExtra(e.target.value.replace(/\D/g, ""))}
              />
            </div>
          </div>
        </div>

        <div className="skk-btn-row">
          <button className="skk-btn-primary" onClick={calculate}>💳 Buat Rencana Pelunasan</button>
          <button className="skk-btn-secondary" onClick={() => setResult(null)}>Sembunyikan Hasil</button>
        </div>

        {result && (
          <div className="skk-result">
            <p className="skk-result-title">📊 Rencana Pelunasan Utangmu</p>
            <div className="skk-result-grid">
              <div className="skk-result-card blue-card">
                <p className="skk-result-label">Perkiraan Waktu Semua Utang Lunas</p>
                <p className="skk-result-value">{result.months} bulan</p>
              </div>
              <div className="skk-result-card red-card">
                <p className="skk-result-label">Total Bunga yang Harus Dibayar</p>
                <p className="skk-result-value">{fmtShort(result.totalInterest)}</p>
              </div>
              <div className="skk-result-card green-card">
                <p className="skk-result-label">Strategi yang Digunakan</p>
                <p className="skk-result-value">{method === "avalanche" ? "Bunga Tertinggi Dulu" : "Saldo Terkecil Dulu"}</p>
              </div>
            </div>

            {result.order.length > 0 && (
              <div style={{ marginTop: "16px" }}>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--gray-700)", marginBottom: "10px" }}>
                  🏁 Urutan Pelunasan Utang:
                </p>
                {result.order.map((o, i) => (
                  <div
                    key={i}
                    style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "var(--gray-50)", borderRadius: "var(--radius-md)", marginBottom: "6px" }}
                  >
                    <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--blue)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>
                      {i + 1}
                    </span>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--gray-700)", flex: 1 }}>{o.name}</span>
                    <span className="skk-badge-pill blue">Lunas di bulan ke-{o.months}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
