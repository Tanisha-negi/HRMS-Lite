import React from 'react';
import { LayoutGrid, UserPlus, CalendarCheck } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'add', label: 'Add new Employee', icon: UserPlus },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
  ];

  return (
    <nav className="bg-white border-b border-[#F3F4F6] sticky top-0 z-50 font-sans shadow-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex items-center">
            <span className="text-lg font-black tracking-tight text-[#1E3A8A]">
              HRMS<span className="text-[#38BDF8]">LITE</span>
            </span>
          </div>

          <div className="flex gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-[#38BDF8]/10 text-[#1E3A8A] border border-[#38BDF8]/20'
                    : 'text-slate-500 hover:bg-[#F3F4F6] hover:text-[#1E3A8A]'
                }`}
              >
                <item.icon 
                  size={18} 
                  strokeWidth={activeTab === item.id ? 2.5 : 2}
                  className={activeTab === item.id ? 'text-[#1E3A8A]' : 'text-slate-400'} 
                />
                <span className={`text-[14px] font-semibold tracking-tight ${
                  activeTab === item.id ? 'block' : 'hidden md:block' 
                }`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;