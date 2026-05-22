import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* ── ICONS ─────────────────────────────────────────────── */
const IconDashboard = ({ color = "currentColor" }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V9.5Z"
      stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>
);
const IconLearning = ({ color = "currentColor" }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M4 19.5C4 18.1193 5.11929 17 6.5 17H20" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M6.5 2H20V22H6.5C5.11929 22 4 20.8807 4 19.5V4.5C4 3.11929 5.11929 2 6.5 2Z" stroke={color} strokeWidth="1.8"/>
    <path d="M8 7H16M8 11H13" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const IconCalculator = ({ color = "currentColor" }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="3" width="16" height="18" rx="2" stroke={color} strokeWidth="1.8"/>
    <rect x="7" y="6" width="10" height="3" rx="1" stroke={color} strokeWidth="1.5"/>
    <circle cx="8" cy="13" r="1" fill={color}/>
    <circle cx="12" cy="13" r="1" fill={color}/>
    <circle cx="16" cy="13" r="1" fill={color}/>
    <circle cx="8" cy="17" r="1" fill={color}/>
    <circle cx="12" cy="17" r="1" fill={color}/>
    <circle cx="16" cy="17" r="1" fill={color}/>
  </svg>
);
const IconProfile = ({ color = "currentColor" }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.8"/>
    <path d="M4 20C4 17.2386 7.58172 15 12 15C16.4183 15 20 17.2386 20 20"
      stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const IconSimulasi = ({ color = "currentColor" }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M2 17L12 22L22 17" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12L12 17L22 12" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconSignOut = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

/* ── DATA ──────────────────────────────────────────────── */
const menuItems = [
  { label: "Dashboard",        path: "/dashboard",  Icon: IconDashboard  },
  { label: "Learning Modules", path: "/learning",   Icon: IconLearning   },
  { label: "Calculators",      path: "/calculator", Icon: IconCalculator },
  { label: "Simulasi",         path: "/simulasi",   Icon: IconSimulasi   },
  { label: "Profile",          path: "/profile",    Icon: IconProfile    },
];

/* ── STYLES ────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  /* ── Sidebar desktop ── */
  .sb-root {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 200px;
    min-width: 200px;
    min-height: 100vh;
    background: #fff;
    border-right: 1px solid #F0F0F0;
    padding: 28px 12px 24px;
    position: relative;
    z-index: 50;
    font-family: 'DM Sans', sans-serif;
    flex-shrink: 0;
  }

  /* subtle top gradient accent */
  .sb-root::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #384DB8, #34D399, #FFC107);
    border-radius: 0 0 4px 4px;
  }

  /* logo */
  .sb-logo-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
  }
  .sb-logo-img {
    width: 60px;
    height: 60px;
    border-radius: 16px;
    object-fit: cover;
    border: 2px solid #f0f0f0;
    box-shadow: 0 4px 14px rgba(56,77,184,.15);
    transition: transform .25s ease, box-shadow .25s ease;
  }
  .sb-logo-img:hover {
    transform: scale(1.06) rotate(-2deg);
    box-shadow: 0 8px 24px rgba(56,77,184,.25);
  }
  .sb-brand {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 800;
    line-height: 1;
  }
  .sb-brand-fin { color: #384DB8; }
  .sb-brand-edu { color: #FFC107; }

  /* divider */
  .sb-divider {
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
    margin: 18px 0 14px;
  }

  /* nav items */
  .sb-nav {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 4px;
    flex: 1;
  }

  .sb-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 12px;
    cursor: pointer;
    transition: background .2s, transform .15s, box-shadow .2s;
    position: relative;
    overflow: hidden;
    text-decoration: none;
    border: none;
    background: transparent;
    width: 100%;
    text-align: left;
  }
  .sb-item::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(56,77,184,.08), rgba(52,211,153,.06));
    opacity: 0;
    transition: opacity .2s;
    border-radius: 12px;
  }
  .sb-item:hover::before { opacity: 1; }
  .sb-item:hover { transform: translateX(3px); }

  .sb-item.active {
    background: linear-gradient(135deg, #EEF0FF, #E8FBF5);
    box-shadow: 0 2px 10px rgba(56,77,184,.1);
  }
  .sb-item.active::after {
    content: '';
    position: absolute;
    left: 0; top: 20%; bottom: 20%;
    width: 3px;
    background: linear-gradient(180deg, #384DB8, #34D399);
    border-radius: 0 4px 4px 0;
  }

  .sb-item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: transparent;
    transition: background .2s;
    flex-shrink: 0;
  }
  .sb-item.active .sb-item-icon {
    background: rgba(56,77,184,.12);
  }

  .sb-item-label {
    font-size: 13px;
    font-weight: 400;
    color: #374151;
    white-space: nowrap;
    transition: color .2s, font-weight .2s;
  }
  .sb-item.active .sb-item-label {
    color: #384DB8;
    font-weight: 600;
  }

  /* badge (opsional, bisa dihapus) */
  .sb-badge {
    margin-left: auto;
    background: #384DB8;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    padding: 1px 6px;
    border-radius: 99px;
    opacity: 0;
    transition: opacity .2s;
  }
  .sb-item:hover .sb-badge { opacity: .6; }
  .sb-item.active .sb-badge { opacity: 1; }

  /* sign out button */
  .sb-signout {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: calc(100% - 8px);
    padding: 10px 16px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #F44336, #e53935);
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    margin-top: 12px;
    transition: transform .15s, box-shadow .2s, opacity .2s;
    box-shadow: 0 4px 14px rgba(244,67,54,.25);
    letter-spacing: .2px;
  }
  .sb-signout:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(244,67,54,.35);
  }
  .sb-signout:active { transform: translateY(0); }

  /* ── BOTTOM NAV (mobile, YouTube-style) ── */
  .sb-bottom-nav {
    display: none;
    position: fixed;
    bottom: 0; left: 0; right: 0;
    height: 60px;
    background: #fff;
    border-top: 1px solid #f0f0f0;
    z-index: 100;
    align-items: stretch;
    box-shadow: 0 -4px 20px rgba(0,0,0,.06);
  }
  /* top accent line on bottom nav */
  .sb-bottom-nav::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, #384DB8, #34D399, #FFC107, #F44336);
  }

  .sb-bn-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    cursor: pointer;
    border: none;
    background: transparent;
    padding: 6px 4px;
    position: relative;
    transition: transform .15s;
    -webkit-tap-highlight-color: transparent;
  }
  .sb-bn-item:active { transform: scale(.92); }

  .sb-bn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 28px;
    border-radius: 10px;
    transition: background .2s;
    position: relative;
  }
  .sb-bn-item.active .sb-bn-icon {
    background: linear-gradient(135deg, #EEF0FF, #E8FBF5);
  }

  /* active pill indicator on bottom nav */
  .sb-bn-item.active .sb-bn-icon::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 3px;
    background: linear-gradient(90deg, #384DB8, #34D399);
    border-radius: 99px;
  }

  .sb-bn-label {
    font-size: 10px;
    font-weight: 400;
    color: #9ca3af;
    transition: color .2s, font-weight .2s;
    font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
  }
  .sb-bn-item.active .sb-bn-label {
    color: #384DB8;
    font-weight: 600;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .sb-root       { display: none; }
    .sb-bottom-nav { display: flex; }
  }

  @media (min-width: 769px) {
    .sb-bottom-nav { display: none !important; }
  }

  /* Spacer — tidak digunakan sebagai flex child, padding di .main sudah cukup */
  .sb-bottom-spacer {
    display: none !important;
  }

  /* animate item masuk */
  @keyframes sbItemIn {
    from { opacity: 0; transform: translateX(-10px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .sb-item {
    animation: sbItemIn .35s ease both;
  }
  .sb-item:nth-child(1) { animation-delay: .05s; }
  .sb-item:nth-child(2) { animation-delay: .10s; }
  .sb-item:nth-child(3) { animation-delay: .15s; }
  .sb-item:nth-child(4) { animation-delay: .20s; }
  .sb-item:nth-child(5) { animation-delay: .25s; }
`;

/* ── COMPONENT ─────────────────────────────────────────── */
export default function Sidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const go = (path) => navigate(path);

  return (
    <>
      <style>{css}</style>

      {/* ══════════════════════════
          DESKTOP SIDEBAR
      ══════════════════════════ */}
      <div className="sb-root">

        {/* Logo */}
        <div className="sb-logo-wrap">
          <img src="/logo-finedu.jpeg" className="sb-logo-img" alt="FinEdu Logo" />
          <span className="sb-brand">
            <span className="sb-brand-fin">Fin</span>
            <span className="sb-brand-edu">Edu</span>
          </span>
        </div>

        <div className="sb-divider" />

        {/* Nav */}
        <nav className="sb-nav">
          {menuItems.map(({ label, path, Icon }) => {
            const isActive = location.pathname === path;
            const iconColor = isActive ? '#384DB8' : '#6b7280';
            return (
              <button
                key={path}
                className={`sb-item${isActive ? ' active' : ''}`}
                onClick={() => go(path)}
              >
                <span className="sb-item-icon">
                  <Icon color={iconColor} />
                </span>
                <span className="sb-item-label">{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sign Out */}
        <button className="sb-signout" onClick={() => go('/login')}>
          <IconSignOut />
          Sign Out
        </button>
      </div>

      {/* ══════════════════════════
          MOBILE BOTTOM NAV
          (YouTube / Instagram style)
      ══════════════════════════ */}
      <nav className="sb-bottom-nav">
        {menuItems.map(({ label, path, Icon }) => {
          const isActive = location.pathname === path;
          const iconColor = isActive ? '#384DB8' : '#9ca3af';
          return (
            <button
              key={path}
              className={`sb-bn-item${isActive ? ' active' : ''}`}
              onClick={() => go(path)}
            >
              <span className="sb-bn-icon">
                <Icon color={iconColor} />
              </span>
              <span className="sb-bn-label">
                {label === 'Learning Modules' ? 'Learning' :
                 label === 'Calculators'      ? 'Calc'     :
                 label === 'Simulasi'         ? 'Simulasi' : label}
              </span>
            </button>
          );
        })}
        {/* Sign Out sebagai item ke-5 di mobile */}
        <button
          className="sb-bn-item"
          onClick={() => go('/login')}
          style={{ color: '#F44336' }}
        >
          <span className="sb-bn-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                stroke="#F44336" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="16 17 21 12 16 7" stroke="#F44336" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="#F44336" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="sb-bn-label" style={{ color: '#F44336' }}>Keluar</span>
        </button>
      </nav>

      {/* Spacer agar konten tidak tertutup bottom nav */}
      <div className="sb-bottom-spacer" />
    </>
  );
}
