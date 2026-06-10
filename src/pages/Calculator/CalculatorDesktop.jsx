import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import LoanSimulatorCalc from "./LoanSimulatorCalc";
import DebtPayoffCalc from "./DebtPayoffCalc";
import "./Calculator.css";

const TABS = [
  { id: "loan", label: "Loan Simulator", icon: "🏦" },
  { id: "debt", label: "Debt Payoff",    icon: "💳" },
];

export default function CalculatorDesktop() {
  const [activeTab, setActiveTab] = useState("loan");

  return (
    <div className="calc-root">
      <Sidebar />

      <main className="calc-main" style={{ minWidth: 0 }}>
        {/* ── Page Header ── */}
        <div className="calc-page-header">
          <div className="calc-page-eyebrow">Financial Calculator Tools</div>
          <h1 className="calc-page-title">
            Kalkulator <span>Keuangan</span>
          </h1>
          <p className="calc-page-sub">
            Hitung cicilan pinjaman dan rencanakan pelunasan hutangmu dengan mudah
          </p>
        </div>

        {/* ── Tab Switcher ── */}
        <div className="calc-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`calc-tab${activeTab === tab.id ? " active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="calc-tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Active Calculator ── */}
        {activeTab === "loan" && <LoanSimulatorCalc />}
        {activeTab === "debt" && <DebtPayoffCalc />}
      </main>
    </div>
  );
}
