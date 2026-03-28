import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Play, Sparkles } from 'lucide-react';

interface AmethystHeroProps {
  onGoToLanding: () => void;
}

const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 150,
  damping: 15,
} as const;

const SparkleLayer = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-0 shadow-[0_0_8px_white]"
          initial={{ 
            x: `${Math.random() * 100}%`, 
            y: `${Math.random() * 100}%`, 
            scale: Math.random() * 0.4 + 0.2
          }}
          animate={{
            opacity: [0, 0.4, 1, 0.4, 0],
            scale: [0.4, 0.3, 1, 0.3, 0.4],
          }}
          transition={{
            duration: 4 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export const AmethystHero: React.FC<AmethystHeroProps> = ({ onGoToLanding }) => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 overflow-hidden bg-main">
      <SparkleLayer />
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[700px] bg-gradient-radial from-lavender/10 to-transparent blur-[120px] pointer-events-none opacity-40 animate-pulse-slow" />
      
        {/* Hero content wrapper */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="glass-panel p-12 md:p-20 rounded-[4rem] border border-white/10 relative overflow-hidden flex flex-col items-center"
        >
          {/* Internal glow for the glass panel */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-lavender/20 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none" />

          {/* Hero title */}
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...SPRING_TRANSITION, delay: 0.3 }}
            className="text-5xl md:text-8xl lg:text-[7rem] font-black tracking-tighter text-white leading-[0.85] mb-12 italic uppercase max-w-full break-words relative z-10"
          >
            Hire Smarter. <br />
            <span className="text-transparent bg-clip-text bg-amethyst-gradient">Interview Better.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...SPRING_TRANSITION, delay: 0.4 }}
            className="max-w-2xl text-lg md:text-xl font-medium text-white/50 leading-relaxed tracking-tight mb-12 uppercase italic relative z-10"
          >
            Your personalized HR core—designed to master PI rounds, eliminate critical errors, and build unshakeable self-confidence through autonomous interview simulations.
          </motion.p>

          {/* Action button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 items-center relative z-10"
          >
            <button 
              onClick={onGoToLanding}
              className="group px-12 py-6 rounded-[2.5rem] bg-white text-black font-black text-lg hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-500 transform hover:scale-105 active:scale-95 shadow-2xl flex items-center gap-4 relative overflow-hidden"
            >
              <span className="relative z-10">Launch Me</span>
              <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <motion.div 
                 className="absolute inset-0 bg-gradient-to-r from-lavender to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
            </button>
            <button className="px-12 py-6 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-white/20 font-black text-lg transition-all duration-300 backdrop-blur-md flex items-center gap-4 text-white hover:bg-white/10 uppercase italic">
              Watch Demo <Play size={20} className="fill-current" />
            </button>
          </motion.div>
        </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
      >
        {/* Scroll label removed for minimalism */}
        <div className="w-px h-16 bg-gradient-to-b from-lavender to-transparent" />
        <ChevronDown size={14} className="text-lavender animate-bounce mt-2" />
      </motion.div>
    </section>
  );
};
