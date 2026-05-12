import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";

export default function CalculatorDesktop() {
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
    const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
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
    <div className="flex min-h-screen" style={{ backgroundColor: '#FBF9F9' }}>
      <Sidebar />

      <div className="flex-1 pt-8 px-8 pb-8">
        <h1 className="text-[28px] font-bold text-[#000000] mb-1">Calculators</h1> {}
        <p className="text-sm text-gray-500 mb-6">Gunakan kalkulator untuk merencanakan keuangan Anda dengan lebih baik</p>

        <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)', maxWidth: '700px' }}>
          {/* Header Card */}
          <div className="flex items-center gap-3 mb-1">
            {}
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#34D399' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="3" width="16" height="18" rx="2" stroke="#FFFFFF" strokeWidth="1.8"/>
                <rect x="7" y="6" width="10" height="3" rx="1" stroke="#FFFFFF" strokeWidth="1.5"/>
                <circle cx="8" cy="13" r="1" fill="#FFFFFF"/><circle cx="12" cy="13" r="1" fill="#FFFFFF"/><circle cx="16" cy="13" r="1" fill="#FFFFFF"/>
                <circle cx="8" cy="17" r="1" fill="#FFFFFF"/><circle cx="12" cy="17" r="1" fill="#FFFFFF"/><circle cx="16" cy="17" r="1" fill="#FFFFFF"/>
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-[#000000]">Loan Simulator</h2>
              <p className="text-xs" style={{ color: '#5934D3' }}>Simulasi Pinjaman</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-5">Hitung cicilan bulanan dan total pembayaran untuk pinjaman Anda</p>

          {/* Input Row */}
          <div className="flex gap-4 mb-5">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-[#000000] mb-1">Loan Amount</label>
              <p className="text-xs text-gray-400 mb-2">Jumlah pinjaman (Rp)</p>
              <div className="flex items-center border rounded-lg px-3 py-2.5" style={{ borderColor: '#E0E0E0' }}>
                <span className="text-gray-500 mr-2 text-sm">$</span>
                <input type="text" value={loanAmount} onChange={(e) => setLoanAmount(formatRupiah(e.target.value))}
                  className="flex-1 outline-none text-sm text-[#000000] bg-transparent"/>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-[#000000] mb-1">Interest Rate</label>
              <p className="text-xs text-gray-400 mb-2">Suku Bunga (% pertahun)</p>
              <div className="flex items-center border rounded-lg px-3 py-2.5" style={{ borderColor: '#E0E0E0' }}>
                <span className="text-gray-500 mr-2 text-sm">%</span>
                <input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)}
                  className="flex-1 outline-none text-sm text-[#000000] bg-transparent"/>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-[#000000] mb-1">Loan Term</label>
              <p className="text-xs text-gray-400 mb-2">Jangka waktu (bulan)</p>
              <div className="flex items-center border rounded-lg px-3 py-2.5" style={{ borderColor: '#E0E0E0' }}>
                <span className="text-gray-500 mr-2 text-sm">📅</span>
                <input type="number" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)}
                  className="flex-1 outline-none text-sm text-[#000000] bg-transparent"/>
              </div>
            </div>
          </div>

          {/* Tombol */}
          <div className="flex gap-3">
            <button onClick={handleHitung} className="flex-1 py-3 rounded-xl border-0 cursor-pointer text-white text-sm font-semibold"
              style={{ backgroundColor: '#34D399' }}>Menghitung</button>
            <button onClick={handleReset} className="py-3 px-6 rounded-xl border cursor-pointer text-sm font-semibold"
              style={{ borderColor: '#E0E0E0', color: '#000000', backgroundColor: '#FFFFFF' }}>Reset</button>
          </div>

          {/* Hasil */}
          {result && (
            <div className="mt-5 grid grid-cols-3 gap-4">
              <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#F0FFF8' }}>
                <p className="text-xs text-gray-500 mb-1">Cicilan Bulanan</p>
                <p className="text-base font-bold" style={{ color: '#34D399' }}>{fmt(result.monthly)}</p>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#F0F3FF' }}>
                <p className="text-xs text-gray-500 mb-1">Total Pembayaran</p>
                <p className="text-base font-bold" style={{ color: '#384DB8' }}>{fmt(result.total)}</p>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#FFF5F5' }}>
                <p className="text-xs text-gray-500 mb-1">Total Bunga</p>
                <p className="text-base font-bold" style={{ color: '#F44336' }}>{fmt(result.totalInterest)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
