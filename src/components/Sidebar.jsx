import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const IconDashboard = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V9.5Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>
);
const IconLearning = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 19.5C4 18.1193 5.11929 17 6.5 17H20" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M6.5 2H20V22H6.5C5.11929 22 4 20.8807 4 19.5V4.5C4 3.11929 5.11929 2 6.5 2Z" stroke={color} strokeWidth="1.8"/>
    <path d="M8 7H16M8 11H13" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const IconCalculator = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="3" width="16" height="18" rx="2" stroke={color} strokeWidth="1.8"/>
    <rect x="7" y="6" width="10" height="3" rx="1" stroke={color} strokeWidth="1.5"/>
    <circle cx="8" cy="13" r="1" fill={color}/><circle cx="12" cy="13" r="1" fill={color}/><circle cx="16" cy="13" r="1" fill={color}/>
    <circle cx="8" cy="17" r="1" fill={color}/><circle cx="12" cy="17" r="1" fill={color}/><circle cx="16" cy="17" r="1" fill={color}/>
  </svg>
);
const IconProfile = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.8"/>
    <path d="M4 20C4 17.2386 7.58172 15 12 15C16.4183 15 20 17.2386 20 20" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const IconSignOut = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="16 17 21 12 16 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="21" y1="12" x2="9" y2="12" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const iconMap = {
  "/dashboard": IconDashboard,
  "/learning": IconLearning,
  "/calculator": IconCalculator,
  "/profile": IconProfile,
};

const menuItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Learning Modules", path: "/learning" },
  { label: "Calculators", path: "/calculator" },
  { label: "Profile", path: "/profile" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex flex-col items-center bg-white py-8 shrink-0" style={{ width: '180px', minHeight: '100vh', borderRight: '1px solid #F0F0F0' }}>
      {}
      <img
        src="/logo-finedu.jpeg"
        style={{ width: '65px', height: '65px' }}
        className="mb-3 object-fill"
        alt="Logo"
      />
      <span className="font-bold mb-6" style={{ fontSize: '24px' }}>
        <span style={{ color: '#384DB8' }}>Fin</span>
        <span style={{ color: '#FFC107' }}>Edu</span>
      </span>
      <div className="w-full mb-5" style={{ height: '1px', backgroundColor: '#E0E0E0' }}></div>

      <div className="flex flex-col w-full px-2 gap-1 mb-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const IconComponent = iconMap[item.path];
          const iconColor = isActive ? '#0015FF' : '#000000';
          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-2 py-2.5 px-3 rounded-xl cursor-pointer transition-all"
              style={{
                backgroundColor: isActive ? '#E5E3FF' : 'transparent',
                color: isActive ? '#0015FF' : '#000000',
                fontWeight: isActive ? '600' : '400',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <IconComponent color={iconColor} />
              </span>
              <span className="text-sm">{item.label}</span>
            </div>
          );
        })}
      </div>

      <button
        className="flex items-center gap-2 py-2 px-5 rounded-[30px] border-0 cursor-pointer mt-8"
        style={{ backgroundColor: '#F44336' }}
        onClick={() => navigate('/login')}
      >
        <IconSignOut />
        <span className="text-white text-sm font-semibold">Sign Out</span>
      </button>
    </div>
  );
}
