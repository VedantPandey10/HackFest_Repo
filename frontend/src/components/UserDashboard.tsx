import * as React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Clock, 
  CheckCircle, 
  ChevronRight, 
  Activity, 
  Award,
  Zap
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { InterviewSession } from '../types';

interface UserDashboardProps {
  candidateId: number;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ candidateId }) => {
  const [sessions, setSessions] = React.useState<InterviewSession[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchSessions = async () => {
      const data = await StorageService.getSessionsApi(candidateId);
      setSessions(data);
      setLoading(false);
    };
    fetchSessions();
  }, [candidateId]);

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  const stats = [
    { label: 'Total Assessments', value: sessions.length, icon: <Activity size={20} />, color: 'text-blue-400' },
    { label: 'Avg. Accuracy', value: sessions.length ? Math.round(sessions.reduce((a, s) => a + s.overallScore, 0) / sessions.length) + '%' : '0%', icon: <Zap size={20} />, color: 'text-indigo-400' },
    { label: 'Certifications', value: sessions.filter(s => s.overallScore >= 80).length, icon: <Award size={20} />, color: 'text-emerald-400' },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h2 className="text-3xl font-black tracking-tighter mb-2 text-slate-900 dark:text-white">My Assessment Node</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Monitoring your individual performance and career growth.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 rounded-[2rem] border border-slate-200 dark:border-white/5"
          >
            <div className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Sessions */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Clock size={20} className="text-indigo-500" /> Recent History
        </h3>
        
        <div className="space-y-3">
          {sessions.length > 0 ? sessions.map((s, i) => (
            <motion.div 
              key={s.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5 rounded-3xl flex items-center justify-between group cursor-pointer hover:border-indigo-500/30"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                  s.overallScore >= 80 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 
                  s.overallScore >= 60 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'
                }`}>
                  {s.overallScore}%
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">{s.candidate.position || 'Standard Assessment'}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">{new Date(s.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  s.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {s.status}
                </span>
                <ChevronRight size={18} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </div>
            </motion.div>
          )) : (
            <div className="glass-card p-12 rounded-[2rem] text-center border-dashed border-2 border-slate-200 dark:border-white/5">
              <BarChart3 size={48} className="mx-auto mb-4 opacity-10 text-slate-400" />
              <p className="text-slate-500 dark:text-slate-400 font-medium italic">No assessment history found for this node.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
