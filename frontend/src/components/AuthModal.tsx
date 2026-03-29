import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock, ArrowRight, ShieldCheck, UserPlus, LogIn, ChevronDown } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { JobPost } from '../types';
import { PasswordInput } from './PasswordInput';
import { supabase } from '../services/supabaseClient';

export type AuthMode = 'CANDIDATE_LOGIN' | 'CANDIDATE_REGISTER' | 'ADMIN_LOGIN' | 'ADMIN_REGISTER';

interface AuthModalProps {
  initialMode: AuthMode;
  onClose: () => void;
  onSuccess: (role: 'ADMIN' | 'CANDIDATE', data: any) => void;
  onAdminRegistrationRedirect?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ initialMode, onClose, onSuccess, onAdminRegistrationRedirect }) => {
  const [mode, setMode] = React.useState<AuthMode>(initialMode);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    username: '',
    password: '',
    position: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [jobs, setJobs] = React.useState<JobPost[]>([]);

  React.useEffect(() => {
    const availableJobs = StorageService.getJobs();
    setJobs(availableJobs);
    // Set default position if jobs exist
    if (availableJobs.length > 0 && !formData.position) {
      setFormData(prev => ({ ...prev, position: availableJobs[0].title }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const isCandidate = mode.startsWith('CANDIDATE');
    const isRegister = mode.endsWith('REGISTER');
    const isAdmin = mode.startsWith('ADMIN');

    try {
      if (isRegister) {
        // --- REGISTRATION ---
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name || '',
              role: isCandidate ? 'candidate' : 'ADMIN',
              position: formData.position || ''
            }
          }
        });

        if (authError) throw authError;

        if (authData.user) {
          setMode(isCandidate ? 'CANDIDATE_LOGIN' : 'ADMIN_LOGIN');
          setError("Account created! Please login.");
        }
      } else {
        // --- LOGIN ---
        const loginEmail = formData.email.trim();

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: formData.password
        });

        if (authError) throw authError;

        if (authData.user) {
          // Fetch additional profile data
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          if (profileError) throw profileError;

          // Check enterprise approval if Admin
          if (profile.role === 'ADMIN') {
            const { data: request, error: reqError } = await supabase
              .from('enterprise_requests')
              .select('status')
              .eq('email', profile.email)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();

            if (!request || request.status !== 'approved') {
              const status = request?.status || 'pending';
              throw new Error(`Access Denied: Your enterprise registration is currently ${status}. Please contact the platform owner.`);
            }
          }

          onSuccess(profile.role === 'ADMIN' ? 'ADMIN' : 'CANDIDATE', {
            ...authData.user,
            ...profile
          });
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-blue-900/20 dark:bg-slate-950/90 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-md rounded-[3.5rem] overflow-hidden bg-white/90 dark:bg-slate-950/80 backdrop-blur-2xl border-2 border-blue-200 dark:border-indigo-500/30 shadow-2xl shadow-blue-200/30 dark:shadow-black/40"
      >
        {/* Header */}
        <div className="px-6 pt-10 pb-6 text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-8 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="w-16 h-16 rounded-3xl bg-blue-100 dark:bg-indigo-600/20 flex items-center justify-center mx-auto mb-6 border border-blue-200 dark:border-indigo-500/30 shadow-inner">
            {mode.startsWith('ADMIN') ? <ShieldCheck className="text-blue-600 dark:text-indigo-400" /> : <User className="text-blue-600 dark:text-indigo-400" />}
          </div>
          
          <h2 className="text-3xl font-black tracking-tighter mb-2 text-slate-900 dark:text-white">
            {mode === 'CANDIDATE_LOGIN' && "Welcome Back"}
            {mode === 'CANDIDATE_REGISTER' && "Create Account"}
            {mode === 'ADMIN_LOGIN' && "Admin Portal"}
            {mode === 'ADMIN_REGISTER' && "Admin Registration"}
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {mode.startsWith('ADMIN') ? "Enter encrypted credentials to proceed." : "Access your unique assessment node."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-10 flex flex-col items-center space-y-6">
          {error && (
            <div className="w-full bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-red-400 text-center">
              {error}
            </div>
          )}

          <div className="w-full space-y-4">
            {mode === 'CANDIDATE_REGISTER' && (
              <input 
                placeholder="Full Name"
                required
                className="w-full h-14 bg-blue-100/50 dark:bg-white/5 border border-blue-200/50 dark:border-white/10 rounded-2xl px-6 text-sm outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition-all font-medium"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            )}
            
            {(mode === 'CANDIDATE_LOGIN' || mode === 'CANDIDATE_REGISTER' || mode === 'ADMIN_REGISTER') && (
              <input 
                type="email"
                placeholder="Email Address"
                required
                className="w-full h-14 bg-blue-100/50 dark:bg-white/5 border border-blue-200/50 dark:border-white/10 rounded-2xl px-6 text-sm outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition-all font-medium"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            )}
            
            {(mode === 'ADMIN_LOGIN') && (
              <input 
                type="email"
                placeholder="Admin Email"
                required
                className="w-full h-14 bg-blue-100/50 dark:bg-white/5 border border-blue-200/50 dark:border-white/10 rounded-2xl px-6 text-sm outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition-all font-medium"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            )}

            {(mode === 'ADMIN_REGISTER') && (
              <input 
                placeholder="Username"
                required
                className="w-full h-14 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 text-sm outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition-all font-medium"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
              />
            )}

            {mode === 'CANDIDATE_REGISTER' && (
              <div className="relative group">
                <select 
                  required
                  className="w-full h-14 bg-blue-100/50 dark:bg-white/5 border border-blue-200/50 dark:border-white/10 rounded-2xl px-6 pr-12 text-sm outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition-all font-medium appearance-none cursor-pointer"
                  value={formData.position}
                  onChange={e => setFormData({ ...formData, position: e.target.value })}
                >
                  <option value="" disabled className="bg-white dark:bg-slate-900">Select Position Applied For</option>
                  {jobs.map(job => (
                    <option key={job.id} value={job.title} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {job.title}
                    </option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                  <ChevronDown size={18} />
                </div>
              </div>
            )}

            <PasswordInput 
              value={formData.password}
              onChange={val => setFormData({ ...formData, password: val })}
              placeholder="Password"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full min-h-[4rem] px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[2rem] shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
          >
            {loading ? <span className="text-[10px] uppercase tracking-widest">Optimizing...</span> : (
              <>
                <span className="text-sm uppercase tracking-widest">
                  {mode.endsWith('REGISTER') ? "Create Account" : "Access Node"}
                </span>
                <ArrowRight size={20} strokeWidth={3} className="shrink-0" />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            {mode === 'CANDIDATE_LOGIN' && (
              <button 
                type="button" 
                onClick={() => setMode('CANDIDATE_REGISTER')}
                className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-white transition-colors"
              >
                New candidate? Create account
              </button>
            )}
            {mode === 'CANDIDATE_REGISTER' && (
              <button 
                type="button" 
                onClick={() => setMode('CANDIDATE_LOGIN')}
                className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-white transition-colors"
              >
                Already registered? Login here
              </button>
            )}
            {mode === 'ADMIN_LOGIN' && (
              <button 
                type="button" 
                onClick={onAdminRegistrationRedirect || (() => setMode('ADMIN_REGISTER'))}
                className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-white transition-colors"
              >
                Register as new admin
              </button>
            )}
             {mode === 'ADMIN_REGISTER' && (
              <button 
                type="button" 
                onClick={() => setMode('ADMIN_LOGIN')}
                className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors"
              >
                Back to Admin Login
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
