import React, { useState } from "react";
import "./SimulasiKelolaKeuangan.css";
import Sidebar             from "../../components/Sidebar.jsx";
import LoanSimulator       from "./LoanSimulator.jsx";
import BudgetSimulator     from "./BudgetSimulator.jsx";
import InvestasiSimulator  from "./InvestasiSimulator.jsx";
import DebtPayoff          from "./DebtPayoff.jsx";

/* ── Definisi tab ── */
const TABS = [
  { key: "loan",   label: "Loan Simulator",    icon: "🏦" },
  { key: "budget", label: "Budgeting 50/30/20", icon: "🥧" },
  { key: "invest", label: "Investasi",          icon: "📈" },
  { key: "debt",   label: "Debt Payoff",        icon: "💳" },
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

        {/* Konten per tab */}
        {activeTab === "loan"   && <LoanSimulator />}
        {activeTab === "budget" && <BudgetSimulator />}
        {activeTab === "invest" && <InvestasiSimulator />}
        {activeTab === "debt"   && <DebtPayoff />}

      </div>
    </div>
  );
}
