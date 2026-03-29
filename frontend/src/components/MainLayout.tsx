import * as React from 'react';
import { Sidebar, SidebarView } from './Sidebar';
import { Settings, User, Diamond, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { Candidate } from '../types';
import { AccountDropdown } from './AccountDropdown';
import { AccountOverlay } from './AccountOverlay';

interface MainLayoutProps {
  children: React.ReactNode;
  activeView: SidebarView;
  onViewChange: (view: SidebarView) => void;
  onLogout: () => void;
  candidate: Candidate;
  onProctoringSettingsChange?: (settings: any) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  activeView, 
  onViewChange, 
  onLogout,
  candidate,
  onProctoringSettingsChange
}) => {
  const { theme, toggleTheme } = useTheme();
  const [showAccountMenu, setShowAccountMenu] = React.useState(false);
  const [overlayMode, setOverlayMode] = React.useState<'PROFILE' | 'SETTINGS' | null>(null);

  const userName = candidate?.name || 'User';
  const userEmail = candidate?.email || 'user@example.com';

  return (
    <div className={`flex h-screen w-screen overflow-hidden transition-colors duration-300 bg-bg-main text-text-main`}>
      <Sidebar 
        activeView={activeView} 
        onViewChange={onViewChange} 
        onLogout={onLogout} 
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex-none flex items-center justify-between px-8 border-b border-slate-200 dark:border-slate-800 glass-panel z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold tracking-tight text-slate-700 dark:text-slate-200 uppercase">
              {activeView.replace('_', ' ')}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
              <ThemeToggle />
            </div>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />

            <div className="flex items-center gap-3 relative">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{userName}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{candidate?.plan || 'Professional'}</p>
              </div>
              <div 
                className="relative cursor-pointer"
                onClick={() => setShowAccountMenu(!showAccountMenu)}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform">
                  {(userName || 'U').charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-lg bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-sm" />
                
                {showAccountMenu && (
                  <AccountDropdown 
                    userName={userName}
                    userEmail={userEmail}
                    onProfile={() => {
                      setOverlayMode('PROFILE');
                      setShowAccountMenu(false);
                    }}
                    onSettings={() => {
                      setOverlayMode('SETTINGS');
                      setShowAccountMenu(false);
                    }}
                    onLogout={onLogout}
                  />
                )}
              </div>
              <button className="p-2 rounded-xl glass-card text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all active:scale-95">
                <Diamond size={20} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8 relative">
          <div className="max-w-7xl mx-auto h-full animate-fade-in">
            {children}
          </div>
        </main>
      </div>

      {overlayMode && (
        <AccountOverlay 
          mode={overlayMode} 
          onClose={() => setOverlayMode(null)} 
          candidate={candidate}
          onProctoringSettingsChange={onProctoringSettingsChange}
        />
      )}
    </div>
  );
};
