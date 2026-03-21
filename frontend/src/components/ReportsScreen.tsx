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
      setSessions(data);
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
    <div className="p-8 space-y-8 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tighter mb-2">My Reports</h2>
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

      <div className="flex-1 glass-panel rounded-[3rem] border border-white/5 overflow-hidden flex flex-col">
        {sessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Assessment Node</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Timestamp</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Sync Score</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
                          <FileText size={20} />
                        </div>
                        <div>
                          <span className="font-bold text-slate-200 block">{session.candidate.position || 'Standard Assessment'}</span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ID: {session.id.split('-')[0]}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                        <Calendar size={14} className="text-slate-600" />
                        {new Date(session.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3 w-48">
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              session.overallScore >= 80 ? 'bg-emerald-500' : 
                              session.overallScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${session.overallScore}%` }}
                          />
                        </div>
                        <span className="font-black text-xs text-slate-300">{session.overallScore}%</span>
                      </div>
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
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4">
            <BarChart3 size={64} className="opacity-10" />
            <p className="font-medium italic">No performance logs found in the archives.</p>
          </div>
        )}
      </div>
    </div>
  );
};
