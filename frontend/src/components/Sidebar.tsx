import * as React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  UserPlus, 
  LogOut,
  BrainCircuit
} from 'lucide-react';

export type SidebarView = 'DASHBOARD' | 'REPORTS' | 'ANALYTICS' | 'INTERVIEW_FLOW';

interface SidebarProps {
  activeView: SidebarView;
  onViewChange: (view: SidebarView) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, onLogout }) => {
  const menuItems = [
    { id: 'DASHBOARD' as SidebarView, label: 'User Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'REPORTS' as SidebarView, label: 'Reports', icon: <FileText size={20} /> },
    { id: 'ANALYTICS' as SidebarView, label: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'INTERVIEW_FLOW' as SidebarView, label: 'Take Interview', icon: <UserPlus size={20} /> },
  ];

  return (
    <aside className="w-64 h-full glass-panel flex flex-col border-r border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="p-6 flex items-center gap-3 text-indigo-500">
        <div className="p-2 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20">
          <BrainCircuit size={28} strokeWidth={2.5} className="animate-float" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tighter shimmer-text">Reincrew AI</h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Company</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeView === item.id
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span className={`${activeView === item.id ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'} transition-colors`}>
              {item.icon}
            </span>
            <span className="font-semibold text-sm">{item.label}</span>
            {activeView === item.id && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-50" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-semibold text-sm">Log Out</span>
        </button>
      </div>
    </aside>
  );
};
