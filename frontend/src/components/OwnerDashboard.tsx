import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, ShieldCheck, Building2, Clock, CheckCircle2, XCircle, 
  Search, Filter, ExternalLink, MoreVertical, LogOut, LayoutDashboard,
  Settings, Database, Activity, UserPlus, FileCheck
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface OwnerDashboardProps {
  onLogout: () => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ onLogout }) => {
  const [profiles, setProfiles] = React.useState<any[]>([]);
  const [requests, setRequests] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    totalUsers: 0,
    totalAdmins: 0,
    pendingRequests: 0,
    totalEnterprises: 0
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Profiles
      const { data: pData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      setProfiles(pData || []);

      // 2. Fetch Requests
      const { data: rData } = await supabase.from('enterprise_requests').select('*').order('created_at', { ascending: false });
      setRequests(rData || []);

      // 3. Compute Stats
      const admins = pData?.filter(p => p.role === 'admin')?.length || 0;
      const pending = rData?.filter(r => r.status === 'pending')?.length || 0;
      
      // Calculate unique enterprises from profiles
      const uniqueEnterprises = new Set(pData?.filter(p => p.company_name).map(p => p.company_name)).size;

      setStats({
        totalUsers: pData?.length || 0,
        totalAdmins: admins,
        pendingRequests: pending,
        totalEnterprises: uniqueEnterprises
      });
    } catch (error) {
      console.error('Error fetching owner data:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (requestId: number, newStatus: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('enterprise_requests')
        .update({ 
          status: newStatus,
          reviewed_at: new Date().toISOString(),
          review_notes: `Processed by Platform Owner`
        })
        .eq('id', requestId);

      if (error) throw error;
      
      // If approved, find the request data to potentially promote user
      if (newStatus === 'approved') {
        const req = requests.find(r => r.id === requestId);
        if (req && req.email) {
          // Promote to admin if user exists
          await supabase.from('profiles').update({ role: 'admin' }).eq('email', req.email);
        }
      }

      fetchData(); // Refresh
    } catch (error) {
      console.error(`Error updating request ${requestId}:`, error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white p-6 lg:p-12 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShieldCheck size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight uppercase italic mb-1">
                Owner <span className="text-indigo-400">Dashboard</span>
              </h1>
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold tracking-widest uppercase">
                <Activity size={12} className="text-emerald-500 animate-pulse" />
                Live Platform Oversight System v1.0
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => fetchData()}
              className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest"
            >
              Refresh Data
            </button>
            <button 
              onClick={onLogout}
              className="px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all font-bold text-xs uppercase tracking-widest flex items-center gap-2"
            >
              <LogOut size={14} />
              Terminate Session
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Node Users', value: stats.totalUsers, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
            { label: 'Enterprise Admins', value: stats.totalAdmins, icon: ShieldCheck, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
            { label: 'Pending Approvals', value: stats.pendingRequests, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
            { label: 'Partner Enterprises', value: stats.totalEnterprises, icon: Building2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="glass-card bg-slate-900/40 p-6 rounded-[2rem] border border-white/5 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-inner`}>
                  <stat.icon size={24} />
                </div>
                {stat.label === 'Pending Approvals' && stat.value > 0 && (
                  <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                )}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black tracking-tight">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Main List: Enterprise Requests */}
          <div className="xl:col-span-8 flex flex-col gap-6">
            <div className="glass-card bg-slate-950/60 rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden h-full">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <UserPlus size={20} />
                  </div>
                  <h4 className="text-xl font-black uppercase tracking-tight">Enterprise Requests</h4>
                </div>
                <div className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                  Action Required
                </div>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {requests.length === 0 ? (
                  <div className="py-20 text-center flex flex-col items-center gap-4 text-slate-500">
                    <CheckCircle2 size={48} className="opacity-20" />
                    <p className="font-bold uppercase tracking-widest text-xs">No pending approvals detected</p>
                  </div>
                ) : requests.map((req) => (
                  <div key={req.id} className="p-6 rounded-[2rem] bg-white/5 border border-white/5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 group hover:bg-white/[0.08] transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <Building2 size={24} />
                      </div>
                      <div>
                        <h5 className="font-black text-lg text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{req.company_name}</h5>
                        <p className="text-slate-400 text-xs font-bold">{req.contact_name} • <span className="text-indigo-400/70">{req.email}</span></p>
                        <div className="mt-2 flex items-center gap-4 text-[9px] uppercase tracking-widest font-black text-slate-500">
                          <span className="flex items-center gap-1.5"><Users size={12} /> {req.team_size || 'N/A'} Nodes</span>
                          <span className="flex items-center gap-1.5"><Clock size={12} /> {new Date(req.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 w-full lg:w-auto">
                      {req.status === 'pending' ? (
                        <>
                          <button 
                            onClick={() => handleAction(req.id, 'rejected')}
                            className="flex-1 lg:flex-none p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                          >
                            <XCircle size={18} />
                            <span className="font-bold text-[10px] uppercase tracking-widest lg:hidden">Reject</span>
                          </button>
                          <button 
                            onClick={() => handleAction(req.id, 'approved')}
                            className="flex-1 lg:flex-none px-6 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-3"
                          >
                            <FileCheck size={18} />
                            <span className="font-bold text-[10px] uppercase tracking-widest">Allow Access</span>
                          </button>
                        </>
                      ) : (
                        <div className={`px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 ${
                          req.status === 'approved' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border border-red-500/20 text-red-500'
                        }`}>
                          {req.status === 'approved' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                          {req.status}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: Collective Registry */}
          <div className="xl:col-span-4 flex flex-col gap-8">
            <div className="glass-card bg-slate-950/60 rounded-[2.5rem] p-8 border border-white/5 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3 text-emerald-400">
                  <Database size={20} />
                  <h4 className="text-xl font-black uppercase tracking-tight text-white">Registry</h4>
                </div>
                <Users size={18} className="text-slate-600" />
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {profiles.map((profile) => (
                  <div key={profile.id} className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-between hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${
                        profile.role === 'owner' ? 'bg-indigo-600 text-white' : 
                        profile.role === 'admin' ? 'bg-amber-500/20 text-amber-500' : 'bg-blue-500/20 text-blue-500'
                      }`}>
                        {profile.role === 'owner' ? <ShieldCheck size={20} /> : <Users size={20} />}
                      </div>
                      <div>
                        <p className="font-black text-sm text-slate-100 italic tracking-tight">{profile.email.split('@')[0]}</p>
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">
                          {profile.email}
                        </p>
                      </div>
                    </div>
                    <div className={`px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest border ${
                      profile.role === 'owner' ? 'bg-indigo-600/10 border-indigo-600/30 text-indigo-400' :
                      profile.role === 'admin' ? 'bg-amber-600/10 border-amber-600/30 text-amber-400' : 'bg-slate-800 border-white/5 text-slate-400'
                    }`}>
                      {profile.role}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
