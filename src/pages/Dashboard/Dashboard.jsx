import React from "react";
import Sidebar from '../../components/Layout/sidebar';
import styles from "./Dashboard.module.css";

// 1. PINDAHKAN SUB-KOMPONEN KE ATAS
const NavItem = ({ icon, label, active = false }) => (
    <div className={`flex items-center w-full py-3 px-4 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>
        <img src={icon} className="w-5 h-5 mr-4" alt={label} />
        <span className="text-lg font-medium">{label}</span>
    </div>
);

const BottomNavItem = ({ icon, label, active = false }) => (
    <div className="flex flex-col items-center gap-1">
        <img src={icon} className="w-6 h-6" alt={label} />
        <span className={`text-[10px] ${active ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>{label}</span>
    </div>
);

const ProgressBar = ({ label, current, total, color }) => (
    <div className="w-full">
        <div className="flex justify-between text-xs mb-1">
            <span>{label}</span>
            <span>{current}/{total}</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div className={`${color} h-full`} style={{ width: `${(current / total) * 100}%` }}></div>
        </div>
    </div>
);

const ModuleCard = ({ title, desc, progress, icon }) => (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-4">
            <img src={icon} className="w-10 h-10" alt={title} />
            <h4 className="font-bold text-gray-800 leading-tight">{title}</h4>
        </div>
        <p className="text-xs text-gray-500 mb-6 h-8 line-clamp-2">{desc}</p>
        <div className="flex justify-between text-[10px] mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full" style={{ width: `${progress}%` }}></div>
        </div>
    </div>
);

// 2. FUNGSI UTAMA DENGAN NAMA
const Dashboard = (props) => {
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-white md:bg-[#FBF8F8]">
            
            {/* SIDEBAR DESKTOP */}
            <aside className="hidden md:flex flex-col shrink-0 items-center bg-white py-12 w-[300px] border-r border-gray-200">
                <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/ytjx81y7_expires_30_days.png" className="w-24 h-24 mb-6 object-contain" alt="logo" />
                <span className="text-[#374DB7] text-3xl font-bold mb-10">FinSmart</span>
                <div className="w-4/5 h-[1px] bg-gray-200 mb-10"></div>
                
                <nav className="flex flex-col items-start w-full px-6 gap-4 flex-1">
                    <NavItem icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/ynna27hr_expires_30_days.png" label="Dashboard" active />
                    <NavItem icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/nfimvwf9_expires_30_days.png" label="Learning Modules" />
                    <NavItem icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/0v0e2ppa_expires_30_days.png" label="Quizzes" />
                    <NavItem icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/v7kk5jow_expires_30_days.png" label="Calculators" />
                    <NavItem icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/tw0hmh3y_expires_30_days.png" label="Profile" />
                </nav>

                <button className="flex items-center bg-[#F44336] text-white py-3 px-8 gap-2 rounded-full mt-10 hover:bg-red-600 transition-colors" onClick={() => alert("Sign Out")}>
                    <span className="font-semibold">Sign Out</span>
                </button>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col pb-24 md:pb-12">
                <header className="flex md:hidden items-center justify-between bg-[#D9D9D9] px-6 py-4 mb-8">
                    <div className="flex items-center gap-3">
                        <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/s9slnt40_expires_30_days.png" className="w-12 h-10" alt="logo" />
                        <span className="text-[#374DB7] text-xl font-bold">FinSmart</span>
                    </div>
                    <button className="text-[#F44336] font-semibold">Keluar</button>
                </header>

                <div className="px-6 md:px-12 md:mt-12">
                    <h1 className="text-2xl md:text-4xl font-bold mb-2">Selamat Datang, Faris!</h1>
                    <p className="text-gray-600 mb-8">Lanjutkan perjalanan literasi keuangan Anda hari ini</p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                        {/* Progress Card */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
                            <div 
                                className="relative flex items-center justify-center w-24 h-24 bg-contain bg-no-repeat bg-center"
                                style={{ backgroundImage: `url('https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/9xznmoti_expires_30_days.png')` }}
                            >
                                <div className="text-center">
                                    <p className="font-bold text-lg">75%</p>
                                    <p className="text-[10px]">Complete</p>
                                </div>
                            </div>
                            <div className="flex-1 w-full">
                                <ProgressBar label="Modul Selesai" current={12} total={16} color="bg-emerald-400" />
                                <div className="mt-4"></div>
                                <ProgressBar label="Kuis Selesai" current={8} total={12} color="bg-emerald-400" />
                            </div>
                        </div>

                        {/* Daily Quiz Card */}
                        <div className="bg-[#5934D3] md:bg-emerald-400 p-6 rounded-3xl text-white flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold mb-2">Daily Quiz</h3>
                                <p className="text-sm opacity-90 mb-6">Uji pengetahuan Anda dengan kuis harian!</p>
                            </div>
                            <div className="flex justify-between items-end">
                                <p className="text-3xl font-bold">5</p>
                                <button className="bg-white text-[#5934D3] px-6 py-2 rounded-full font-bold">Mulai</button>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold mb-6">Module Terbaru</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ModuleCard title="Manajemen Utang" progress={60} desc="Pelajari cara mengelola utang" icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/9ex6qtg0_expires_30_days.png" />
                        <ModuleCard title="Dasar Investasi" progress={30} desc="Pahami konsep investasi" icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/9o2amfno_expires_30_days.png" />
                        <ModuleCard title="Dasar Penganggaran" progress={0} desc="Kelola anggaran bulanan" icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/ap2njfpg_expires_30_days.png" />
                    </div>
                </div>
            </main>

            {/* BOTTOM NAVIGATION */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#D9D9D9] flex justify-around py-3 border-t border-gray-300">
                <BottomNavItem icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/l8vbbthh_expires_30_days.png" label="Dash" active />
                <BottomNavItem icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/7js6b9ig_expires_30_days.png" label="Modules" />
                <BottomNavItem icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/uxrv2oe0_expires_30_days.png" label="Quiz" />
                <BottomNavItem icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/paprowbp_expires_30_days.png" label="Profile" />
            </nav>
        </div>
    );
};

export default Dashboard;