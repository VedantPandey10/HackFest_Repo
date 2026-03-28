import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Building2, User } from 'lucide-react';

export const PricingSection: React.FC<{ onEnterpriseCTA?: () => void }> = ({ onEnterpriseCTA }) => {
    const plans = [
        {
            name: "Free",
            tagline: "For Students & Starters",
            price: "0",
            icon: <User className="text-indigo-400" />,
            features: [
                "Up to 5 Interviews Daily",
                "Basic AI Behavioral Analysis",
                "Personal Performance Dashboard",
                "No Admin Control",
                "No Centralized Data Storage"
            ],
            cta: "Get Started Free",
            popular: false
        },
        {
            name: "Enterprise",
            tagline: "For Professional Teams",
            price: "Custom",
            icon: <Building2 className="text-indigo-400" />,
            features: [
                "Unlimited Daily Interviews",
                "Advanced Neural Proctering",
                "Full Admin Control Panel",
                "100+ Concurrent Devices",
                "Centralized Team Analytics",
                "API Access & Integrations"
            ],
            cta: "Contact Sales",
            popular: true
        }
    ];

    return (
        <section className="py-24 px-6 bg-slate-50/50 dark:bg-slate-950/20 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-text-main">
                        Scalable Intelligence
                    </h2>
                    <p className="text-lg text-text-main/80 dark:text-slate-400 max-w-2xl mx-auto">
                        Choose the node that fits your growth. From academic research to enterprise-grade recruitment.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, idx) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.6 }}
                            viewport={{ once: true, amount: 0.3 }}
                            className={`glass-card !overflow-visible p-14 rounded-[4.5rem] relative flex flex-col group transition-all duration-500 bg-blue-50/80 dark:bg-slate-950/50 backdrop-blur-xl border-2 shadow-xl ${
                                plan.popular 
                                    ? 'border-blue-200 dark:border-indigo-500/50 shadow-blue-500/10 dark:shadow-[0_0_50px_-12px_rgba(99,102,241,0.2)]' 
                                    : 'border-blue-100 dark:border-indigo-500/20 shadow-blue-400/5 dark:shadow-slate-950/20'
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest py-2 px-4 rounded-full shadow-xl shadow-indigo-600/30 z-20">
                                    Most Powerful
                                </div>
                            )}

                            <div className="mb-10 text-center md:text-left">
                                <div className="w-16 h-16 rounded-3xl bg-blue-100 dark:bg-indigo-500/20 flex items-center justify-center mb-8 border border-blue-200 dark:border-indigo-500/20 text-blue-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                    {React.isValidElement(plan.icon) && React.cloneElement(plan.icon as React.ReactElement<any>, { size: 28 })}
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter uppercase">{plan.name}</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-base font-medium">{plan.tagline}</p>
                            </div>

                            <div className="mb-10 p-8 rounded-[2rem] bg-blue-100/50 dark:bg-white/5 border border-blue-200/50 dark:border-white/5 text-center">
                                <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
                                    {plan.price === "Custom" ? "" : "₹"}
                                    {plan.price}
                                </span>
                                {plan.price !== "Custom" && <span className="text-slate-500 dark:text-slate-400 ml-2 font-black uppercase tracking-widest text-xs">/ Month</span>}
                            </div>

                            <ul className="space-y-5 mb-12 flex-grow">
                                {plan.features.map(feature => (
                                    <li key={feature} className="flex items-center gap-4 text-base font-medium text-slate-700 dark:text-slate-300">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0 border border-blue-200 dark:border-indigo-500/20">
                                            <Check size={14} className="text-blue-600 dark:text-indigo-400" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={plan.popular ? onEnterpriseCTA : undefined}
                                className={`w-full py-5 rounded-full font-black uppercase tracking-widest text-sm transition-all bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 ${
                                    plan.popular 
                                    ? 'shadow-indigo-600/20' 
                                    : 'bg-indigo-600/80 shadow-indigo-600/10'
                                }`}
                            >
                                {plan.cta}
                            </motion.button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
