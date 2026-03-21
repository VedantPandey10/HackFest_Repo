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
      const results = s.results;
      if (!results.length) return acc;
      const sum = results.reduce((a, r) => a + (key2 ? (r as any)[key1][key2] : (r as any)[key1]), 0);
      return acc + (sum / results.length);
    }, 0);
    return Math.round(total / sessions.length);
  };

  const metrics = [
    { label: 'Technical Accuracy', value: `${calculateAvg('contentScore') * 10}%`, icon: <Target size={20} />, color: 'bg-emerald-500' },
    { label: 'Communication skills', value: `${calculateAvg('fluencyScore') * 10}%`, icon: <Brain size={20} />, color: 'bg-indigo-500' },
    { label: 'Integrity Score', value: '98%', icon: <Shield size={20} />, color: 'bg-purple-500' },
    { label: 'Avg. Confidence', value: `${calculateAvg('confidenceScore')}%`, icon: <Zap size={20} />, color: 'bg-amber-500' },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h2 className="text-3xl font-black tracking-tighter mb-2">Neural Analytics</h2>
        <p className="text-slate-500 font-medium">Visualizing cross-session performance and behavioral patterns.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
        <div className="glass-panel p-8 rounded-[3rem] border border-white/5 bg-white/[0.02]">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
            <BarChart3 className="text-indigo-400" /> Skill Optimization Matrix
          </h3>
          <div className="space-y-6">
            {[
              { label: 'Conceptual Depth', score: calculateAvg('contentScore') * 10 },
              { label: 'Verbal Fluency', score: calculateAvg('fluencyScore') * 10 },
              { label: 'Grammatical Precision', score: calculateAvg('grammarScore') * 10 },
              { label: 'Visual Presence', score: calculateAvg('confidenceScore') },
            ].map((skill) => (
              <div key={skill.label} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-500">{skill.label}</span>
                  <span className="text-indigo-400">{skill.score}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full transition-all duration-1000 shadow-lg shadow-indigo-500/20"
                    style={{ width: `${skill.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-8 rounded-[3rem] border border-white/5 bg-gradient-to-br from-indigo-500/[0.02] to-transparent">
          <h3 className="text-xl font-bold mb-2">AI Behavioral Radar</h3>
          <p className="text-xs text-slate-500 font-medium mb-8 uppercase tracking-widest">Composite engagement analysis spanning all registered nodes.</p>
          
          <div className="aspect-square relative flex items-center justify-center">
            <div className="w-full h-full border-2 border-dashed border-indigo-500/10 rounded-full animate-spin-slow flex items-center justify-center p-8">
               <div className="w-full h-full border-2 border-dashed border-indigo-500/20 rounded-full flex items-center justify-center p-8">
                  <div className="w-full h-full bg-indigo-500/5 rounded-full flex items-center justify-center">
                     <Brain size={64} className="text-indigo-500/40 animate-pulse-slow" />
                  </div>
               </div>
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-tighter">Integrity</div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-tighter">Tech</div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-tighter">Logic</div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-tighter">Flow</div>
          </div>
        </div>
      </div>
    </div>
  );
};
