import * as React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, FilePieChart, Code, Languages, LucideIcon } from 'lucide-react';

const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 100,
  damping: 20,
} as const;

interface BentoCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  icon: LucideIcon;
}

const BentoCard: React.FC<BentoCardProps> = ({ title, children, className, icon: Icon }) => {
  const cardVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: SPRING_TRANSITION
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ 
        scale: 1.02, 
        backgroundColor: "rgba(30, 30, 50, 0.6)",
        boxShadow: "0px 10px 40px rgba(198, 178, 229, 0.15)",
        transition: { duration: 0.3 }
      }}
      className={`group relative overflow-hidden bento-card p-10 flex flex-col justify-between cursor-pointer ${className}`}
    >
      <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-lavender transition-all duration-700 pointer-events-none">
        {Icon && <Icon size={160} strokeWidth={0.3} />}
      </div>

      <div className="relative z-10 h-full flex flex-col">
        <div className="mb-6 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-lavender group-hover:text-main transition-all duration-500">
          {Icon && <Icon size={20} />}
        </div>
        
        <h3 className="text-3xl font-extrabold tracking-tight mb-4 text-white leading-tight">
          {title}
        </h3>
        
        <div className="mt-auto pointer-events-none">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

const PremiumBento: React.FC = () => {
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
    <section className="py-32 px-6 container mx-auto" id="features">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
        
        {/* Sticky Sidebar */}
        <div className="lg:w-1/4 lg:sticky lg:top-40 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={SPRING_TRANSITION}
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-lavender/60 block mb-4">Core Intelligence</span>
            <h2 className="text-5xl font-black italic tracking-tighter text-white leading-[0.9] mb-8">
              The Next <br />
              <span className="text-gradient">Dimension</span> <br />
              of Hiring.
            </h2>
            <p className="text-white/40 font-medium leading-relaxed tracking-tight">
              Our AI doesn't just ask questions. It observes, analyzes, and predicts candidate success with 99.4% accuracy.
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
            title="Emotion Analysis" 
            icon={BrainCircuit}
            className="md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2"
          >
            <div className="space-y-4">
              <p className="text-lg font-medium text-white/50 leading-snug">
                Sentiment analysis and facial expressions mapped in real-time. 
              </p>
              <div className="mt-4 flex items-center justify-between gap-2 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex gap-1 h-12 items-end">
                  {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.4].map((h, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: [`${h*100}%`, `${(h+0.1)*100}%`, `${h*100}%`] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                      className="w-2 bg-lavender rounded-full" 
                    />
                  ))}
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Card 2: Code Assessment */}
          <BentoCard 
            title="Neural Coding" 
            icon={Code}
            className="md:col-span-2 md:row-span-2 lg:col-span-4 lg:row-span-2"
          >
             <div className="flex flex-col h-full">
              <p className="text-lg font-medium text-white/50 leading-snug mb-8">
                Live coding environments with automated efficiency scoring.
              </p>
              <div className="mt-auto rounded-2xl bg-[#08080c]/80 border border-white/5 overflow-hidden font-mono text-[10px] md:text-sm">
                 <div className="p-4 space-y-1 text-white/40">
                   <div className="flex gap-4"><span><span className="text-lavender">const</span> model = <span className="text-lilac">await</span> AI.<span className="text-lilac">load</span>()</span></div>
                   <div className="flex gap-4"><span><span className="text-lavender">model</span>.<span className="text-lilac">track</span>(candidate_id)</span></div>
                 </div>
              </div>
            </div>
          </BentoCard>

          {/* Card 3: Global Languages */}
          <BentoCard 
            title="15+ Dialects" 
            icon={Languages}
            className="md:col-span-2 md:row-span-1 lg:col-span-3 lg:row-span-1"
          >
             <div className="flex items-center justify-between pr-4">
               <p className="text-lg font-medium text-white/50 leading-snug">
                 Built for a borderless <br /> talent market.
               </p>
               <div className="text-4xl font-black text-white italic opacity-20 group-hover:opacity-100 transition-opacity duration-500">EN.</div>
            </div>
          </BentoCard>

          {/* Card 4: Reports */}
          <BentoCard 
            title="Bias-Free" 
            icon={FilePieChart}
            className="md:col-span-2 md:row-span-1 lg:col-span-3 lg:row-span-1"
          >
             <div className="flex items-center justify-between pr-4">
               <p className="text-lg font-medium text-white/50 leading-snug">
                 Reports generated <br /> instantly.
               </p>
               <div className="text-4xl font-black text-white italic opacity-20 group-hover:opacity-100 transition-opacity duration-500">RT.</div>
            </div>
          </BentoCard>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumBento;
