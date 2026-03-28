import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Shield, Briefcase, Mail, Key, ShieldAlert, Cpu, Activity, Settings as SettingsIcon } from 'lucide-react';
import { Candidate, ProctoringSettings } from '../types';

interface AccountOverlayProps {
  mode: 'PROFILE' | 'SETTINGS';
  onClose: () => void;
  candidate: Candidate;
  onProctoringSettingsChange?: (settings: ProctoringSettings) => void;
}

export const AccountOverlay: React.FC<AccountOverlayProps> = ({ mode, onClose, candidate, onProctoringSettingsChange }) => {
  const settings = candidate.proctoringSettings || {
    eyeTracking: true,
    multiFace: true,
    tabSwitching: true
  };

  const handleToggle = (key: keyof ProctoringSettings) => {
    if (onProctoringSettingsChange) {
      onProctoringSettingsChange({
        ...settings,
        [key]: !settings[key]
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/5"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-8 pb-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${mode === 'PROFILE' ? 'bg-brand-500/10 text-brand-600' : 'bg-indigo-500/10 text-indigo-600'}`}>
              {mode === 'PROFILE' ? <User size={24} /> : <SettingsIcon size={24} />}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                {mode === 'PROFILE' ? 'Client Profile' : 'System Guard'}
              </h2>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                {mode === 'PROFILE' ? 'Identity Verification Node' : 'Configuration Node'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 pt-4 space-y-6">
          {mode === 'PROFILE' ? (
            <div className="space-y-4">
              <ProfileItem icon={<User size={18} />} label="Full Legal Name" value={candidate.name} />
              <ProfileItem icon={<Mail size={18} />} label="Primary Email" value={candidate.email} />
              <ProfileItem icon={<Key size={18} />} label="Security Hash" value={candidate.passwordHash || 'Not Set'} />
              <ProfileItem icon={<Briefcase size={18} />} label="Account Tier" value={candidate.plan || 'Standard Node'} />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5">
                  <Cpu size={20} className="text-brand-500 mb-2" />
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">AI Core</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">Optimized</p>
                </div>
                <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5">
                  <Activity size={20} className="text-indigo-500 mb-2" />
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Proctoring</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">High Sensitivity</p>
                </div>
              </div>

              <div className="space-y-3 p-4 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Security Parameters</p>
                <ToggleItem 
                  label="Eye Tracking Verification" 
                  isActive={settings.eyeTracking} 
                  onToggle={() => handleToggle('eyeTracking')} 
                />
                <ToggleItem 
                  label="Multi-Face Detection" 
                  isActive={settings.multiFace} 
                  onToggle={() => handleToggle('multiFace')} 
                />
                <ToggleItem 
                  label="Tab Switching Guard" 
                  isActive={settings.tabSwitching} 
                  onToggle={() => handleToggle('tabSwitching')} 
                />
              </div>
            </div>
          )}

          <button 
            onClick={onClose}
            className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-brand-500/20 uppercase tracking-widest text-sm"
          >
            {mode === 'PROFILE' ? 'Close Profile' : 'Acknowledge & Sync'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const ProfileItem = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5">
    <div className="text-slate-400">{icon}</div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-none">{value}</p>
    </div>
  </div>
);

const ToggleItem = ({ label, isActive, onToggle }: { label: string, isActive: boolean, onToggle: () => void }) => (
  <div className="flex items-center justify-between group">
    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-brand-500 transition-colors">{label}</span>
    <button 
      onClick={onToggle}
      className={`w-10 h-5 rounded-full relative transition-colors duration-300 border ${isActive ? 'bg-brand-500 border-brand-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'bg-slate-300 border-slate-400'}`}
    >
      <div className={`absolute top-0.5 bottom-0.5 w-3.5 bg-white rounded-full transition-all duration-300 shadow-sm ${isActive ? 'right-0.5' : 'left-0.5'}`} />
    </button>
  </div>
);
