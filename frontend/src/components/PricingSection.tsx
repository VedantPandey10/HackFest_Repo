import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Building2, User } from 'lucide-react';

export const PricingSection: React.FC = () => {
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
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            style={{ willChange: 'transform' }}
                            className={`glass-card p-10 rounded-[3rem] relative flex flex-col ${
                                plan.popular ? 'border-2 border-indigo-500/50' : ''
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest py-2 px-4 rounded-full shadow-xl shadow-indigo-600/30">
                                    Most Powerful
                                </div>
                            )}

                            <div className="mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center mb-6 border border-indigo-500/20">
                                    {plan.icon}
                                </div>
                                <h3 className="text-2xl font-black text-text-main mb-2">{plan.name}</h3>
                                <p className="text-text-muted text-sm font-medium">{plan.tagline}</p>
                            </div>

                            <div className="mb-8">
                                <span className="text-5xl font-black text-text-main">
                                    {plan.price === "Custom" ? "" : "$"}
                                    {plan.price}
                                </span>
                                {plan.price !== "Custom" && <span className="text-text-muted ml-2 font-bold uppercase tracking-widest text-xs">/ Month</span>}
                            </div>

                            <ul className="space-y-4 mb-10 flex-grow">
                                {plan.features.map(feature => (
                                    <li key={feature} className="flex items-center gap-3 text-sm font-medium text-text-main/90">
                                        <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                                            <Check size={12} className="text-indigo-500" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all ${
                                    plan.popular 
                                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-700' 
                                    : 'bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-white/20'
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
