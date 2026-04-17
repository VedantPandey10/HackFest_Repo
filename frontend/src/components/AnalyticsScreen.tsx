import * as React from 'react';
import { BarChart3, TrendingUp, Target, Brain, Shield, Zap, Loader2 } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { InterviewSession } from '../types';

interface AnalyticsScreenProps {
  candidateId?: number;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ candidateId }) => {
  const [sessions, setSessions] = React.useState<InterviewSession[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await StorageService.getSessionsApi(candidateId);
      // Sort: Newest at the top for reports, but for progress chart we might want Chronological
      setSessions(data);
      setLoading(false);
    };
    fetchData();
  }, [candidateId]);

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <Loader2 size={40} className="text-indigo-500 animate-spin" />
    </div>
  );

  const calculateAvg = (key1: any, key2?: any) => {
    if (!sessions.length) return 0;
    const total = sessions.reduce((acc, s) => {
      const results = s.results || [];
      if (!results.length) return acc;
      const sum = results.reduce((a, r) => a + (key2 ? (r as any)[key1][key2] : (r as any)[key1]), 0);
      return acc + (sum / results.length);
    }, 0);
    return Math.round(total / sessions.length);
  };

  const disqualifiedCount = sessions.filter(s => s.disqualified || (s.overallScore < 45)).length;
  const avgIntegrity = Math.max(0, 100 - (sessions.reduce((acc, s) => acc + (s.violationCount || 0), 0) * 2 / Math.max(1, sessions.length)));

  const metrics = [
    { label: 'Technical Accuracy', value: `${calculateAvg('contentScore') * 10}%`, icon: <Target size={20} />, color: 'bg-emerald-500' },
    { label: 'Communication skills', value: `${calculateAvg('fluencyScore') * 10}%`, icon: <Brain size={20} />, color: 'bg-indigo-500' },
    { label: 'Integrity Score', value: `${Math.round(avgIntegrity)}%`, icon: <Shield size={20} />, color: 'bg-purple-500' },
    { label: 'Disqualified', value: disqualifiedCount.toString(), icon: <Shield size={20} />, color: 'bg-red-500' },
  ];

  // Progress Data (Chronological)
  const progressData = [...sessions].reverse().map(s => s.overallScore);

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full overflow-y-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tighter mb-2">Neural Analytics</h2>
          <p className="text-slate-500 font-medium">Visualizing cross-session performance and behavioral patterns.</p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Total Sessions</span>
            <span className="text-xl font-black text-white">{sessions.length}</span>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-red-500/10 border border-red-500/20">
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest block">DQ Points</span>
            <span className="text-xl font-black text-red-500">{disqualifiedCount}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 ${metric.color} opacity-[0.03] -mr-8 -mt-8 rounded-full group-hover:scale-125 transition-transform duration-500`} />
            <div className={`p-3 rounded-2xl ${metric.color} bg-opacity-10 text-indigo-400 flex w-fit mb-4`}>
              {metric.icon}
            </div>
            <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{metric.label}</h3>
            <p className="text-3xl font-black text-white mt-1">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress Chart */}
        <div className="glass-panel p-8 rounded-[3rem] border border-white/5 bg-white/[0.02] flex flex-col">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
            <TrendingUp className="text-indigo-400" /> Candidate Progress
          </h3>
          <div className="flex-1 min-h-[200px] flex items-end justify-between gap-2 px-4">
             {progressData.length > 0 ? progressData.map((score, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                  <div className="absolute -top-8 bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    S{i+1}: {score}%
                  </div>
                  <div 
                    className={`w-full rounded-t-xl transition-all duration-1000 delay-${i*100} ${score < 45 ? 'bg-red-500/50' : 'bg-gradient-to-t from-indigo-600 to-indigo-400'}`}
                    style={{ height: `${score}%` }}
                  />
                  <span className="text-[8px] font-bold text-slate-600">S{i+1}</span>
               </div>
             )) : (
               <div className="w-full h-full flex items-center justify-center text-slate-500 italic">No historical data found</div>
             )}
          </div>
          <p className="text-[10px] text-slate-500 mt-6 text-center uppercase tracking-widest font-black">Performance across successive interview nodes</p>
        </div>

        <div className="glass-panel p-8 rounded-[3rem] border border-white/5 bg-gradient-to-br from-indigo-500/[0.02] to-transparent">
          <h3 className="text-xl font-bold mb-8">AI Behavioral Radar</h3>
          
          <div className="aspect-square relative flex items-center justify-center p-12">
            <div className="w-full h-full border-2 border-dashed border-indigo-500/10 rounded-full animate-spin-slow flex items-center justify-center p-8">
               <div className="w-full h-full border-2 border-dashed border-indigo-500/20 rounded-full flex items-center justify-center p-8">
                  <div className="w-full h-full bg-indigo-500/5 rounded-full flex items-center justify-center relative">
                     <Brain size={64} className="text-indigo-500/40 animate-pulse-slow" />
                  </div>
               </div>
            </div>
            {/* Optimized Radar Labels - Better Alignment */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-5 py-2 rounded-xl shadow-xl shadow-indigo-500/10 text-[10px] font-black uppercase tracking-widest border border-white/10">Integrity</div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-5 py-2 rounded-xl shadow-xl shadow-emerald-500/10 text-[10px] font-black uppercase tracking-widest border border-white/10">Technical</div>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-purple-600 text-white px-5 py-2 rounded-xl shadow-xl shadow-purple-500/10 text-[10px] font-black uppercase tracking-widest border border-white/10">Architecture</div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-amber-600 text-white px-5 py-2 rounded-xl shadow-xl shadow-amber-500/10 text-[10px] font-black uppercase tracking-widest border border-white/10">Fluency</div>
          </div>
        </div>
      </div>


      <div className="glass-panel p-8 rounded-[3rem] border border-white/5 bg-white/[0.02]">
        <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
          <BarChart3 className="text-indigo-400" /> Skill Optimization Matrix
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {[
            { label: 'Conceptual Depth', score: calculateAvg('contentScore') * 10 },
            { label: 'Verbal Fluency', score: calculateAvg('fluencyScore') * 10 },
            { label: 'Grammatical Precision', score: calculateAvg('grammarScore') * 10 },
            { label: 'Visual Presence (Integrity)', score: avgIntegrity },
          ].map((skill) => (
            <div key={skill.label} className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-500">{skill.label}</span>
                <span className={skill.score < 45 ? 'text-red-500' : 'text-indigo-400'}>{skill.score}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 shadow-lg ${skill.score < 45 ? 'bg-red-500' : 'bg-gradient-to-r from-indigo-600 to-blue-500'}`}
                  style={{ width: `${skill.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

