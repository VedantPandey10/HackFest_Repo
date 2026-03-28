import * as React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  ArrowLeft,
  UserPlus,
  Camera,
  BrainCircuit,
  LineChart,
  Zap,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface HowItWorksProps {
  onBack: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onBack }) => {
  const steps = [
    {
      icon: <UserPlus className="text-indigo-500" size={32} />,
      title: "1. PROFILE SYNCHRONIZATION",
      description: "Candidates provide their professional context and objectives. Our neural engine maps these to critical success markers for the specific role.",
      details: ["Skill mapping", "Experience verification", "Objective alignment"]
    },
    {
      icon: <Camera className="text-indigo-500" size={32} />,
      title: "2. HARDWARE CALIBRATION",
      description: "A comprehensive check of visual and auditory inputs. Our proctoring suite ensures environment integrity and biometric stability before the assessment begins.",
      details: ["Eye-tracking sync", "Audio fidelity check", "Multi-face detection"]
    },
    {
      icon: <BrainCircuit className="text-indigo-500" size={32} />,
      title: "3. NEURAL INTERVIEW",
      description: "Engage in a dynamic, AI-driven dialogue. The system adapts its inquiry in real-time based on verbal quality, conceptual depth, and behavioral cues.",
      details: ["Adaptive questioning", "Behavioral analysis", "Sentiment tracking"]
    },
    {
      icon: <LineChart className="text-indigo-500" size={32} />,
      title: "4. QUANTUM ANALYTICS",
      description: "Instantaneous generation of high-fidelity performance reports. Admins receive granular insights into candidate potential, beyond simple scores.",
      details: ["Contextual scoring", "Capability radar charts", "Growth trajectory mapping"]
    }
  ];

  return (
    <div className="min-h-screen bg-bg-main text-text-main relative overflow-x-hidden selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      {/* Background Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle,rgba(79,70,229,0.1)_0%,transparent_70%)] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(37,99,235,0.1)_0%,transparent_70%)] rounded-full" />
      </div>

      <nav className="fixed top-0 left-0 right-0 w-full z-50 px-6 py-8 flex justify-between items-center bg-bg-main/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <BrainCircuit className="text-white" size={24} />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic">REIN<span className="text-indigo-500">CREW.AI</span></span>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-3 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          <ArrowLeft size={14} /> Back to Portal
        </button>
      </nav>

      <main className="relative z-10 pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8"
            >
              <Sparkles size={14} className="text-indigo-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Platform Protocol</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-none">
              HOW THE <span className="shimmer-text">INTELLIGENCE</span> WORKS
            </h1>
            <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto font-medium">
              A seamless fusion of behavioral science and artificial intelligence designed to surface human potential at scale.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-10 rounded-[3rem] border border-white/5 hover:border-indigo-500/20 transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tighter uppercase">{step.title}</h3>
                <p className="text-text-muted mb-8 leading-relaxed font-medium">
                  {step.description}
                </p>
                <div className="space-y-3">
                  {step.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-3 text-sm font-bold text-indigo-400">
                      <CheckCircle2 size={16} />
                      <span className="uppercase tracking-wider text-[10px]">{detail}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-24 p-12 rounded-[4rem] bg-gradient-to-br from-indigo-600 to-blue-700 text-white relative overflow-hidden shadow-2xl shadow-indigo-600/20">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <ShieldCheck size={120} />
            </div>
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 leading-none uppercase">Integrity Built-In</h2>
              <p className="text-indigo-100 text-lg mb-10 font-medium">
                Our platform employs military-grade proctoring and behavioral verification to ensure every assessment is fair, focused, and foolproof.
              </p>
              <button
                onClick={onBack}
                className="px-10 py-5 bg-white text-indigo-600 rounded-[2rem] font-black text-lg flex items-center gap-4 hover:bg-slate-50 transition-all shadow-xl"
              >
                Start Your Journey <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-20 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center">
              <BrainCircuit className="text-indigo-500" size={18} />
            </div>
            <span className="text-sm font-black tracking-tighter uppercase">Reicrew Intelligence Node</span>
          </div>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">© 2024 REINCREW.AI • ALL PROTOCOLS RESERVED</p>
        </div>
      </footer>
    </div>
  );
};
