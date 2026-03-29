import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Users, Clock, CheckCircle2, XCircle, Mail, UserCircle,
  LogOut, Inbox, LayoutDashboard, FileText, History, BrainCircuit,
  TrendingUp, Shield, Activity, ChevronRight, Settings, Database, ExternalLink
} from 'lucide-react';
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

interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

type OwnerTab = 'DASHBOARD' | 'REQUESTS' | 'AUDIT' | 'SETTINGS';

interface OwnerDashboardProps {
  onLogout: () => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ onLogout }) => {
  const [tab, setTab] = useState<OwnerTab>('DASHBOARD');
  const [auditFilter, setAuditFilter] = useState<'all' | 'candidate' | 'admin' | 'owner'>('all');
  const [requests, setRequests] = useState<EnterpriseRequest[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [poolSize, setPoolSize] = useState(15);

  const fetchData = async () => {
    setLoading(true);
    const [reqRes, profRes] = await Promise.all([
      supabase.from('enterprise_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    ]);
    if (reqRes.data) setRequests(reqRes.data);
    if (profRes.data) setProfiles(profRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // Refetch data when switching to relevant tabs
  useEffect(() => {
    if (tab === 'REQUESTS' || tab === 'DASHBOARD' || tab === 'AUDIT') {
      fetchData();
    }
  }, [tab]);

  // Real-time subscription for enterprise requests
  useEffect(() => {
    const channel = supabase
      .channel('enterprise_requests_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'enterprise_requests' 
      }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAction = async (id: string, action: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('enterprise_requests')
      .update({ status: action, reviewed_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error updating request:', error);
      alert('Failed to update request. Please check permissions.');
    } else {
      fetchData();
    }
  };

  const pending = requests.filter(r => r.status === 'pending');
  const approved = requests.filter(r => r.status === 'approved');
  const rejected = requests.filter(r => r.status === 'rejected');
  const totalUsers = profiles.length;
  const admins = profiles.filter(p => p.role === 'admin');
  const candidates = profiles.filter(p => p.role === 'candidate');

  const navItems = [
    { id: 'DASHBOARD' as OwnerTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'REQUESTS' as OwnerTab, label: 'Requests', icon: FileText, badge: pending.length },
    { id: 'AUDIT' as OwnerTab, label: 'Customer Audit', icon: History },
    { id: 'SETTINGS' as OwnerTab, label: 'Database', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white font-sans flex">
      {/* ─── LEFT SIDEBAR ─── */}
      <aside className="w-72 border-r border-white/5 bg-white/[0.02] backdrop-blur-xl flex flex-col shrink-0">
        {/* Brand */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <BrainCircuit size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-black tracking-tight text-white">
                Reincrew<span className="text-indigo-500">.AI</span>
              </p>
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">Owner Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all group ${
                  active
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20'
                    : 'text-slate-500 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <item.icon size={18} className={active ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-400'} />
                <span className="text-xs font-black uppercase tracking-widest flex-1">{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="w-5 h-5 rounded-lg bg-amber-500/20 text-amber-500 text-[9px] font-black flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* User / Logout */}
        <div className="p-4 border-t border-white/5">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Signed in as</p>
            <p className="text-xs font-bold text-white truncate">reincrew.ai@gmail.com</p>
            <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mt-1">Super Admin</p>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-all"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {tab === 'DASHBOARD' && (
            <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-10">
              <div className="mb-12">
                <h1 className="text-4xl font-black tracking-tighter text-white mb-2">Dashboard</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Platform overview & key metrics</p>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
                {[
                  { label: 'Total Users', value: totalUsers, icon: Users, color: 'indigo', sub: 'Registered accounts' },
                  { label: 'Admins', value: admins.length, icon: Shield, color: 'blue', sub: 'Enterprise admins' },
                  { label: 'Candidates', value: candidates.length, icon: UserCircle, color: 'emerald', sub: 'Active candidates' },
                  { label: 'Pending', value: pending.length, icon: Clock, color: 'amber', sub: 'Awaiting review' },
                ].map((m, i) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-12 h-12 rounded-2xl bg-${m.color}-500/10 border border-${m.color}-500/20 flex items-center justify-center`}>
                        <m.icon size={20} className={`text-${m.color}-400`} />
                      </div>
                      <TrendingUp size={14} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <p className="text-3xl font-black text-white tracking-tight mb-1">{m.value}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{m.label}</p>
                    <p className="text-[9px] font-bold text-slate-600 mt-1">{m.sub}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                    <Activity size={18} className="text-indigo-400" /> Recent Activity
                  </h2>
                  <button onClick={() => setTab('REQUESTS')} className="text-[9px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                    View All <ChevronRight size={12} />
                  </button>
                </div>
                {requests.slice(0, 5).length === 0 ? (
                  <p className="text-slate-600 text-xs font-bold text-center py-8">No activity yet</p>
                ) : (
                  <div className="space-y-3">
                    {requests.slice(0, 5).map(req => (
                      <div key={req.id} className="flex items-center gap-4 py-3 px-4 rounded-2xl hover:bg-white/5 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sm font-black text-slate-500">
                          {req.company_name?.[0] || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">{req.company_name}</p>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{req.email}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                          req.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                            : req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>
                          {req.status}
                        </span>
                        <p className="text-[9px] font-bold text-slate-600 w-20 text-right">
                          {new Date(req.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {tab === 'REQUESTS' && (
            <motion.div key="req" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                  <h1 className="text-4xl font-black tracking-tighter text-white mb-2">
                    Enterprise <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">Requests</span>
                  </h1>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Registration approval queue</p>
                </div>
                <div className="flex gap-3">
                  <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> {pending.length} Pending
                  </div>
                  <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {approved.length} Approved
                  </div>
                  <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-red-500 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> {rejected.length} Rejected
                  </div>
                </div>
              </div>

              {requests.length === 0 ? (
                <div className="bg-white/5 border border-white/10 border-dashed p-32 rounded-[3rem] text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Inbox size={32} className="text-slate-600" />
                  </div>
                  <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">No active registration requests</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {requests.map((req, i) => (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white/5 border border-white/10 p-7 rounded-[2rem] flex flex-col lg:flex-row gap-6 items-center hover:border-white/20 transition-colors group"
                    >
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center font-black text-2xl text-slate-600 group-hover:text-indigo-400 transition-colors border border-white/10">
                        {req.company_name?.[0] || '?'}
                      </div>
                      <div className="flex-1 text-center lg:text-left">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 mb-3">
                          <h3 className="text-xl font-black text-white tracking-tight">{req.company_name}</h3>
                          <span className={`inline-flex px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest mx-auto lg:mx-0 border ${
                            req.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                              : req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                              : 'bg-red-500/10 text-red-500 border-red-500/20'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          <div className="flex items-center justify-center lg:justify-start gap-2">
                            <UserCircle size={13} className="opacity-40" /> {req.contact_name}
                          </div>
                          <div className="flex items-center justify-center lg:justify-start gap-2 truncate">
                            <Mail size={13} className="opacity-40" /> {req.email}
                          </div>
                          <div className="flex items-center justify-center lg:justify-start gap-2">
                            <Users size={13} className="opacity-40" /> {req.team_size} Users
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        {req.status === 'pending' ? (
                          <>
                            <button onClick={() => handleAction(req.id, 'approved')} className="h-11 px-6 bg-indigo-600 text-white font-black rounded-xl text-[9px] uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5 flex items-center gap-2">
                              <CheckCircle2 size={13} /> Approve
                            </button>
                            <button onClick={() => handleAction(req.id, 'rejected')} className="h-11 px-5 bg-white/5 text-slate-400 font-black rounded-xl text-[9px] uppercase tracking-widest hover:bg-red-500/10 hover:text-red-400 transition-all flex items-center gap-2">
                              <XCircle size={13} /> Reject
                            </button>
                          </>
                        ) : (
                          <div className="text-right px-4">
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-600 mb-1">Reviewed</p>
                            <p className="text-xs font-bold text-slate-300 tracking-tight">
                              {req.reviewed_at ? new Date(req.reviewed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {tab === 'AUDIT' && (
            <motion.div key="audit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-10">
              <div className="mb-12">
                <h1 className="text-4xl font-black tracking-tighter text-white mb-2">
                  Customer <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">Audit</span>
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Complete user registry & history</p>
              </div>

              {/* Summary strip */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Total', value: totalUsers, color: 'indigo' },
                  { label: 'Admins', value: admins.length, color: 'blue' },
                  { label: 'Candidates', value: candidates.length, color: 'emerald' },
                ].map(s => (
                  <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                    <p className={`text-2xl font-black text-${s.color}-400`}>{s.value}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2 mb-8">
                {[
                  { id: 'all' as const, label: 'All Users', count: totalUsers },
                  { id: 'candidate' as const, label: 'Candidates', count: candidates.length },
                  { id: 'admin' as const, label: 'Enterprise Admin', count: admins.length },
                  { id: 'owner' as const, label: 'Owner', count: profiles.filter(p => p.role === 'owner').length },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setAuditFilter(f.id)}
                    className={`px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border ${
                      auditFilter === f.id
                        ? 'bg-indigo-600/15 text-indigo-400 border-indigo-500/30'
                        : 'bg-white/5 text-slate-500 border-white/10 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {f.label}
                    <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[9px] ${
                      auditFilter === f.id ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-slate-600'
                    }`}>
                      {f.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* User Table */}
              <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 px-7 py-4 border-b border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500">
                  <div className="col-span-4">User</div>
                  <div className="col-span-3">Email</div>
                  <div className="col-span-2">Role</div>
                  <div className="col-span-3 text-right">Joined</div>
                </div>
                {/* Rows */}
                {profiles.filter(p => auditFilter === 'all' ? true : p.role === auditFilter).length === 0 ? (
                  <div className="text-center py-16 text-slate-600 text-xs font-bold">No users found</div>
                ) : (
                  profiles.filter(p => auditFilter === 'all' ? true : p.role === auditFilter).map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="grid grid-cols-12 gap-4 px-7 py-4 border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors items-center"
                    >
                      <div className="col-span-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-slate-500">
                          {(p.full_name?.[0] || p.email?.[0] || '?').toUpperCase()}
                        </div>
                        <p className="text-sm font-bold text-white truncate">{p.full_name || '—'}</p>
                      </div>
                      <div className="col-span-3">
                        <p className="text-xs font-medium text-slate-400 truncate">{p.email}</p>
                      </div>
                      <div className="col-span-2">
                        <span className={`inline-flex px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                          p.role === 'admin' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : p.role === 'owner' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {p.role}
                        </span>
                      </div>
                      <div className="col-span-3 text-right">
                        <p className="text-xs font-medium text-slate-500">
                          {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {tab === 'SETTINGS' && (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-10 max-w-4xl mx-auto">
              <div className="mb-12">
                <h1 className="text-4xl font-black tracking-tighter text-white mb-2">Project Settings</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Database & Connection Management</p>
              </div>

              {/* Connection Poolers Card */}
              <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-8 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      Connection poolers
                    </h2>
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-black tracking-widest text-slate-500 uppercase">Shared</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-8">Configuration is shared across all connection poolers.</p>

                  <div className="space-y-10">
                    {/* Pool Size Section */}
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      <div className="flex-1">
                        <label className="block text-sm font-bold text-white mb-1">Connection pool size</label>
                        <p className="text-xs text-slate-500 leading-relaxed mb-1">
                          The maximum number of connections made to the underlying Postgres cluster, per user+db combination.
                        </p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Pool size has a default of 15 based on your compute size of Nano.
                        </p>
                      </div>
                      <div className="w-full md:w-64">
                        <div className="flex items-center bg-[#0a0a0a] border border-white/10 rounded-lg overflow-hidden focus-within:border-indigo-500/50 transition-colors">
                          <input 
                            type="number" 
                            value={poolSize}
                            onChange={(e) => setPoolSize(parseInt(e.target.value) || 0)}
                            className="flex-1 bg-transparent px-4 py-2.5 text-sm font-bold text-white outline-none" 
                          />
                          <div className="px-4 py-2.5 bg-white/5 border-l border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500">
                            Connections
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-white/5" />

                    {/* Max Client Connections Section */}
                    <div className="flex flex-col md:flex-row md:items-start gap-6 pb-4">
                      <div className="flex-1">
                        <label className="block text-sm font-bold text-white mb-1">Max client connections</label>
                        <p className="text-xs text-slate-500 leading-relaxed mb-1">
                          The maximum number of concurrent client connections allowed. This value is fixed at 200 based on your compute size of Nano and cannot be changed.
                        </p>
                        <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold inline-flex items-center gap-1 mt-1 transition-colors">
                          Learn more <ExternalLink size={12} />
                        </a>
                      </div>
                      <div className="w-full md:w-64">
                        <div className="flex items-center bg-[#1a1a1a] border border-white/5 rounded-lg overflow-hidden cursor-not-allowed">
                          <input 
                            disabled
                            type="text" 
                            value="200"
                            className="flex-1 bg-transparent px-4 py-2.5 text-sm font-bold text-slate-500 outline-none cursor-not-allowed" 
                          />
                          <div className="px-4 py-2.5 bg-white/[0.02] border-l border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-600">
                            Clients
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="bg-white/[0.02] p-6 border-t border-white/10 flex justify-end gap-3">
                  <button onClick={() => setTab('DASHBOARD')} className="px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 transition-all">
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      alert('Connection pool settings updated successfully.');
                      setTab('DASHBOARD');
                    }}
                    className="px-6 py-2.5 bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-[#10b981] hover:text-white transition-all shadow-lg shadow-emerald-500/10"
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Bottom Tip */}
              <div className="mt-8 p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-start gap-4">
                <BrainCircuit className="text-indigo-400 shrink-0" size={20} />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-1">Optimization Note</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Higher connection counts consume more RAM. For Nano instances, we recommend keeping the pool size stable to avoid out-of-memory errors during concurrent peaks.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
