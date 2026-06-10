import React, { useState } from "react";
import { fmtShort } from "./simulasiHelpers";

const METODE_CONFIG = {
  standard:  { needs: 0.5, wants: 0.3, savings: 0.2, label: "50/30/20 – Standar"   },
  hemat:     { needs: 0.6, wants: 0.2, savings: 0.2, label: "60/20/20 – Lebih Hemat" },
  lifestyle: { needs: 0.4, wants: 0.4, savings: 0.2, label: "40/40/20 – Gaya Hidup Aktif" },
};

const METODE_DESC = {
  standard:  "50% untuk kebutuhan wajib seperti makan dan sewa, 30% untuk keinginan seperti hiburan dan belanja, dan 20% untuk tabungan atau investasi.",
  hemat:     "60% untuk kebutuhan wajib. Cocok jika kamu ingin lebih disiplin menabung dan mengurangi pengeluaran untuk keinginan.",
  lifestyle: "40% untuk kebutuhan dan 40% untuk keinginan. Cocok jika biaya hidupmu sudah efisien dan ingin menikmati lebih banyak.",
};

/* ── Donut Chart ── */
function DonutChart({ needs, wants, savings }) {
  const total = needs + wants + savings;
  if (!total) return null;

  const r             = 60;
  const cx            = 90;
  const cy            = 90;
  const circumference = 2 * Math.PI * r;

  const segments = [
    { val: needs,   color: "#384DB8", label: "Kebutuhan Wajib" },
    { val: wants,   color: "#8B5CF6", label: "Keinginan"       },
    { val: savings, color: "#34D399", label: "Tabungan"        },
  ];

  let accumulatedLength = 0;
  const arcs = segments.map((seg) => {
    const pct    = seg.val / total;
    const dash   = circumference * pct;
    const gap    = circumference - dash;
    const offset = accumulatedLength;
    accumulatedLength += dash;
    return { ...seg, dash, gap, offset };
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
      <text x={cx} y={cy - 6}  textAnchor="middle" fontSize="11" fill="#9CA3AF" fontFamily="DM Sans">
        Penghasilan
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="14" fill="#111827" fontWeight="800" fontFamily="Syne">
        {fmtShort(total)}
      </text>
    </svg>
  );
}

/* ── Budget Simulator ── */
export default function BudgetSimulator() {
  const [income, setIncome] = useState("5000000");
  const [shown,  setShown]  = useState(false);
  const [metode, setMetode] = useState("standard");

  const val    = parseFloat(income.replace(/\D/g, "")) || 0;
  const cfg    = METODE_CONFIG[metode];
  const needs   = val * cfg.needs;
  const wants   = val * cfg.wants;
  const savings = val * cfg.savings;

  const calculate = () => setShown(true);
  const reset     = () => { setIncome("5000000"); setShown(false); setMetode("standard"); };

  const pctNeeds   = `${cfg.needs   * 100}%`;
  const pctWants   = `${cfg.wants   * 100}%`;
  const pctSavings = `${cfg.savings * 100}%`;

  return (
    <div className="skk-card">
      <div className="skk-card-header">
        <div className="skk-card-icon green">🥧</div>
        <div>
          <h2 className="skk-card-title">Kalkulator Pembagian Anggaran Bulanan</h2>
          <p className="skk-card-subtitle">Simulasi Budgeting</p>
          <p className="skk-card-desc">
            Masukkan penghasilan bulananmu dan pilih metode pembagian yang sesuai gaya hidupmu.
            Kalkulator ini akan membagi uangmu ke tiga kategori: kebutuhan wajib, keinginan, dan tabungan.
          </p>
        </div>
      </div>

      <div className="skk-card-body">
        <div className="skk-form-grid-2">
          <div className="skk-field">
            <label className="skk-label">
              Penghasilan Bersih per Bulan
              <span className="skk-label-sub">Total uang yang kamu terima setiap bulan setelah pajak</span>
            </label>
            <div className="skk-input-wrap">
              <span className="skk-input-prefix">Rp</span>
              <input
                className="skk-input"
                type="text"
                value={Number(income.replace(/\D/g, "")).toLocaleString("id-ID")}
                onChange={(e) => { setIncome(e.target.value.replace(/\D/g, "")); setShown(false); }}
              />
            </div>
          </div>

          <div className="skk-field">
            <label className="skk-label">
              Metode Pembagian Anggaran
              <span className="skk-label-sub">Pilih pola yang paling cocok dengan kondisimu</span>
            </label>
            <select
              className="skk-select"
              value={metode}
              onChange={(e) => { setMetode(e.target.value); setShown(false); }}
            >
              <option value="standard">50/30/20 — Standar (paling umum digunakan)</option>
              <option value="hemat">60/20/20 — Lebih Hemat (fokus menabung lebih banyak)</option>
              <option value="lifestyle">40/40/20 — Gaya Hidup Aktif (lebih banyak untuk keinginan)</option>
            </select>
          </div>
        </div>

        <div className="skk-info-box" style={{ marginBottom: "16px" }}>
          <span>💡</span>
          <p>{METODE_DESC[metode]}</p>
        </div>

        <div className="skk-btn-row">
          <button className="skk-btn-primary" onClick={calculate}>🥧 Bagi Anggaran Saya</button>
          <button className="skk-btn-secondary" onClick={reset}>Mulai Ulang</button>
        </div>

        {shown && val > 0 && (
          <div className="skk-result">
            <p className="skk-result-title">📊 Pembagian Anggaran Bulananmu — {cfg.label}</p>
            <div className="skk-budget-layout">
              <div className="skk-donut-wrap">
                <DonutChart needs={needs} wants={wants} savings={savings} />
                <div className="skk-donut-legend">
                  {[
                    { color: "#384DB8", label: "Kebutuhan Wajib", pct: pctNeeds   },
                    { color: "#8B5CF6", label: "Keinginan",       pct: pctWants   },
                    { color: "#34D399", label: "Tabungan",         pct: pctSavings },
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
                    <span className="skk-tip-name">Kebutuhan Wajib</span>
                    <span className="skk-tip-pct">{pctNeeds}</span>
                  </div>
                  <p className="skk-tip-amount">{fmtShort(needs)}</p>
                  <p className="skk-tip-desc">Sewa, makan, transportasi, tagihan listrik dan air, dan semua pengeluaran yang wajib dibayar</p>
                </div>

                <div className="skk-tip-card wants">
                  <div className="skk-tip-header">
                    <span className="skk-tip-emoji">🎮</span>
                    <span className="skk-tip-name">Keinginan</span>
                    <span className="skk-tip-pct">{pctWants}</span>
                  </div>
                  <p className="skk-tip-amount">{fmtShort(wants)}</p>
                  <p className="skk-tip-desc">Hiburan, makan di luar, belanja pakaian, langganan streaming, dan hal-hal menyenangkan tapi tidak wajib</p>
                </div>

                <div className="skk-tip-card savings">
                  <div className="skk-tip-header">
                    <span className="skk-tip-emoji">🐷</span>
                    <span className="skk-tip-name">Tabungan dan Investasi</span>
                    <span className="skk-tip-pct">{pctSavings}</span>
                  </div>
                  <p className="skk-tip-amount">{fmtShort(savings)}</p>
                  <p className="skk-tip-desc">Dana darurat, tabungan jangka panjang, reksa dana, saham, atau investasi lainnya untuk masa depan</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
