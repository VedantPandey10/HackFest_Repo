import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, Lock, Mail, BrainCircuit, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { PasswordInput } from './PasswordInput';

interface OwnerLoginPageProps {
  onSuccess: (role: 'OWNER', data: any) => void;
  onBack: () => void;
}

export const OwnerLoginPage: React.FC<OwnerLoginPageProps> = ({ onSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      if (authData.user) {
        // Fetch profile to verify role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError) throw profileError;

        if (profile.role !== 'owner') {
          throw new Error("Access Denied: You do not have owner privileges.");
        }

        onSuccess('OWNER', { ...authData.user, ...profile });
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Premium Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] bg-indigo-600/10 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] bg-blue-600/10 pointer-events-none" />

      <div className="w-full max-w-xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3.5rem] p-12 shadow-2xl shadow-indigo-500/10"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-indigo-500/20"
            >
              <ShieldCheck size={40} className="text-white" />
            </motion.div>
            
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center">
                <BrainCircuit size={14} className="text-white" />
              </div>
              <span className="text-sm font-black tracking-[0.2em] text-white/50 uppercase italic">
                Reincrew<span className="text-indigo-500">.AI</span>
              </span>
            </div>
            
            <h1 className="text-4xl font-black tracking-tight text-white mb-3">Owner Control</h1>
            <p className="text-slate-400 font-medium tracking-tight">Access the core platform oversight node.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute left-6 inset-y-0 flex items-center text-slate-500 group-focus-within:text-indigo-500 transition-colors pointer-events-none">
                  <Mail size={18} />
                </div>
                <input 
                  type="email"
                  placeholder="Master Email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-sm outline-none focus:border-indigo-500 text-white transition-all font-medium"
                />
              </div>

              <div className="relative group">
                <PasswordInput 
                  value={password}
                  onChange={setPassword}
                  placeholder="Universal Password"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <Loader2 size={20} className="animate-spin" />
                  <span className="text-xs uppercase tracking-widest">Validating...</span>
                </div>
              ) : (
                <>
                  <span className="text-sm uppercase tracking-widest">Authorize Access</span>
                  <ArrowRight size={20} strokeWidth={3} className="shrink-0" />
                </>
              )}
            </button>

            <button 
              type="button"
              onClick={onBack}
              className="w-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors py-2"
            >
               Return to Landing
            </button>
          </form>
        </motion.div>
        
        {/* Footer info */}
        <p className="mt-8 text-center text-[9px] font-black uppercase tracking-[0.3em] text-white/10">
          Reicrew Neural Core Oversight System
        </p>
      </div>
    </div>
  );
};
