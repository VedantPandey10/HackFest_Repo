import * as React from 'react';
import { motion } from 'framer-motion';
import PremiumNavbar from './PremiumNavbar';
import RoboScroll from './RoboScroll';
import PremiumFooter from './PremiumFooter';

interface HomePageProps {
  onGoToLanding: () => void;
  onEnterpriseCTA: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onGoToLanding, onEnterpriseCTA }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-lavender selection:text-main relative">
      <PremiumNavbar onGoToLanding={onGoToLanding} />
      
      <main className="relative z-10">
        <RoboScroll onGoToLanding={onGoToLanding} />
        <PremiumFooter onEnterpriseCTA={onEnterpriseCTA} />
      </main>

      {/* Dynamic Background Orbs for extra depth */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
            className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] bg-indigo-600/10"
            animate={{ 
              opacity: [0.1, 0.2, 0.1],
              scale: [1, 1.1, 1] 
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
        />
        <motion.div
            className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full blur-[120px] bg-lavender/10"
            animate={{ 
              opacity: [0.1, 0.15, 0.1],
              scale: [1.1, 1, 1.1] 
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
        />
      </div>
    </div>
  );
};
