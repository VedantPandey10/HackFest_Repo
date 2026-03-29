import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, UserCircle, ShieldCheck, ArrowRight, ChevronRight, Zap, Target, BarChart3, Globe, Lock, Cpu, Sparkles } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { PricingSection } from './PricingSection';
import { BorderBeam } from './ui/BorderBeam';
import InteractiveButton from './ui/InteractiveButton';

interface LandingPageProps {
  onCandidateLogin: () => void;
  onAdminLogin: () => void;
  onEnterpriseCTA: () => void;
  onLearnMore: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onCandidateLogin, onAdminLogin, onEnterpriseCTA, onLearnMore }) => {
  return (
    <div className="min-h-screen bg-transparent relative overflow-x-hidden selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle,rgba(79,70,229,0.15)_0%,transparent_70%)] rounded-full blur-[80px]" 
        />
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(37,99,235,0.15)_0%,transparent_70%)] rounded-full blur-[80px]" 
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 w-full z-50 px-6 py-8 flex justify-between items-center bg-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <BrainCircuit className="text-white" size={24} />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">REINCREW<span className="text-indigo-500">.AI</span></span>
        </div>
        <div className="flex items-center gap-6">
          <ThemeToggle />
          <button 
            onClick={onAdminLogin}
            className="text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-indigo-500 transition-colors hidden md:block"
          >
            Admin Node
          </button>
          <InteractiveButton 
            onClick={onCandidateLogin}
            className="!py-2.5 !px-6"
            highlightHueDeg={270}
          >
            <span className="text-[10px] font-black uppercase tracking-widest">Start Journey</span>
          </InteractiveButton>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-300/50 dark:border-indigo-500/20 mb-8"
          >
            <Sparkles size={14} className="text-indigo-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Next-Gen Interview Intelligence</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-slate-900 dark:text-white">
            EVALUATING <br />
            <span className="shimmer-text">HUMAN POTENTIAL</span>
          </h1>
          
          <p className="text-lg md:text-xl text-indigo-900/70 dark:text-slate-400 max-w-2xl mx-auto mb-12 font-medium">
            Deploy advanced behavioral analysis to discover top talent. Reicrew.AI is the neural core for modern recruitment.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <InteractiveButton
              onClick={onCandidateLogin}
              className="!px-10 !py-5 shadow-2xl shadow-purple-600/30"
              highlightHueDeg={270}
            >
              <div className="flex items-center gap-4 group">
                <span className="font-black text-lg">Start Candidate Journey</span>
                <ArrowRight className="group-hover:translate-x-2 transition-all" />
              </div>
            </InteractiveButton>
            <button 
              onClick={onLearnMore}
              className="px-8 py-5 rounded-[2rem] text-indigo-700 dark:text-slate-300 font-bold border border-indigo-200 dark:border-white/10 hover:bg-indigo-50 dark:hover:bg-white/5 transition-all relative overflow-hidden group"
            >
              <BorderBeam size={80} duration={8} delay={0} />
              Learn How it Works
            </button>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { icon: <Zap />, title: "Neural Speed", desc: "Instantaneous evaluation with high-fidelity predictive modeling." },
            { icon: <Target />, title: "Precision Proctering", desc: "Advanced blink and gaze tracking for total assessment integrity." },
            { icon: <BarChart3 />, title: "Quantum Analytics", desc: "Granular data visualizations explaining the 'why' behind every score." }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
              className="glass-card p-12 rounded-[3.5rem] flex flex-col items-center text-center group bg-white/70 dark:bg-transparent border border-indigo-100 dark:border-white/5 shadow-xl shadow-indigo-100/50 dark:shadow-none hover:shadow-indigo-200/60 dark:hover:shadow-none transition-shadow duration-500"
            >
              <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center mb-8 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">
                {React.isValidElement(feature.icon) && React.cloneElement(feature.icon as React.ReactElement<any>, { size: 32 })}
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">
                {feature.title}
              </h3>
              <p className="text-base font-medium text-indigo-900/60 dark:text-slate-400 leading-relaxed">
                {feature.desc}
              </p>
              <BorderBeam size={250} duration={12} delay={idx * 2} colorFrom="#6366f1" colorTo="rgba(99,102,241,0)" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection onEnterpriseCTA={onEnterpriseCTA} />

      {/* Footer */}
      <footer className="py-20 border-t border-indigo-100 dark:border-white/5 relative z-10 bg-white/40 dark:bg-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center">
              <BrainCircuit className="text-indigo-500" size={18} />
            </div>
            <span className="text-sm font-black tracking-tighter text-slate-900 dark:text-white uppercase transition-colors">Reicrew Intelligence Node</span>
          </div>
          <div className="flex gap-8">
            <button className="text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-indigo-500 transition-colors">Privacy</button>
            <button className="text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-indigo-500 transition-colors">Protocol</button>
            <button className="text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-indigo-500 transition-colors">Network</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
