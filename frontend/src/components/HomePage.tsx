import * as React from 'react';
import { motion } from 'framer-motion';
import { AmethystNavbar } from './AmethystNavbar';
import { AmethystHero } from './AmethystHero';
import { AmethystBento } from './AmethystBento';
import { AmethystFooter } from './AmethystFooter';

interface HomePageProps {
  onGoToLanding: () => void;
  onEnterpriseCTA: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onGoToLanding, onEnterpriseCTA }) => {
  const orbs = [
    { color: "bg-indigo-600/20", size: "w-[600px] h-[600px]", top: "-10%", left: "-10%", duration: 15 },
    { color: "bg-lavender/30", size: "w-[800px] h-[800px]", bottom: "-10%", right: "-10%", duration: 20 },
    { color: "bg-blue-500/10", size: "w-[400px] h-[400px]", top: "20%", right: "10%", duration: 18 },
    { color: "bg-purple-600/15", size: "w-[500px] h-[500px]", bottom: "20%", left: "5%", duration: 22 },
  ];

  return (
    <div className="min-h-screen bg-amethyst-main bg-slate-950 overflow-x-hidden selection:bg-amethyst-lavender selection:text-amethyst-main relative">
      {/* Dynamic Background Orbs for Glassmorphism */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {orbs.map((orb, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full blur-[120px] ${orb.color} ${orb.size}`}
            initial={{ opacity: 0.4, x: 0, y: 0 }}
            animate={{ 
              x: [0, 50, -50, 0], 
              y: [0, -30, 40, 0],
              opacity: [0.4, 0.6, 0.4] 
            }}
            transition={{
              duration: orb.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2
            }}
            style={{
              top: orb.top,
              left: orb.left,
              bottom: orb.bottom,
              right: orb.right
            }}
          />
        ))}
      </div>

      <AmethystNavbar onGoToLanding={onGoToLanding} />
      
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <AmethystHero onGoToLanding={onGoToLanding} />
        <AmethystBento />
        <AmethystFooter onEnterpriseCTA={onEnterpriseCTA} />
      </motion.div>
    </div>
  );
};
