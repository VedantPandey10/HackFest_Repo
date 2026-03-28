import React from 'react';
import { User, Settings, LogOut, ChevronRight } from 'lucide-react';

interface AccountDropdownProps {
  onProfile: () => void;
  onSettings: () => void;
  onLogout: () => void;
  userName: string;
  userEmail: string;
}

export const AccountDropdown: React.FC<AccountDropdownProps> = ({
  onProfile,
  onSettings,
  onLogout,
  userName,
  userEmail
}) => {
  return (
    <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
      <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">{userName}</p>
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate mt-0.5">{userEmail}</p>
      </div>
      
      <div className="p-2">
        <button 
          onClick={onProfile}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500 group-hover:bg-brand-500 group-hover:text-white transition-all">
              <User size={18} />
            </div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">User Profile</span>
          </div>
          <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
        </button>

        <button 
          onClick={onSettings}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-all">
              <Settings size={18} />
            </div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">Settings</span>
          </div>
          <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="p-2 border-t border-slate-100 dark:border-white/5">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 p-4 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/10 flex items-center justify-center text-red-500 transition-all">
            <LogOut size={18} />
          </div>
          <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">Logout Session</span>
        </button>
      </div>
    </div>
  );
};
