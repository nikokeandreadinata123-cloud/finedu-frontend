import React, { useState } from "react";
import { fmtShort } from "./simulasiHelpers";

export default function InvestasiSimulator() {
  const [modal,   setModal]   = useState("1000000");
  const [bulanan, setBulanan] = useState("500000");
  const [rate,    setRate]    = useState(8);
  const [tahun,   setTahun]   = useState(10);
  const [result,  setResult]  = useState(null);

  const calculate = () => {
    const P = parseFloat(modal.replace(/\D/g, ""))   || 0;
    const m = parseFloat(bulanan.replace(/\D/g, "")) || 0;
    const r = rate / 100 / 12;

    const bars = [];
    let totalModal = P;
    let balance    = P;

    for (let y = 1; y <= tahun; y++) {
      for (let mo = 0; mo < 12; mo++) {
        balance    = balance * (1 + r) + m;
        totalModal += m;
      }
      bars.push({ year: `Tahun ${y}`, total: balance, modal: totalModal });
    }

    setResult({ bars, final: balance, totalModal, bunga: balance - totalModal });
  };

  const reset = () => {
    setModal("1000000");
    setBulanan("500000");
    setRate(8);
    setTahun(10);
    setResult(null);
  };

  const maxVal = result ? Math.max(...result.bars.map((b) => b.total)) : 1;
  const BAR_MAX_HEIGHT = 120;

  return (
    <div className="skk-card">
      <div className="skk-card-header">
        <div className="skk-card-icon yellow">📈</div>
        <div>
          <h2 className="skk-card-title">Simulasi Pertumbuhan Investasi</h2>
          <p className="skk-card-subtitle">Proyeksi Investasi Jangka Panjang</p>
          <p className="skk-card-desc">
            Lihat berapa uangmu bisa tumbuh jika kamu mulai berinvestasi sekarang dengan
            modal awal dan tambahan rutin setiap bulan menggunakan kekuatan bunga majemuk.
          </p>
        </div>
      </div>

      <div className="skk-card-body">
        <div className="skk-form-grid-2">
          <div className="skk-field">
            <label className="skk-label">
              Modal Awal
              <span className="skk-label-sub">Dana investasi pertama yang kamu siapkan</span>
            </label>
            <div className="skk-input-wrap">
              <span className="skk-input-prefix">Rp</span>
              <input
                className="skk-input" type="text"
                value={Number(modal.replace(/\D/g, "")).toLocaleString("id-ID")}
                onChange={(e) => setModal(e.target.value.replace(/\D/g, ""))}
              />
            </div>
          </div>

          <div className="skk-field">
            <label className="skk-label">
              Tambahan Investasi Setiap Bulan
              <span className="skk-label-sub">Uang yang rutin kamu tambahkan tiap bulan</span>
            </label>
            <div className="skk-input-wrap">
              <span className="skk-input-prefix">Rp</span>
              <input
                className="skk-input" type="text"
                value={Number(bulanan.replace(/\D/g, "")).toLocaleString("id-ID")}
                onChange={(e) => setBulanan(e.target.value.replace(/\D/g, ""))}
              />
            </div>
          </div>
        </div>

        <div className="skk-form-grid-2">
          <div className="skk-field">
            <div className="skk-slider-wrap">
              <div className="skk-slider-header">
                <label className="skk-label">Imbal Hasil per Tahun</label>
                <span className="skk-slider-val">{rate}%</span>
              </div>
              <input
                className="skk-slider" type="range" min="1" max="30" value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                style={{ background: `linear-gradient(to right, #384DB8 ${(rate / 30) * 100}%, #E5E7EB ${(rate / 30) * 100}%)` }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--gray-400)" }}>
                <span>1% (sangat konservatif)</span><span>30% (sangat agresif)</span>
              </div>
            </div>
          </div>

          <div className="skk-field">
            <div className="skk-slider-wrap">
              <div className="skk-slider-header">
                <label className="skk-label">Jangka Waktu Investasi</label>
                <span className="skk-slider-val">{tahun} Tahun</span>
              </div>
              <input
                className="skk-slider" type="range" min="1" max="30" value={tahun}
                onChange={(e) => setTahun(Number(e.target.value))}
                style={{ background: `linear-gradient(to right, #34D399 ${(tahun / 30) * 100}%, #E5E7EB ${(tahun / 30) * 100}%)` }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--gray-400)" }}>
                <span>1 tahun</span><span>30 tahun</span>
              </div>
            </div>
          </div>
        </div>

        <div className="skk-btn-row">
          <button className="skk-btn-primary" onClick={calculate}>📈 Lihat Proyeksi Investasi Saya</button>
          <button className="skk-btn-secondary" onClick={reset}>Mulai Ulang</button>
        </div>

        {result && (
          <div className="skk-result">
            <p className="skk-result-title">📊 Proyeksi Pertumbuhan Investasimu</p>
            <div className="skk-result-grid">
              <div className="skk-result-card blue-card">
                <p className="skk-result-label">Nilai Akhir Investasi Kamu</p>
                <p className="skk-result-value">{fmtShort(result.final)}</p>
              </div>
              <div className="skk-result-card green-card">
                <p className="skk-result-label">Total Keuntungan yang Kamu Dapat</p>
                <p className="skk-result-value">{fmtShort(result.bunga)}</p>
              </div>
              <div className="skk-result-card red-card">
                <p className="skk-result-label">Total Uang yang Sudah Kamu Masukkan</p>
                <p className="skk-result-value">{fmtShort(result.totalModal)}</p>
              </div>
            </div>

            <div className="skk-chart-wrap">
              <div className="skk-chart-bars">
                {result.bars.map((b, i) => {
                  const totalH = (b.total / maxVal) * BAR_MAX_HEIGHT;
                  const modalH = (b.modal / maxVal) * BAR_MAX_HEIGHT;
                  const bungaH = totalH - modalH;

                  return (
                    <div className="skk-bar-group" key={i}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column-reverse",
                          height: `${BAR_MAX_HEIGHT}px`,
                          justifyContent: "flex-start",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <div
                          className="skk-bar modal"
                          style={{ height: `${modalH}px`, width: "100%" }}
                          title={`Modal yang dimasukkan: ${fmtShort(b.modal)}`}
                        />
                        <div
                          className="skk-bar total"
                          style={{ height: `${bungaH}px`, width: "100%" }}
                          title={`Keuntungan: ${fmtShort(b.total - b.modal)}`}
                        />
                      </div>
                      <span className="skk-bar-label">{b.year}</span>
                    </div>
                  );
                })}
              </div>

              <div className="skk-chart-labels">
                <div className="skk-chart-legend">
                  <div className="skk-chart-legend-dot" style={{ background: "#34D399" }} />
                  <span>Keuntungan dari Investasi</span>
                </div>
                <div className="skk-chart-legend">
                  <div className="skk-chart-legend-dot" style={{ background: "#384DB8" }} />
                  <span>Modal yang Kamu Masukkan</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
