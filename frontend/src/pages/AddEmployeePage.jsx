import React, { useState } from 'react';
import { UserPlus, User, Hash, Briefcase, Mail, CheckCircle2 } from 'lucide-react';
import { addEmployee } from '../api';
import FlashMessage from '../components/FlashMessage'; 

const AddEmployeePage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    employee_id: '',
    email: '',
    department: 'Engineering'
  });

  const [flash, setFlash] = useState({ message: '', type: '', onConfirm: null });

  const triggerFlash = (message, type, onConfirm = null) => {
    setFlash({ message, type, onConfirm });
    if (type !== 'confirm') {
      setTimeout(() => setFlash({ message: '', type: '', onConfirm: null }), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addEmployee(formData);
      
      triggerFlash("New employee has been onboarded successfully!", "success");
      
      setFormData({ full_name: '', employee_id: '', email: '', department: 'Engineering' });
    } catch (err) {
      triggerFlash("Error adding employee. Please check your connection.", "error");
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 text-center">
        <h2 className="text-[28px] font-black text-[#1E3A8A] tracking-tighter">Onboard New Talent</h2>
        <p className="text-xs text-slate-600 font-bold uppercase tracking-widest mt-1">Fill in the details below</p>
      </div>

      <div className="bg-white rounded-xl border-2 border-slate-300 shadow-2xl p-8 max-w-md mx-auto relative">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase text-slate-700 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-500" size={16} />
              <input 
                required
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm font-bold text-slate-800 focus:border-[#1E3A8A] focus:ring-0 transition-all outline-none"
                placeholder="e.g. Tanisha Negi"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase text-slate-700 ml-1">Employee ID</label>
            <div className="relative">
              <Hash className="absolute left-3 top-3 text-slate-500" size={16} />
              <input 
                required
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm font-bold text-[#1E3A8A] font-mono focus:border-[#1E3A8A] focus:ring-0 outline-none"
                placeholder="EMP-001"
                value={formData.employee_id}
                onChange={(e) => setFormData({...formData, employee_id: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase text-slate-700 ml-1">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-500" size={16} />
              <input 
                type="email"
                required
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm font-bold text-slate-800 focus:border-[#1E3A8A] focus:ring-0 outline-none"
                placeholder="tanisha@company.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase text-slate-700 ml-1">Department</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 text-slate-500" size={16} />
              <select 
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm appearance-none focus:border-[#1E3A8A] focus:ring-0 outline-none text-slate-800 font-bold"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
              >
                <option>Engineering</option>
                <option>Human Resources</option>
                <option>Design</option>
                <option>Marketing</option>
              </select>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 rounded-xl font-black text-[13px] uppercase tracking-widest transition-all mt-4 flex items-center justify-center gap-2 shadow-lg bg-[#1E3A8A] text-white hover:bg-slate-900 shadow-blue-900/20"
          >
            <UserPlus size={18} /> Add Employee
          </button>
        </form>
      </div>

      <FlashMessage 
        {...flash} 
        onClose={() => setFlash({ message: '', type: '', onConfirm: null })} 
      />
    </div>
  );
};

export default AddEmployeePage;