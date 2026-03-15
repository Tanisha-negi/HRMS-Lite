import React from 'react';

const FlashMessage = ({ message, type, onClose, onConfirm }) => {
  if (!message) return null;

  const title = type === 'confirm' ? 'Confirm Action' : type === 'success' ? 'Success' : 'Alert';
  const actionColor = type === 'confirm' || type === 'error' ? 'text-blue-600' : 'text-emerald-600';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div 
        className="absolute inset-0 bg-slate-900/5 animate-in fade-in duration-300" 
        onClick={type !== 'confirm' ? onClose : undefined} 
      />
      
      <div className="relative bg-[#F8F9FA] border border-slate-200 w-full max-w-[440px] rounded-[28px] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex flex-col gap-4">
          
          <h3 className="text-[24px] font-medium text-slate-900 leading-tight">
            {title}
          </h3>
          <p className="text-[16px] text-slate-600 leading-relaxed">
            {message}
          </p>

          <div className="flex justify-end gap-6 mt-4">
            {type === 'confirm' ? (
              <>
                <button 
                  onClick={onClose}
                  className="text-[14px] font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-wide px-2 py-1"
                >
                  Cancel
                </button>
                <button 
                  onClick={onConfirm}
                  className="text-[14px] font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-wide px-2 py-1"
                >
                  Delete
                </button>
              </>
            ) : (
              <button 
                onClick={onClose}
                className={`text-[14px] font-bold ${actionColor} hover:opacity-70 transition-opacity uppercase tracking-wide px-2 py-1`}
              >
                Okay
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashMessage;