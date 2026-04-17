import * as React from 'react';
import { FileText, Download, Calendar, Search, Filter, Loader2, BarChart3 } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { InterviewSession } from '../types';

interface ReportsScreenProps {
  candidateId?: number;
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({ candidateId }) => {
  const [sessions, setSessions] = React.useState<InterviewSession[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchReports = async () => {
      const data = await StorageService.getSessionsApi(candidateId);
      // Sort: Newest at the top
      const sorted = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setSessions(sorted);
      setLoading(false);
    };
    fetchReports();
  }, [candidateId]);

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <Loader2 size={40} className="text-indigo-500 animate-spin" />
    </div>
  );

  return (
    <div className="p-8 space-y-8 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-y-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tighter mb-2">My Reports</h2>
          <p className="text-slate-500 font-medium">Deep dive into your assessment performance logs.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">
            <Filter size={16} className="text-indigo-400" /> Filter
          </button>
          <button className="flex items-center gap-2 px-6 py-2 rounded-2xl bg-indigo-600 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="flex-1 glass-panel rounded-[3rem] border border-white/5 overflow-hidden flex flex-col bg-white/[0.01]">
        {sessions.length > 0 ? (
          <div className="overflow-x-auto flex-1 h-full scrollbar-thin scrollbar-thumb-white/10">
            <table className="w-full text-left min-w-[800px]">
              <thead className="sticky top-0 z-20">
                <tr className="border-b border-white/5 bg-slate-900/80 backdrop-blur-md">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Assessment Node</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Timestamp</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Performance</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Integrity Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sessions.map((session) => {
                  const isDQ = session.disqualified || (session.overallScore < 45);
                  return (
                    <tr key={session.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-2xl border ${isDQ ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20'}`}>
                            <FileText size={20} />
                          </div>
                          <div>
                            <span className="font-bold text-slate-200 block">{session.candidate.position || 'Standard Assessment'}</span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ID: {String(session.id).split('-')[0]}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1 text-slate-400 font-bold text-xs">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-slate-600" />
                            {new Date(session.date).toLocaleDateString()}
                          </div>
                          <div className="text-[10px] text-slate-600 ml-5">
                            {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3 w-40">
                          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                isDQ ? 'bg-red-500' : 
                                session.overallScore >= 80 ? 'bg-emerald-500' : 
                                session.overallScore >= 60 ? 'bg-amber-500' : 'bg-indigo-500'
                              }`}
                              style={{ width: `${session.overallScore}%` }}
                            />
                          </div>
                          <span className={`font-black text-xs ${isDQ ? 'text-red-500' : 'text-slate-300'}`}>{session.overallScore}%</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {isDQ ? (
                          <span className="px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                            Disqualified
                          </span>
                        ) : (
                          <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                            Verified
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 mr-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/10 transition-all border border-white/5">
                          <Download size={18} />
                        </button>
                        <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors">
                          View Log
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
               <FileText size={40} className="text-slate-700" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Reports Found</h3>
            <p className="max-w-xs text-slate-500 font-medium text-sm">Once you complete an interview session, your deep analytics report will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
