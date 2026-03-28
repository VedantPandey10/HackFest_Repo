import * as React from 'react';
import { BrainCircuit } from 'lucide-react';

interface PremiumFooterProps {
  onEnterpriseCTA: () => void;
}

const PremiumFooter: React.FC<PremiumFooterProps> = ({ onEnterpriseCTA }) => {
  return (
    <footer className="py-20 border-t border-white/5 bg-main relative z-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          {/* Logo & Info */}
          <div className="flex flex-col items-center md:items-start gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#6366f1] flex items-center justify-center shadow-lg shadow-[#6366f1]/20">
                <BrainCircuit size={22} strokeWidth={2} className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-widest text-white uppercase">
                Reincrew<span className="text-[#6366f1]">.AI</span>
              </span>
            </div>
            <p className="text-sm font-medium text-white/30 max-w-xs text-center md:text-left leading-relaxed">
              Redefining the standard of technical evaluation through autonomous AI intelligence.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-24">
            <div className="space-y-6">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/20">Platform</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-sm font-medium text-white/50 hover:text-lavender transition-colors">Intelligence</a></li>
                <li><a href="#" className="text-sm font-medium text-white/50 hover:text-lavender transition-colors">Dialects</a></li>
                <li><a href="#" className="text-sm font-medium text-white/50 hover:text-lavender transition-colors">Bento Core</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/20">Resources</h4>
                <ul className="space-y-4">
                <li><a href="#" className="text-sm font-medium text-white/50 hover:text-lavender transition-colors">Documentation</a></li>
                <li><a href="#" className="text-sm font-medium text-white/50 hover:text-lavender transition-colors">Changelog</a></li>
                <li><a href="#" className="text-sm font-medium text-white/50 hover:text-lavender transition-colors">Status</a></li>
              </ul>
            </div>
            <div className="space-y-6 hidden lg:block">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/20">Legal</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-sm font-medium text-white/50 hover:text-lavender transition-colors">Privacy</a></li>
                <li><a href="#" className="text-sm font-medium text-white/50 hover:text-lavender transition-colors">Terms</a></li>
                <li><a onClick={onEnterpriseCTA} className="text-sm font-medium text-white/50 hover:text-lavender transition-colors cursor-pointer">Enterprise</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold tracking-widest text-white/20 uppercase">
            © 2026 ReineCrew Intelligence Systems. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] font-bold tracking-widest text-white/20 uppercase hover:text-white transition-colors">Twitter</a>
            <a href="#" className="text-[10px] font-bold tracking-widest text-white/20 uppercase hover:text-white transition-colors">Github</a>
            <a href="#" className="text-[10px] font-bold tracking-widest text-white/20 uppercase hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PremiumFooter;
