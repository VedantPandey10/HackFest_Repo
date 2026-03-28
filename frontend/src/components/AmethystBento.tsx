import * as React from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { Terminal, BrainCircuit, Globe, FilePieChart, Code, Sparkles, Languages, LucideIcon } from 'lucide-react';

const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 100,
  damping: 20,
} as const;

interface BentoCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: LucideIcon;
}

const BentoCard: React.FC<BentoCardProps> = ({ title, children, className, icon: Icon }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useSpring(mouseX, { stiffness: 150, damping: 25 });
  const glowY = useSpring(mouseY, { stiffness: 150, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const cardVariants = {
    initial: { y: 40, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: SPRING_TRANSITION
    },
    hover: {
      scale: 1.02,
      backgroundColor: "rgba(15, 23, 42, 0.8)",
      boxShadow: "0px 20px 60px rgba(99, 102, 241, 0.15)",
    }
  };

  const iconVariants = {
    initial: { opacity: 0.0, scale: 1 },
    visible: { opacity: 0.0, scale: 1 },
    hover: { 
      opacity: 1, 
      scale: 1.1,
      transition: { duration: 0.8 }
    }
  };

  const currentVariants = {
    hover: {
      maskPosition: ["-150% -150%", "250% 250%"],
      transition: {
        duration: 8,
        repeat: Infinity,
        repeatDelay: 2,
        ease: "linear" as const
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileInView="visible"
      whileHover="hover"
      onMouseMove={handleMouseMove}
      viewport={{ once: true }}
      className={`group relative overflow-hidden glass-card rounded-[3rem] p-10 flex flex-col justify-between cursor-pointer ${className}`}
    >
      {/* Dynamic Glow Layer */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[3rem] transition duration-300 opacity-0 group-hover:opacity-100 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${glowX}px ${glowY}px,
              rgba(99, 102, 241, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      {/* Hidden Design - Circuit Background */}
      <div className="absolute top-0 right-0 p-8 text-lavender pointer-events-none z-0">
        <motion.div
          variants={iconVariants}
          className="relative"
        >
          {/* Static Dimmed Base */}
          <div className="opacity-10 blur-[1px]">
             {Icon && <Icon size={160} strokeWidth={0.1} />}
          </div>

          {/* Moving Current Layer */}
          <motion.div
            variants={currentVariants}
            className="absolute inset-0 text-white drop-shadow-[0_0_20px_rgba(99,102,241,0.8)] drop-shadow-[0_0_40px_rgba(99,102,241,0.4)]"
            style={{
              maskImage: "linear-gradient(135deg, transparent 40%, black 50%, transparent 60%)",
              WebkitMaskImage: "linear-gradient(135deg, transparent 40%, black 50%, transparent 60%)",
              maskSize: "300% 300%",
              WebkitMaskSize: "300% 300%",
            }}
          >
            {Icon && <Icon size={160} strokeWidth={0.3} />}
          </motion.div>

          {/* Highlight Pulse Layer (Extra depth) */}
          <motion.div
            variants={currentVariants}
            className="absolute inset-0 text-lavender/40 blur-[2px]"
            style={{
              maskImage: "linear-gradient(135deg, transparent 35%, black 50%, transparent 65%)",
              WebkitMaskImage: "linear-gradient(135deg, transparent 35%, black 50%, transparent 65%)",
              maskSize: "300% 300%",
              WebkitMaskSize: "300% 300%",
            }}
          >
            {Icon && <Icon size={160} strokeWidth={0.5} />}
          </motion.div>
        </motion.div>
      </div>

      <div className="relative z-20 h-full flex flex-col">
        <div className="mb-6 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-lavender group-hover:text-main group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-500">
          {Icon && <Icon size={20} />}
        </div>
        
        <h3 className="text-3xl font-black tracking-tight mb-4 text-white leading-tight uppercase italic group-hover:text-lavender transition-colors duration-500">
          {title}
        </h3>
        
        <div className="mt-auto pointer-events-none font-medium italic">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export const AmethystBento: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  };

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto" id="capabilities">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
        
        {/* Sticky Sidebar */}
        <div className="lg:w-1/4 lg:sticky lg:top-40 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={SPRING_TRANSITION}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-lavender/40 block mb-4">Neural Infrastructure</span>
            <h2 className="text-6xl font-black italic tracking-tighter text-white leading-[0.8] mb-8 uppercase">
              Future <br />
              <span className="text-lavender">of Talent.</span>
            </h2>
            <p className="text-white/30 font-medium leading-relaxed tracking-tight italic uppercase text-[10px]">
              Deploy autonomous agents that map human potential with surgical precision.
            </p>
          </motion.div>
        </div>

        {/* Scrolling Bento Grid */}
        <motion.div 
          className="lg:w-3/4 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 auto-rows-[250px] md:auto-rows-[300px] gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Card 1: Emotion Tracking */}
          <BentoCard 
            title="Biometric Sync" 
            icon={BrainCircuit}
            className="md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2"
          >
            <div className="space-y-4">
              <p className="text-lg font-medium text-white/50 leading-snug uppercase">
                Synchronous behavioral and micro-expression mapping. 
              </p>
              <div className="mt-4 flex items-center justify-between gap-2 p-5 rounded-3xl bg-white/5 border border-white/5">
                <div className="flex gap-1.5 h-12 items-end">
                  {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.4].map((h, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: [`${h*100}%`, `${(h+0.15)*100}%`, `${h*100}%`] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                      className="w-2 bg-lavender rounded-full" 
                    />
                  ))}
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Card 2: Code Assessment */}
          <BentoCard 
            title="Logic Engine" 
            icon={Code}
            className="md:col-span-2 md:row-span-2 lg:col-span-4 lg:row-span-2"
          >
             <div className="flex flex-col h-full">
              <p className="text-lg font-medium text-white/50 leading-snug mb-8 uppercase">
                Sub-millisecond analysis of complex problem-solving patterns.
              </p>
              <div className="mt-auto rounded-3xl bg-main border border-white/5 overflow-hidden font-mono text-[10px] md:text-xs">
                 <div className="p-6 space-y-1 text-white/30 italic">
                   <div className="flex gap-4"><span><span className="text-lavender">const</span> engine = <span className="text-lilac">await</span> AI.<span className="text-lilac">sync</span>()</span></div>
                   <div className="flex gap-4"><span><span className="text-lavender">engine</span>.<span className="text-lilac">mapPotential</span>(candidate_id)</span></div>
                   <div className="flex gap-4"><span><span className="text-white/10"># Processing high-level vectors...</span></span></div>
                 </div>
              </div>
            </div>
          </BentoCard>

          {/* Card 3: Global Languages */}
          <BentoCard 
            title="Linguistic Sync" 
            icon={Languages}
            className="md:col-span-2 md:row-span-1 lg:col-span-3 lg:row-span-1"
          >
             <div className="flex items-center justify-between pr-4 h-full">
               <p className="text-lg font-medium text-white/50 leading-snug uppercase">
                 Deciphering talent across <br /> every dialect.
               </p>
               <div className="text-5xl font-black text-white italic opacity-10 group-hover:opacity-100 transition-opacity duration-700">GLO.</div>
            </div>
          </BentoCard>

          {/* Card 4: Reports */}
          <BentoCard 
            title="Realtime Intel" 
            icon={FilePieChart}
            className="md:col-span-2 md:row-span-1 lg:col-span-3 lg:row-span-1"
          >
             <div className="flex items-center justify-between pr-4 h-full">
               <p className="text-lg font-medium text-white/50 leading-snug uppercase">
                 Instantaneous growth <br /> reporting.
               </p>
               <div className="text-5xl font-black text-white italic opacity-10 group-hover:opacity-100 transition-opacity duration-700">REP.</div>
            </div>
          </BentoCard>
        </motion.div>
      </div>
    </section>
  );
};
