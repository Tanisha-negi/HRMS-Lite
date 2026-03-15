import React, { useState, useEffect } from 'react';
import { Users, Mail, Briefcase, Trash2, Loader2 } from 'lucide-react';
import { getEmployees, deleteEmployee } from '../api';
import FlashMessage from '../components/FlashMessage';

const DashboardPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [flash, setFlash] = useState({ message: '', type: '', onConfirm: null });

  const triggerFlash = (message, type, onConfirm = null) => {
    setFlash({ message, type, onConfirm });
    if (type !== 'confirm') {
      setTimeout(() => setFlash({ message: '', type: '', onConfirm: null }), 3000);
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await getEmployees();
      setEmployees(res.data);
    } catch (err) {
      triggerFlash("Failed to load employee directory.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDeleteClick = (id) => {
    triggerFlash(
      "This will permanently remove the employee from the directory.",
      "confirm",
      () => executeDelete(id) 
    );
  };

  const executeDelete = async (id) => {
    setFlash({ message: '', type: '', onConfirm: null });
    try {
      await deleteEmployee(id);
      fetchEmployees();
      triggerFlash("Employee deleted successfully.", "success");
    } catch (err) {
      triggerFlash("Delete failed. Please try again.", "error");
    }
  };

  return (
    <div className="animate-in fade-in duration-700 max-w-6xl mx-auto px-6 -mt-10 pt-0">
      
      <div className="w-full flex justify-between items-end py-8 border-b-2 border-slate-300 mb-0">
        <div>
          <h2 className="text-[32px] font-black text-[#1E3A8A] tracking-tighter leading-none">Team Directory</h2>
          <p className="text-slate-600 text-[13px] font-bold mt-2 tracking-wide uppercase">HRMS Management</p>
        </div>
        
        <div className="flex items-center gap-2 bg-[#1E3A8A] text-white px-4 py-2 rounded-xl shadow-lg">
          <Users size={14} className="text-[#38BDF8]" />
          <span className="text-[13px] font-black">
            {employees.length || 0} Employees
          </span>
        </div>
      </div>

      <div className="bg-white border-2 border-slate-300 shadow-2xl overflow-hidden rounded-b-xl">
        <div className="hidden md:grid grid-cols-[100px_1.2fr_160px_1.5fr_50px] gap-x-4 items-center px-6 py-4 bg-slate-200/70 border-b-2 border-slate-300 text-[12px] font-black text-slate-800 tracking-widest">
          <span>ID</span>
          <span>NAME</span>
          <span>DEPT</span>
          <span>EMAIL</span>
          <span className="text-right">ACT</span>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-4">
            <Loader2 className="animate-spin text-[#1E3A8A]" size={40} />
            <span className="text-sm font-black text-[#1E3A8A] uppercase tracking-widest">Loading...</span>
          </div>
        ) : (
          <div className="divide-y-2 divide-slate-200">
            {employees.map((emp) => (
              <div key={emp.id} className="grid grid-cols-1 md:grid-cols-[100px_1.2fr_160px_1.5fr_50px] gap-x-4 items-center px-6 py-3 hover:bg-slate-50 transition-all">

                <div className="truncate">
                  <p className="text-[14px] font-bold text-[#1E3A8A] font-mono">{emp.employee_id}</p>
                </div>

                <div className="truncate">
                  <p className="text-[14px] font-bold text-slate-700 truncate">
                    {emp.full_name}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-slate-700 truncate">
                  <Briefcase size={13} className="shrink-0 text-slate-500" />
                  <span className="text-[14px] font-bold truncate">{emp.department}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-700 truncate">
                  <Mail size={13} className="shrink-0 text-slate-500" />
                  <span className="text-[14px] font-bold truncate">{emp.email}</span>
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={() => handleDeleteClick(emp.id)}
                    className="p-2 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      <FlashMessage 
        {...flash} 
        onClose={() => setFlash({ message: '', type: '', onConfirm: null })} 
      />
    </div>
  );
};

export default DashboardPage;