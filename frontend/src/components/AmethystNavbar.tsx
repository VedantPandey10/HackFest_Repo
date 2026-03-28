import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, ArrowRight, BrainCircuit } from 'lucide-react';

interface AmethystNavbarProps {
  onGoToLanding: () => void;
}

export const AmethystNavbar: React.FC<AmethystNavbarProps> = ({ onGoToLanding }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed z-50 right-8 transition-all duration-500 ${scrolled ? "top-4" : "top-6"
        }`}
    >
      <div className={`w-fit flex items-center gap-6 px-6 py-4 rounded-full border border-white/10 backdrop-blur-2xl transition-all duration-500 ${scrolled ? "bg-amethyst-card/80 py-3 shadow-xl" : "bg-transparent"
        }`}>

        {/* Brand Logo moved to left of button for balance */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amethyst-gradient flex items-center justify-center">
            <BrainCircuit className="text-amethyst-main" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white uppercase italic">
            REIN<span className="text-amethyst-lavender">CREW.AI</span>
          </span>
        </div>

        {/* Explore Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onGoToLanding}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all group"
        >
          <LayoutGrid size={14} className="group-hover:rotate-90 transition-transform" />
          Explore Platform
        </motion.button>
      </div>
    </motion.nav>
  );
};
