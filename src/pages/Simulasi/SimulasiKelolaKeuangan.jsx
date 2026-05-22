import React, { useState, useMemo } from "react";
import "./SimulasiKelolaKeuangan.css";
import Sidebar from "../../components/Sidebar.jsx";

/* ──────────────────────────────────────────
   HELPERS
────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const fmtShort = (n) => {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}M`;
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}rb`;
  return fmt(n);
};

/* ──────────────────────────────────────────
   TAB: LOAN SIMULATOR
────────────────────────────────────────── */
function LoanSimulator() {
  const [amount, setAmount] = useState("10000000");
  const [rate, setRate] = useState("12");
  const [term, setTerm] = useState("12");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const P = parseFloat(amount.replace(/\D/g, "")) || 0;
    const r = parseFloat(rate) / 100 / 12;
    const n = parseInt(term) || 0;
    if (!P || !r || !n) return;

    const monthly = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = monthly * n;
    const interest = total - P;
    setResult({ monthly, total, interest });
  };

  const reset = () => { setAmount("10000000"); setRate("12"); setTerm("12"); setResult(null); };

  return (
    <div className="skk-card">
      <div className="skk-card-header">
        <div className="skk-card-icon blue">🏦</div>
        <div>
          <h2 className="skk-card-title">Loan Simulator</h2>
          <p className="skk-card-subtitle">Simulasi Pinjaman</p>
          <p className="skk-card-desc">Hitung cicilan bulanan dan total pembayaran untuk pinjaman Anda</p>
        </div>
      </div>

      <div className="skk-card-body">
        <div className="skk-form-grid">
          <div className="skk-field">
            <label className="skk-label">
              Loan Amount
              <span className="skk-label-sub">Jumlah pinjaman (Rp)</span>
            </label>
            <div className="skk-input-wrap">
              <span className="skk-input-prefix">Rp</span>
              <input
                className="skk-input"
                type="text"
                value={Number(amount.replace(/\D/g,"")).toLocaleString("id-ID")}
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
              />
            </div>
          </div>

          <div className="skk-field">
            <label className="skk-label">
              Interest Rate
              <span className="skk-label-sub">Suku bunga (% / tahun)</span>
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
              Loan Term
              <span className="skk-label-sub">Jangka waktu (bulan)</span>
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
          <button className="skk-btn-primary" onClick={calculate}>⚡ Hitung Cicilan</button>
          <button className="skk-btn-secondary" onClick={reset}>Reset</button>
        </div>

        <div className="skk-info-box">
          <span>💡</span>
          <p>Perhitungan menggunakan metode <strong>amortisasi standar</strong>. Pastikan kemampuan bayar bulanan tidak melebihi 30% dari penghasilan.</p>
        </div>

        {result && (
          <div className="skk-result">
            <p className="skk-result-title">📊 Hasil Perhitungan</p>
            <div className="skk-result-grid">
              <div className="skk-result-card blue-card">
                <p className="skk-result-label">Cicilan / Bulan</p>
                <p className="skk-result-value">{fmtShort(result.monthly)}</p>
              </div>
              <div className="skk-result-card green-card">
                <p className="skk-result-label">Total Pembayaran</p>
                <p className="skk-result-value">{fmtShort(result.total)}</p>
              </div>
              <div className="skk-result-card red-card">
                <p className="skk-result-label">Total Bunga</p>
                <p className="skk-result-value">{fmtShort(result.interest)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   TAB: BUDGET 50/30/20
────────────────────────────────────────── */
function DonutChart({ needs, wants, savings }) {
  const total = needs + wants + savings;
  if (!total) return null;

  const r = 60;
  const cx = 90;
  const cy = 90;
  const circumference = 2 * Math.PI * r;

  const segments = [
    { val: needs, color: "#384DB8", label: "Kebutuhan" },
    { val: wants, color: "#8B5CF6", label: "Keinginan" },
    { val: savings, color: "#34D399", label: "Tabungan" },
  ];

  let offset = 0;
  const arcs = segments.map((seg) => {
    const pct = seg.val / total;
    const dash = circumference * pct;
    const gap = circumference - dash;
    const arc = { ...seg, dash, gap, offset: offset * circumference };
    offset += pct;
    return arc;
  });

  return (
    <svg className="skk-donut-svg" viewBox="0 0 180 180">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F3F4F6" strokeWidth="22" />
      {arcs.map((arc, i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={arc.color}
          strokeWidth="22"
          strokeDasharray={`${arc.dash} ${arc.gap}`}
          strokeDashoffset={-arc.offset}
          strokeLinecap="butt"
          transform="rotate(-90 90 90)"
          style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.34,1.56,0.64,1)" }}
        />
      ))}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fill="#9CA3AF" fontFamily="DM Sans">Penghasilan</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="14" fill="#111827" fontWeight="800" fontFamily="Syne">
        {fmtShort(total)}
      </text>
    </svg>
  );
}

function BudgetSimulator() {
  const [income, setIncome] = useState("5000000");
  const [shown, setShown] = useState(false);

  const val = parseFloat(income.replace(/\D/g, "")) || 0;
  const needs = val * 0.5;
  const wants = val * 0.3;
  const savings = val * 0.2;

  const calculate = () => setShown(true);
  const reset = () => { setIncome("5000000"); setShown(false); };

  return (
    <div className="skk-card">
      <div className="skk-card-header">
        <div className="skk-card-icon green">🥧</div>
        <div>
          <h2 className="skk-card-title">Budget 50/30/20</h2>
          <p className="skk-card-subtitle">Simulasi Budgeting</p>
          <p className="skk-card-desc">Atur keuangan dengan metode 50% kebutuhan, 30% keinginan, 20% tabungan</p>
        </div>
      </div>

      <div className="skk-card-body">
        <div className="skk-form-grid-2">
          <div className="skk-field">
            <label className="skk-label">
              Penghasilan Bulanan
              <span className="skk-label-sub">Total pemasukan per bulan</span>
            </label>
            <div className="skk-input-wrap">
              <span className="skk-input-prefix">Rp</span>
              <input
                className="skk-input"
                type="text"
                value={Number(income.replace(/\D/g,"")).toLocaleString("id-ID")}
                onChange={(e) => setIncome(e.target.value.replace(/\D/g, ""))}
              />
            </div>
          </div>

          <div className="skk-field">
            <label className="skk-label">
              Metode Pembagian
              <span className="skk-label-sub">Pilih pola budgeting</span>
            </label>
            <select className="skk-select">
              <option>50/30/20 – Standar</option>
              <option>60/20/20 – Hemat</option>
              <option>40/40/20 – Lifestyle</option>
            </select>
          </div>
        </div>

        <div className="skk-btn-row">
          <button className="skk-btn-primary" onClick={calculate}>🥧 Hitung Budget</button>
          <button className="skk-btn-secondary" onClick={reset}>Reset</button>
        </div>

        {shown && val > 0 && (
          <div className="skk-result">
            <p className="skk-result-title">📊 Alokasi Budget Bulanan</p>
            <div className="skk-budget-layout">
              <div className="skk-donut-wrap">
                <DonutChart needs={needs} wants={wants} savings={savings} />
                <div className="skk-donut-legend">
                  {[
                    { color: "#384DB8", label: "Kebutuhan", pct: "50%" },
                    { color: "#8B5CF6", label: "Keinginan", pct: "30%" },
                    { color: "#34D399", label: "Tabungan", pct: "20%" },
                  ].map((l) => (
                    <div className="skk-legend-item" key={l.label}>
                      <div className="skk-legend-dot" style={{ background: l.color }} />
                      <span className="skk-legend-label">{l.label}</span>
                      <span className="skk-legend-pct">{l.pct}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="skk-budget-tips">
                <div className="skk-tip-card needs">
                  <div className="skk-tip-header">
                    <span className="skk-tip-emoji">🏠</span>
                    <span className="skk-tip-name">Kebutuhan</span>
                    <span className="skk-tip-pct">50%</span>
                  </div>
                  <p className="skk-tip-amount">{fmtShort(needs)}</p>
                  <p className="skk-tip-desc">Sewa, makan, transport, tagihan wajib</p>
                </div>

                <div className="skk-tip-card wants">
                  <div className="skk-tip-header">
                    <span className="skk-tip-emoji">🎮</span>
                    <span className="skk-tip-name">Keinginan</span>
                    <span className="skk-tip-pct">30%</span>
                  </div>
                  <p className="skk-tip-amount">{fmtShort(wants)}</p>
                  <p className="skk-tip-desc">Hiburan, makan enak, belanja, hobi</p>
                </div>

                <div className="skk-tip-card savings">
                  <div className="skk-tip-header">
                    <span className="skk-tip-emoji">🐷</span>
                    <span className="skk-tip-name">Tabungan & Investasi</span>
                    <span className="skk-tip-pct">20%</span>
                  </div>
                  <p className="skk-tip-amount">{fmtShort(savings)}</p>
                  <p className="skk-tip-desc">Dana darurat, investasi, masa depan</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   TAB: INVESTASI
────────────────────────────────────────── */
function InvestasiSimulator() {
  const [modal, setModal] = useState("1000000");
  const [bulanan, setBulanan] = useState("500000");
  const [rate, setRate] = useState(8);
  const [tahun, setTahun] = useState(10);
  const [result, setResult] = useState(null);

  const calculate = () => {
    const P = parseFloat(modal.replace(/\D/g,"")) || 0;
    const m = parseFloat(bulanan.replace(/\D/g,"")) || 0;
    const r = rate / 100 / 12;
    const n = tahun * 12;

    const bars = [];
    let totalModal = P;
    let balance = P;

    for (let y = 1; y <= tahun; y++) {
      for (let mo = 0; mo < 12; mo++) {
        balance = balance * (1 + r) + m;
        totalModal += m;
      }
      bars.push({ year: `Th ${y}`, total: balance, modal: totalModal });
    }

    setResult({ bars, final: balance, totalModal, bunga: balance - totalModal });
  };

  const reset = () => { setModal("1000000"); setBulanan("500000"); setRate(8); setTahun(10); setResult(null); };

  const maxVal = result ? Math.max(...result.bars.map((b) => b.total)) : 1;

  return (
    <div className="skk-card">
      <div className="skk-card-header">
        <div className="skk-card-icon yellow">📈</div>
        <div>
          <h2 className="skk-card-title">Investasi Simulator</h2>
          <p className="skk-card-subtitle">Simulasi Investasi</p>
          <p className="skk-card-desc">Proyeksikan pertumbuhan investasi kamu dengan bunga majemuk</p>
        </div>
      </div>

      <div className="skk-card-body">
        <div className="skk-form-grid-2">
          <div className="skk-field">
            <label className="skk-label">Modal Awal <span className="skk-label-sub">Dana investasi pertama</span></label>
            <div className="skk-input-wrap">
              <span className="skk-input-prefix">Rp</span>
              <input className="skk-input" type="text"
                value={Number(modal.replace(/\D/g,"")).toLocaleString("id-ID")}
                onChange={(e) => setModal(e.target.value.replace(/\D/g,""))} />
            </div>
          </div>

          <div className="skk-field">
            <label className="skk-label">Investasi Bulanan <span className="skk-label-sub">Tambahan per bulan</span></label>
            <div className="skk-input-wrap">
              <span className="skk-input-prefix">Rp</span>
              <input className="skk-input" type="text"
                value={Number(bulanan.replace(/\D/g,"")).toLocaleString("id-ID")}
                onChange={(e) => setBulanan(e.target.value.replace(/\D/g,""))} />
            </div>
          </div>
        </div>

        <div className="skk-form-grid-2">
          <div className="skk-field">
            <div className="skk-slider-wrap">
              <div className="skk-slider-header">
                <label className="skk-label">Return Tahunan</label>
                <span className="skk-slider-val">{rate}%</span>
              </div>
              <input className="skk-slider" type="range" min="1" max="30" value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                style={{ background: `linear-gradient(to right, #384DB8 ${(rate/30)*100}%, #E5E7EB ${(rate/30)*100}%)` }} />
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:"11px", color:"var(--gray-400)" }}>
                <span>1%</span><span>30%</span>
              </div>
            </div>
          </div>

          <div className="skk-field">
            <div className="skk-slider-wrap">
              <div className="skk-slider-header">
                <label className="skk-label">Jangka Waktu</label>
                <span className="skk-slider-val">{tahun} Tahun</span>
              </div>
              <input className="skk-slider" type="range" min="1" max="30" value={tahun}
                onChange={(e) => setTahun(Number(e.target.value))}
                style={{ background: `linear-gradient(to right, #34D399 ${(tahun/30)*100}%, #E5E7EB ${(tahun/30)*100}%)` }} />
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:"11px", color:"var(--gray-400)" }}>
                <span>1 th</span><span>30 th</span>
              </div>
            </div>
          </div>
        </div>

        <div className="skk-btn-row">
          <button className="skk-btn-primary" onClick={calculate}>📈 Hitung Proyeksi</button>
          <button className="skk-btn-secondary" onClick={reset}>Reset</button>
        </div>

        {result && (
          <div className="skk-result">
            <p className="skk-result-title">📊 Proyeksi Pertumbuhan</p>
            <div className="skk-result-grid">
              <div className="skk-result-card blue-card">
                <p className="skk-result-label">Total Nilai Akhir</p>
                <p className="skk-result-value">{fmtShort(result.final)}</p>
              </div>
              <div className="skk-result-card green-card">
                <p className="skk-result-label">Total Keuntungan</p>
                <p className="skk-result-value">{fmtShort(result.bunga)}</p>
              </div>
              <div className="skk-result-card red-card">
                <p className="skk-result-label">Total Modal</p>
                <p className="skk-result-value">{fmtShort(result.totalModal)}</p>
              </div>
            </div>

            <div className="skk-chart-wrap">
              <div className="skk-chart-bars">
                {result.bars.map((b, i) => (
                  <div className="skk-bar-group" key={i}>
                    <div className="skk-bar total"
                      style={{ height: `${(b.total / maxVal) * 120}px` }}
                      title={fmtShort(b.total)} />
                    <div className="skk-bar modal"
                      style={{ height: `${(b.modal / maxVal) * 120}px`, marginTop: `-${(b.total/maxVal)*120}px`, position:"relative" }}
                      title={fmtShort(b.modal)} />
                    <span className="skk-bar-label">{b.year}</span>
                  </div>
                ))}
              </div>
              <div className="skk-chart-labels">
                <div className="skk-chart-legend">
                  <div className="skk-chart-legend-dot" style={{ background:"#34D399" }} />
                  <span>Total Nilai</span>
                </div>
                <div className="skk-chart-legend">
                  <div className="skk-chart-legend-dot" style={{ background:"#384DB8" }} />
                  <span>Modal</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   TAB: DEBT PAYOFF
────────────────────────────────────────── */
function DebtPayoff() {
  const [debts, setDebts] = useState([
    { id: 1, name: "KTA Bank", balance: 15000000, rate: 18, min: 500000 },
    { id: 2, name: "Kartu Kredit", balance: 8000000, rate: 24, min: 300000 },
  ]);
  const [method, setMethod] = useState("avalanche");
  const [extra, setExtra] = useState("500000");
  const [result, setResult] = useState(null);

  const addDebt = () => {
    setDebts([...debts, { id: Date.now(), name: "Utang Baru", balance: 5000000, rate: 12, min: 200000 }]);
  };

  const updateDebt = (id, field, val) => {
    setDebts(debts.map((d) => d.id === id ? { ...d, [field]: val } : d));
  };

  const removeDebt = (id) => setDebts(debts.filter((d) => d.id !== id));

  const calculate = () => {
    const extraPay = parseFloat(extra.replace(/\D/g,"")) || 0;
    let remaining = debts.map((d) => ({ ...d, balance: parseFloat(d.balance) || 0, rate: parseFloat(d.rate) || 0, min: parseFloat(d.min) || 0 }));

    const sorted = method === "avalanche"
      ? [...remaining].sort((a, b) => b.rate - a.rate)
      : [...remaining].sort((a, b) => a.balance - b.balance);

    let months = 0;
    let totalInterest = 0;
    const order = [];

    while (sorted.some((d) => d.balance > 0) && months < 600) {
      months++;
      let extra_left = extraPay;

      sorted.forEach((d) => {
        if (d.balance <= 0) return;
        const interest = d.balance * (d.rate / 100 / 12);
        totalInterest += interest;
        d.balance += interest;
        d.balance -= d.min;
        if (d.balance < 0) d.balance = 0;
      });

      // extra payment to priority debt
      for (let d of sorted) {
        if (d.balance > 0 && extra_left > 0) {
          const pay = Math.min(d.balance, extra_left);
          d.balance -= pay;
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

  return (
    <div className="skk-card">
      <div className="skk-card-header">
        <div className="skk-card-icon blue">💳</div>
        <div>
          <h2 className="skk-card-title">Debt Payoff Planner</h2>
          <p className="skk-card-subtitle">Simulasi Pelunasan Utang</p>
          <p className="skk-card-desc">Rencanakan strategi terbaik untuk melunasi semua utangmu</p>
        </div>
      </div>

      <div className="skk-card-body">
        {/* Debt list */}
        <div className="skk-debt-table-wrap">
        <table className="skk-debt-table">
          <thead>
            <tr>
              <th>Nama Utang</th>
              <th>Saldo (Rp)</th>
              <th>Bunga (%/thn)</th>
              <th>Min. Bayar</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {debts.map((d) => (
              <tr key={d.id}>
                <td><input style={{ border:"none", background:"transparent", fontFamily:"var(--font-body)", fontSize:"13px", width:"100%", color:"var(--gray-700)", fontWeight:500 }}
                  value={d.name} onChange={(e) => updateDebt(d.id, "name", e.target.value)} /></td>
                <td><input style={{ border:"none", background:"transparent", fontFamily:"var(--font-body)", fontSize:"13px", width:"80px", color:"var(--gray-700)", fontWeight:500 }}
                  type="number" value={d.balance} onChange={(e) => updateDebt(d.id, "balance", e.target.value)} /></td>
                <td><input style={{ border:"none", background:"transparent", fontFamily:"var(--font-body)", fontSize:"13px", width:"40px", color:"var(--gray-700)", fontWeight:500 }}
                  type="number" value={d.rate} onChange={(e) => updateDebt(d.id, "rate", e.target.value)} /></td>
                <td><input style={{ border:"none", background:"transparent", fontFamily:"var(--font-body)", fontSize:"13px", width:"80px", color:"var(--gray-700)", fontWeight:500 }}
                  type="number" value={d.min} onChange={(e) => updateDebt(d.id, "min", e.target.value)} /></td>
                <td>
                  <button onClick={() => removeDebt(d.id)}
                    style={{ border:"none", background:"var(--red-light)", color:"var(--red)", borderRadius:"6px", padding:"4px 8px", cursor:"pointer", fontSize:"12px" }}>
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        <button onClick={addDebt}
          style={{ marginTop:"12px", border:"1.5px dashed var(--gray-200)", background:"transparent", borderRadius:"var(--radius-md)", padding:"10px 16px", cursor:"pointer", color:"var(--gray-500)", fontSize:"13px", fontFamily:"var(--font-body)", width:"100%", transition:"var(--transition)" }}>
          + Tambah Utang
        </button>

        <div className="skk-form-grid-2" style={{ marginTop:"20px" }}>
          <div className="skk-field">
            <label className="skk-label">Metode Pelunasan <span className="skk-label-sub">Pilih strategi terbaik</span></label>
            <select className="skk-select" value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="avalanche">⚡ Avalanche – Bunga tertinggi dulu</option>
              <option value="snowball">🏔 Snowball – Saldo terkecil dulu</option>
            </select>
          </div>

          <div className="skk-field">
            <label className="skk-label">Pembayaran Extra <span className="skk-label-sub">Tambahan di luar minimum</span></label>
            <div className="skk-input-wrap">
              <span className="skk-input-prefix">Rp</span>
              <input className="skk-input" type="text"
                value={Number(extra.replace(/\D/g,"")).toLocaleString("id-ID")}
                onChange={(e) => setExtra(e.target.value.replace(/\D/g,""))} />
            </div>
          </div>
        </div>

        <div className="skk-btn-row">
          <button className="skk-btn-primary" onClick={calculate}>💳 Hitung Rencana</button>
          <button className="skk-btn-secondary" onClick={() => setResult(null)}>Reset</button>
        </div>

        {result && (
          <div className="skk-result">
            <p className="skk-result-title">📊 Hasil Rencana Pelunasan</p>
            <div className="skk-result-grid">
              <div className="skk-result-card blue-card">
                <p className="skk-result-label">Waktu Lunas</p>
                <p className="skk-result-value">{result.months} bulan</p>
              </div>
              <div className="skk-result-card red-card">
                <p className="skk-result-label">Total Bunga</p>
                <p className="skk-result-value">{fmtShort(result.totalInterest)}</p>
              </div>
              <div className="skk-result-card green-card">
                <p className="skk-result-label">Strategi</p>
                <p className="skk-result-value">{method === "avalanche" ? "Avalanche" : "Snowball"}</p>
              </div>
            </div>

            {result.order.length > 0 && (
              <div style={{ marginTop:"16px" }}>
                <p style={{ fontSize:"13px", fontWeight:700, color:"var(--gray-700)", marginBottom:"10px" }}>🏁 Urutan Pelunasan:</p>
                {result.order.map((o, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 14px", background:"var(--gray-50)", borderRadius:"var(--radius-md)", marginBottom:"6px" }}>
                    <span style={{ width:"24px", height:"24px", borderRadius:"50%", background:"var(--blue)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:700, flexShrink:0 }}>{i+1}</span>
                    <span style={{ fontSize:"14px", fontWeight:600, color:"var(--gray-700)", flex:1 }}>{o.name}</span>
                    <span className="skk-badge-pill blue">Bulan ke-{o.months}</span>
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

/* ──────────────────────────────────────────
   MAIN PAGE
────────────────────────────────────────── */
const TABS = [
  { key: "loan",    label: "Loan Simulator", icon: "🏦" },
  { key: "budget",  label: "Budgeting 50/30/20", icon: "🥧" },
  { key: "invest",  label: "Investasi", icon: "📈" },
  { key: "debt",    label: "Debt Payoff", icon: "💳" },
];

export default function SimulasiKelolaKeuangan() {
  const [activeTab, setActiveTab] = useState("loan");

  return (
    <div className="skk-layout">
      <Sidebar />
      <div className="skk-page">
      {/* Header */}
      <div className="skk-header">
        <div className="skk-badge">
          <span className="skk-badge-dot" />
          Financial Tools
        </div>
        <h1 className="skk-title">
          Simulasi <span>Kelola Keuangan</span>
        </h1>
        <p className="skk-subtitle">
          Gunakan kalkulator interaktif untuk merencanakan keuanganmu dengan lebih cerdas 💸
        </p>
      </div>

      {/* Tabs */}
      <div className="skk-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`skk-tab${activeTab === t.key ? " active" : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            <span className="skk-tab-icon">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "loan"   && <LoanSimulator />}
      {activeTab === "budget" && <BudgetSimulator />}
      {activeTab === "invest" && <InvestasiSimulator />}
      {activeTab === "debt"   && <DebtPayoff />}
      </div>
    </div>
  );
}
