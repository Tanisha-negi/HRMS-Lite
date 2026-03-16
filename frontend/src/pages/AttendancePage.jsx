import React, { useState, useEffect } from 'react';
import { Calendar, Loader2, Save, CheckCircle2, Coffee } from 'lucide-react';
import axios from 'axios';
import { getEmployees } from '../api';
import FlashMessage from '../components/FlashMessage'; 

const AttendancePage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState({});
  const [flash, setFlash] = useState({ message: '', type: '', onConfirm: null });

  const triggerFlash = (message, type, onConfirm = null) => {
    setFlash({ message, type, onConfirm });
    if (type !== 'confirm') {
      setTimeout(() => setFlash({ message: '', type: '', onConfirm: null }), 3000);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const empRes = await getEmployees();
        setEmployees(empRes.data);

        const attRes = await axios.get(`https://hrms-lite-f0w0.onrender.com/api/attendance/?date=${selectedDate}`);
        
        if (attRes && attRes.data) {
          const mapped = {};
          attRes.data.forEach(rec => {
            mapped[String(rec.employee)] = { status: rec.status };
          });
          setAttendanceData(mapped);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setAttendanceData({}); 
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [selectedDate]);

  const handleStatusChange = (empId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [String(empId)]: { status }
    }));
  };

  const handleSaveAll = async () => {
  if (Object.keys(attendanceData).length === 0) {
    triggerFlash("No attendance data to save.", "error");
    return;
  }

  setIsSaving(true);
  try {
    // We will save each record one by one to match your current Django view
    const promises = Object.keys(attendanceData).map(empId => {
      return axios.post(`https://hrms-lite-f0w0.onrender.com/api/attendance/`, {
        employee_id: empId,
        date: selectedDate,
        status: attendanceData[empId].status
      });
    });

    await Promise.all(promises); // Wait for all to finish

    triggerFlash("Attendance records saved successfully!", "success");
  } catch (err) {
    console.error("Save Error:", err.response?.data);
    triggerFlash("Failed to save records. Please try again.", "error");
  } finally {
    setIsSaving(false);
  }
};

  return (
    <div className="animate-in fade-in duration-700 max-w-5xl mx-auto px-6 -mt-10 pt-0">
      
      <div className="w-full flex justify-between items-end py-6 border-b-2 border-slate-300 mb-0">
        <div>
          <h2 className="text-[28px] font-black text-[#1E3A8A] tracking-tighter leading-none">Attendance Roster</h2>
          <p className="text-slate-600 text-[12px] font-bold mt-1.5 tracking-wide uppercase">
            Logs for {selectedDate}
          </p>
        </div>
        
        <div className="flex items-center gap-2.5 bg-white px-4 py-2 rounded-xl border-2 border-slate-300 shadow-lg">
          <Calendar size={16} className="text-[#1E3A8A]" />
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-sm font-black text-slate-800 outline-none cursor-pointer bg-transparent"
          />
        </div>
      </div>

      <div className="bg-white border-2 border-slate-300 shadow-2xl overflow-hidden rounded-b-xl">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
            <Loader2 className="animate-spin text-[#1E3A8A]" size={36} />
            <span className="text-xs font-black text-[#1E3A8A] uppercase tracking-widest">Syncing Records...</span>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-200/70 border-b-2 border-slate-300">
                <th className="px-6 py-4 text-[12px] font-black uppercase text-slate-900 tracking-widest">Employee Details</th>
                <th className="px-6 py-4 text-[12px] font-black uppercase text-slate-900 tracking-widest text-right">Status Selection</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100">
              {employees.map((emp) => {
                const currentStatus = attendanceData[String(emp.id)]?.status;
                return (
                  <tr key={emp.id} className="hover:bg-slate-50 transition-all">
                    <td className="px-6 py-3">
                      <div className="flex flex-col">
                        <span className="text-[16px] font-extrabold text-slate-900 leading-tight">{emp.full_name}</span>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                          {emp.department} • <span className="font-mono text-[#1E3A8A] font-black">{emp.employee_id}</span>
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-3">
                      <div className="flex justify-end gap-2.5">
                        <button
                          onClick={() => handleStatusChange(emp.id, 'Present')}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-black uppercase transition-all border-2 ${
                            currentStatus === 'Present' 
                            ? 'bg-emerald-600 border-emerald-700 text-white shadow-md' 
                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'
                          }`}
                        >
                          <CheckCircle2 size={14} /> Present
                        </button>
                        
                        <button
                          onClick={() => handleStatusChange(emp.id, 'Leave')}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-black uppercase transition-all border-2 ${
                            currentStatus === 'Leave' 
                            ? 'bg-orange-600 border-orange-700 text-white shadow-md' 
                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'
                          }`}
                        >
                          <Coffee size={14} /> Leave
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button 
          onClick={handleSaveAll}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[#1E3A8A] text-white px-8 py-3.5 rounded-xl text-[12px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          {isSaving ? 'Saving...' : 'Save Records'}
        </button>
      </div>

      <FlashMessage 
        {...flash} 
        onClose={() => setFlash({ message: '', type: '', onConfirm: null })} 
      />
    </div>
  );
};

export default AttendancePage;