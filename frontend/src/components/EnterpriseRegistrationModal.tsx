import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, ArrowRight, ArrowLeft, Check, Sparkles, Users, Shield, BarChart3, Globe, Cpu } from 'lucide-react';
import { PasswordInput } from './PasswordInput';

interface EnterpriseRegistrationModalProps {
    onClose: () => void;
}

type Step = 'PLAN_SUMMARY' | 'REGISTRATION' | 'CONFIRMATION';

export const EnterpriseRegistrationModal: React.FC<EnterpriseRegistrationModalProps> = ({ onClose }) => {
    const [step, setStep] = React.useState<Step>('PLAN_SUMMARY');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [formData, setFormData] = React.useState({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        teamSize: 10,
        password: '',
        confirmPassword: ''
    });

    const enterpriseFeatures = [
        { icon: <Users size={16} />, text: "Unlimited Daily Interviews" },
        { icon: <Shield size={16} />, text: "Advanced Neural Proctoring" },
        { icon: <Cpu size={16} />, text: "Full Admin Control Panel" },
        { icon: <Globe size={16} />, text: "100+ Concurrent Devices" },
        { icon: <BarChart3 size={16} />, text: "Centralized Team Analytics" },
        { icon: <Sparkles size={16} />, text: "API Access & Integrations" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const resp = await fetch('/api/auth/register/enterprise', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    companyName: formData.companyName,
                    contactName: formData.contactName,
                    email: formData.email,
                    phone: formData.phone || null,
                    teamSize: formData.teamSize,
                    password: formData.password
                })
            });

            if (!resp.ok) {
                const errText = await resp.text();
                throw new Error(errText || 'Registration failed.');
            }

            setStep('CONFIRMATION');
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/90 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="glass-panel w-full max-w-lg rounded-[3rem] overflow-hidden bg-bg-main dark:bg-surface-panel max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
                {/* Header */}
                <div className="px-6 pt-10 pb-6 text-center relative">
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 flex items-center justify-center mx-auto mb-6 border border-indigo-500/30">
                        <Building2 className="text-indigo-400" size={28} />
                    </div>

                    <h2 className="text-3xl font-black tracking-tighter mb-2 text-slate-900 dark:text-white">
                        {step === 'PLAN_SUMMARY' && "Enterprise Plan"}
                        {step === 'REGISTRATION' && "Register Your Team"}
                        {step === 'CONFIRMATION' && "Request Submitted"}
                    </h2>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {step === 'PLAN_SUMMARY' && "The most powerful node for professional teams."}
                        {step === 'REGISTRATION' && "Complete your enterprise registration."}
                        {step === 'CONFIRMATION' && "We'll review your request shortly."}
                    </p>

                    {/* Step indicator */}
                    <div className="flex items-center justify-center gap-2 mt-6">
                        {['PLAN_SUMMARY', 'REGISTRATION', 'CONFIRMATION'].map((s, i) => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                                    step === s
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                        : (['PLAN_SUMMARY', 'REGISTRATION', 'CONFIRMATION'].indexOf(step) > i
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-slate-200 dark:bg-white/10 text-slate-400')
                                }`}>
                                    {(['PLAN_SUMMARY', 'REGISTRATION', 'CONFIRMATION'].indexOf(step) > i) ? <Check size={14} /> : i + 1}
                                </div>
                                {i < 2 && <div className={`w-8 h-0.5 ${['PLAN_SUMMARY', 'REGISTRATION', 'CONFIRMATION'].indexOf(step) > i ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-white/10'}`} />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-10">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Plan Summary */}
                        {step === 'PLAN_SUMMARY' && (
                            <motion.div
                                key="plan"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="text-center mb-4">
                                    <span className="text-4xl font-black text-slate-900 dark:text-white">Custom</span>
                                    <span className="text-sm text-slate-500 dark:text-slate-400 ml-2 font-bold uppercase tracking-widest">Pricing</span>
                                </div>

                                <ul className="space-y-3">
                                    {enterpriseFeatures.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                                            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                                                {feature.icon}
                                            </div>
                                            {feature.text}
                                        </li>
                                    ))}
                                </ul>

                                <div className="bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                                    <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium leading-relaxed">
                                        Enterprise registration requires admin approval. Once your request is reviewed and approved, you'll receive access to the full admin panel with all enterprise features.
                                    </p>
                                </div>

                                <button
                                    onClick={() => setStep('REGISTRATION')}
                                    className="w-fit mx-auto min-h-[4rem] px-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[2rem] shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-4"
                                >
                                    <span className="text-sm uppercase tracking-widest">Continue to Registration</span>
                                    <ArrowRight size={20} strokeWidth={3} />
                                </button>
                            </motion.div>
                        )}

                        {/* Step 2: Registration Form */}
                        {step === 'REGISTRATION' && (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {error && (
                                        <div className="w-full bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-red-400 text-center">
                                            {error}
                                        </div>
                                    )}

                                    <input
                                        placeholder="Company Name"
                                        required
                                        className="w-full h-14 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 text-sm outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition-all font-medium"
                                        value={formData.companyName}
                                        onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                                    />

                                    <input
                                        placeholder="Contact Person Name"
                                        required
                                        className="w-full h-14 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 text-sm outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition-all font-medium"
                                        value={formData.contactName}
                                        onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                                    />

                                    <input
                                        type="email"
                                        placeholder="Business Email"
                                        required
                                        className="w-full h-14 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 text-sm outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition-all font-medium"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="tel"
                                            placeholder="Phone (optional)"
                                            className="w-full h-14 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 text-sm outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition-all font-medium"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />

                                        <input
                                            type="number"
                                            min="1"
                                            max="10000"
                                            placeholder="Team Size"
                                            required
                                            className="w-full h-14 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 text-sm outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition-all font-medium"
                                            value={formData.teamSize || ''}
                                            onChange={e => setFormData({ ...formData, teamSize: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>

                                    <PasswordInput 
                                        value={formData.password}
                                        onChange={val => setFormData({ ...formData, password: val })}
                                        placeholder="Create Password"
                                    />

                                    <PasswordInput 
                                        value={formData.confirmPassword}
                                        onChange={val => setFormData({ ...formData, confirmPassword: val })}
                                        placeholder="Confirm Password"
                                    />

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setStep('PLAN_SUMMARY')}
                                            className="px-6 min-h-[4rem] bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white font-black rounded-[2rem] transition-all flex items-center justify-center gap-3 hover:bg-slate-300 dark:hover:bg-white/20"
                                        >
                                            <ArrowLeft size={18} />
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 min-h-[4rem] px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[2rem] shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <span className="text-[10px] uppercase tracking-widest">Submitting...</span>
                                            ) : (
                                                <>
                                                    <span className="text-sm uppercase tracking-widest">Submit Request</span>
                                                    <ArrowRight size={20} strokeWidth={3} className="shrink-0" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* Step 3: Confirmation */}
                        {step === 'CONFIRMATION' && (
                            <motion.div
                                key="confirm"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-6"
                            >
                                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto border border-emerald-500/30">
                                    <Check size={36} className="text-emerald-500" />
                                </div>

                                <div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Request Received!</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-sm mx-auto">
                                        Your enterprise registration has been submitted for review. The app owner will review your request and approve your account.
                                    </p>
                                </div>

                                <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10">
                                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                                        <span className="font-black text-slate-900 dark:text-white">{formData.companyName}</span> — Once approved, you can log in using the <span className="font-black text-indigo-500">Admin Login</span> with your registered email and password.
                                    </p>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="w-full min-h-[4rem] px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[2rem] shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-4"
                                >
                                    <span className="text-sm uppercase tracking-widest">Done</span>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
};
