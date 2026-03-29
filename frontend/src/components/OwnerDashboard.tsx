import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Clock, CheckCircle2, XCircle, Mail, UserCircle, LogOut, Inbox } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface EnterpriseRequest {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  team_size: number;
  status: string;
  created_at: string;
  reviewed_at?: string;
}

interface OwnerDashboardProps {
  onLogout: () => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ onLogout }) => {
  const [requests, setRequests] = useState<EnterpriseRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('enterprise_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setRequests(data);
    setLoading(false);
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (id: string, action: 'approved' | 'rejected') => {
    await supabase
      .from('enterprise_requests')
      .update({ status: action, reviewed_at: new Date().toISOString() })
      .eq('id', id);
    fetchRequests();
  };

  const pending = requests.filter(r => r.status === 'pending');
  const reviewed = requests.filter(r => r.status !== 'pending');

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white font-sans">
      {/* Top bar */}
      <div className="border-b border-white/5 bg-white/[0.02] backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Building2 size={16} className="text-white" />
            </div>
            <span className="text-xs font-black tracking-[0.2em] text-white/40 uppercase">
              Reincrew<span className="text-indigo-500">.AI</span> — Owner Node
            </span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-red-400 transition-colors"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-white mb-3 leading-none">
              Enterprise <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">Requests</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              Platform-wide registration approval queue.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              {pending.length} Pending
            </div>
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {reviewed.length} Reviewed
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-32 text-slate-500 text-xs font-black uppercase tracking-widest">
            Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white/5 border border-white/10 border-dashed p-32 rounded-[3.5rem] text-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Inbox size={32} className="text-slate-600" />
            </div>
            <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">
              No active registration requests
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((req, i) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/5 border border-white/10 p-8 rounded-[2rem] flex flex-col lg:flex-row gap-8 items-center relative overflow-hidden group hover:border-white/20 transition-colors"
              >
                {/* Avatar */}
                <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center font-black text-3xl text-slate-600 group-hover:text-indigo-400 transition-colors border border-white/10">
                  {req.company_name?.[0] || '?'}
                </div>

                {/* Info */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 mb-4">
                    <h3 className="text-2xl font-black text-white tracking-tight">{req.company_name}</h3>
                    <span className={`inline-flex px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest mx-auto lg:mx-0 border ${
                      req.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        : req.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                    <div className="flex items-center justify-center lg:justify-start gap-2">
                      <UserCircle size={14} className="opacity-40" /> {req.contact_name}
                    </div>
                    <div className="flex items-center justify-center lg:justify-start gap-2 truncate">
                      <Mail size={14} className="opacity-40" /> {req.email}
                    </div>
                    <div className="flex items-center justify-center lg:justify-start gap-2">
                      <Users size={14} className="opacity-40" /> {req.team_size} Users
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  {req.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleAction(req.id, 'approved')}
                        className="h-12 px-8 bg-indigo-600 text-white font-black rounded-xl text-[9px] uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                      >
                        <CheckCircle2 size={14} /> Approve
                      </button>
                      <button
                        onClick={() => handleAction(req.id, 'rejected')}
                        className="h-12 px-6 bg-white/5 text-slate-400 font-black rounded-xl text-[9px] uppercase tracking-widest hover:bg-red-500/10 hover:text-red-400 transition-all flex items-center gap-2"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </>
                  ) : (
                    <div className="text-center lg:text-right px-4">
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-600 mb-1">Reviewed</p>
                      <p className="text-xs font-black text-slate-300 tracking-tight">
                        {req.reviewed_at ? new Date(req.reviewed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
