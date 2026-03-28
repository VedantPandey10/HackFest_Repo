import * as React from 'react';
import { motion } from 'framer-motion';

interface AmethystFooterProps {
  onEnterpriseCTA: () => void;
}

export const AmethystFooter: React.FC<AmethystFooterProps> = ({ onEnterpriseCTA }) => {
  return (
    <footer className="relative py-32 px-6 overflow-hidden bg-amethyst-main border-t border-white/5">
      {/* Background radial glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amethyst-lavender/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="container mx-auto max-w-4xl text-center relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8 p-3 rounded-3xl bg-white/5 border border-white/5 inline-flex"
        >
          <div className="px-5 py-2 rounded-2xl bg-amethyst-gradient text-amethyst-main font-black text-[10px] uppercase tracking-[0.2em] italic">
            Synchronize with Future
          </div>
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-8 uppercase italic"
        >
          Upgrade your <br />
          <span className="text-transparent bg-clip-text bg-amethyst-gradient">Intelligence stack</span>
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-white/40 max-w-xl mb-12 tracking-tight uppercase font-medium italic"
        >
          Experience the definitive platform for autonomous human potential assessment. Deploy the Intelligence protocol today.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0px 20px 60px rgba(180, 168, 232, 0.2)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnterpriseCTA}
          className="px-14 py-7 rounded-[2.5rem] bg-white text-black font-black text-xl shadow-2xl hover:bg-amethyst-lavender transition-all duration-500 transform uppercase italic"
        >
          Initialize Enterprise Node
        </motion.button>
        
        <div className="mt-40 pt-10 border-t border-white/5 w-full flex flex-col md:flex-row items-center justify-between gap-6 pb-12">
           <div className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em]">
             &copy; 2026 REINCREW.AI • ALL PROTOCOLS RESERVED
           </div>
           
           <div className="flex gap-8 items-center text-[10px] text-white/40 font-black uppercase tracking-widest italic">
             <a href="#" className="hover:text-amethyst-lavender transition-all">Protocol</a>
             <a href="#" className="hover:text-amethyst-lavender transition-all">LinkedIn</a>
             <a href="#" className="hover:text-amethyst-lavender transition-all">Sync</a>
             <a href="#" className="hover:text-amethyst-lavender transition-all">Privacy</a>
           </div>
        </div>
      </div>
    </footer>
  );
};
