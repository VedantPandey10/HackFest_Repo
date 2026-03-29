import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

interface PremiumNavbarProps {
  onGoToLanding: () => void;
}

const PremiumNavbar: React.FC<PremiumNavbarProps> = ({ onGoToLanding }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.3 }}
      className="fixed top-6 right-6 z-50"
    >
      <div className={`flex items-center gap-3 pl-1.5 pr-2 py-1.5 rounded-full border border-white/10 backdrop-blur-2xl transition-all duration-500 ${
        scrolled ? 'bg-[#0a0a1a]/80 shadow-lg shadow-black/30' : 'bg-[#0a0a1a]/50'
      }`}>
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#6366f1] flex items-center justify-center">
            <BrainCircuit size={18} strokeWidth={2} className="text-white" />
          </div>
          <span className="text-sm font-bold tracking-widest text-white uppercase">
            Reincrew<span className="text-[#6366f1]">.AI</span>
          </span>
        </div>

        {/* Explore Platform Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onGoToLanding}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="5.5" height="5.5" rx="1.5" stroke="white" strokeWidth="1.5" opacity="0.7"/>
            <rect x="9.5" y="1" width="5.5" height="5.5" rx="1.5" stroke="white" strokeWidth="1.5" opacity="0.7"/>
            <rect x="1" y="9.5" width="5.5" height="5.5" rx="1.5" stroke="white" strokeWidth="1.5" opacity="0.7"/>
            <rect x="9.5" y="9.5" width="5.5" height="5.5" rx="1.5" stroke="white" strokeWidth="1.5" opacity="0.7"/>
          </svg>
          <span className="text-[11px] font-bold tracking-[0.15em] text-white/70 uppercase">
            Owner Login
          </span>
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default PremiumNavbar;
