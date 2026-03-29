import * as React from 'react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useTransform, useSpring, MotionValue } from 'framer-motion';
import { BrainCircuit, FilePieChart, Code, Languages, LucideIcon } from 'lucide-react';

const TOTAL_FRAMES = 40;

const getFramePath = (index: number) => {
  const n = String(index).padStart(3, '0');
  return `/frames/ezgif-frame-${n}.jpg`;
};

const STORY_SECTIONS = [
  {
    id: 'intro',
    range: [0, 0.15] as [number, number],
    text: 'Meet Your AI Interviewer.',
    sub: 'Powered by ReineCrew Intelligence.',
    align: 'center' as const,
    size: 'xl' as const,
  },
  {
    id: 'precision',
    range: [0.2, 0.42] as [number, number],
    text: 'Precision-Engineered.',
    sub: 'Every question calibrated to your exact level. No fluff. Just signal.',
    align: 'left' as const,
    size: 'lg' as const,
  },
  {
    id: 'deep',
    range: [0.48, 0.68] as [number, number],
    text: 'Deep Behavioral Analysis.',
    sub: 'Tone. Pacing. Confidence. Tracked in real-time by neural models.',
    align: 'right' as const,
    size: 'lg' as const,
  },
  {
    id: 'cta',
    range: [0.75, 1.0] as [number, number],
    text: 'Ace Every Interview.',
    sub: 'Join 50,000+ candidates who hired smarter with ReineCrew.',
    align: 'center' as const,
    size: 'xl' as const,
    cta: true,
  },
];

// Floating feature labels scattered across the screen
const BENTO_CARDS = [
  {
    id: 'emotion',
    title: 'Emotion Analysis',
    icon: BrainCircuit,
    desc: 'Sentiment analysis and facial expressions mapped in real-time.',
    range: [0.55, 0.67] as [number, number],
    style: { top: '15%', left: '8%' },
  },
  {
    id: 'coding',
    title: 'Neural Coding',
    icon: Code,
    desc: 'Live coding environments with automated efficiency scoring.',
    range: [0.62, 0.76] as [number, number],
    style: { bottom: '18%', right: '6%' },
  },
  {
    id: 'dialects',
    title: '15+ Dialects',
    icon: Languages,
    desc: 'Built for a borderless talent market.',
    range: [0.72, 0.86] as [number, number],
    style: { top: '55%', left: '12%' },
  },
  {
    id: 'reports',
    title: 'Bias-Free Reports',
    icon: FilePieChart,
    desc: 'Reports generated instantly with zero bias.',
    range: [0.80, 0.95] as [number, number],
    style: { top: '22%', right: '10%' },
  },
];

// ─── Hooks & Sub-components ─────────────────────────────────

function useImageSequence(totalFrames: number) {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        loadedCount++;
        setProgress(Math.round((loadedCount / totalFrames) * 100));
        if (loadedCount === totalFrames) setLoaded(true);
      };
      img.onerror = () => {
        loadedCount++;
        setProgress(Math.round((loadedCount / totalFrames) * 100));
        if (loadedCount === totalFrames) setLoaded(true);
      };
      images.push(img);
    }
    imagesRef.current = images;
  }, [totalFrames]);

  return { loaded, progress, imagesRef };
}

function FrameCanvas({ imagesRef, frameIndex }: { imagesRef: React.MutableRefObject<HTMLImageElement[]>; frameIndex: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0 || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = w / h;
    let drawW: number, drawH: number, drawX: number, drawY: number;
    if (imgRatio > canvasRatio) {
      drawH = h; drawW = h * imgRatio;
    } else {
      drawW = w; drawH = w / imgRatio;
    }
    drawX = (w - drawW) / 2;
    drawY = (h - drawH) / 2;
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, [frameIndex, imagesRef]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [draw]);

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />;
}

function StoryText({ section, scrollProgress }: { section: typeof STORY_SECTIONS[number]; scrollProgress: MotionValue<number> }) {
  const [start, end] = section.range;
  const fadeIn = useTransform(scrollProgress, [start, start + 0.04], [0, 1]);
  const fadeOut = useTransform(scrollProgress, [end - 0.04, end], [1, 0]);
  const opacity = useTransform([fadeIn, fadeOut], ([a, b]: number[]) => Math.min(a, b));

  const alignClass =
    section.align === 'left' ? 'items-start text-left pl-8 md:pl-20 lg:pl-32'
    : section.align === 'right' ? 'items-end text-right pr-8 md:pr-20 lg:pr-32'
    : 'items-center text-center';

  const headingSize =
    section.size === 'xl'
      ? 'text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter'
      : 'text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight';

  return (
    <motion.div
      style={{ opacity }}
      className={`absolute inset-0 flex flex-col justify-center pointer-events-none z-20 ${alignClass}`}
    >
      <div className="max-w-xl space-y-4">
        <motion.h2
          className={`${headingSize} text-white/90 leading-[0.95]`}
          style={{ textShadow: '0 0 60px rgba(180,168,232,0.15)' }}
        >
          {section.text}
        </motion.h2>
        <p className="text-sm md:text-base font-medium text-white/50 leading-relaxed max-w-sm">
          {section.sub}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Scroll-synced floating feature label ────────────────────
function ScrollBentoCard({ card, scrollProgress }: {
  card: typeof BENTO_CARDS[number];
  scrollProgress: MotionValue<number>;
}) {
  const [start, end] = card.range;

  const opacity = useTransform(scrollProgress, [start, start + 0.04, end - 0.04, end], [0, 1, 1, 0]);
  const y = useTransform(scrollProgress, [start, start + 0.05], [40, 0]);
  const blur = useTransform(scrollProgress, [start, start + 0.03, end - 0.03, end], [8, 0, 0, 8]);

  const Icon = card.icon;

  return (
    <motion.div
      style={{
        opacity,
        y,
        filter: useTransform(blur, (v) => `blur(${v}px)`),
        ...card.style,
      }}
      className="absolute z-30 pointer-events-none max-w-[300px] md:max-w-[340px]"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-lavender/15 flex items-center justify-center text-lavender">
          <Icon size={20} />
        </div>
        <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white/90" style={{ textShadow: '0 2px 30px rgba(0,0,0,0.6)' }}>
          {card.title}
        </h3>
      </div>
      <p className="text-sm font-medium text-white/50 leading-relaxed pl-[52px]" style={{ textShadow: '0 1px 20px rgba(0,0,0,0.8)' }}>
        {card.desc}
      </p>
    </motion.div>
  );
}

function LoadingScreen({ progress }: { progress: number }) {
  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0f] flex flex-col items-center justify-center">
      <div className="mb-12 flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#b4a8e8] to-[#dcd7f2] flex items-center justify-center shadow-2xl shadow-[#b4a8e8]/30">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#0a0a0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-lg font-bold tracking-[0.3em] text-white/80 uppercase">ReineCrew</span>
      </div>
      <div className="w-64 space-y-3">
        <div className="h-px w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#b4a8e8] to-[#dcd7f2] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-bold tracking-[0.25em] uppercase text-white/20">
          <span>Initializing AI</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
}

function SectionDot({ section, smoothProgress }: { section: typeof STORY_SECTIONS[number]; smoothProgress: MotionValue<number> }) {
  const [start, end] = section.range;
  const mid = (start + end) / 2;
  const dotOpacity = useTransform(smoothProgress, [start, mid, end], [0.2, 1, 0.2]);
  return <motion.div style={{ opacity: dotOpacity }} className="w-1.5 h-1.5 rounded-full bg-[#b4a8e8]" />;
}

function ScrollIndicator({ smoothProgress }: { smoothProgress: MotionValue<number> }) {
  const opacity = useTransform(smoothProgress, [0, 0.08], [1, 0]);
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3">
      <motion.div style={{ opacity }} className="flex flex-col items-center gap-2">
        <span className="text-[9px] uppercase tracking-[0.5em] font-bold text-white/20">Scroll to Explore</span>
        <div className="w-px h-10 bg-gradient-to-b from-[#b4a8e8]/60 to-transparent" />
      </motion.div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Main: uses native scroll listener instead of sticky positioning
// ──────────────────────────────────────────────────────────────
// ─── Launch Me Button ────────────────────────────────────────
function LaunchMeButton({ scrollProgress, onLaunch }: { scrollProgress: MotionValue<number>; onLaunch: () => void }) {
  // Button starts appearing at 0.93 (while CTA text is still partially visible)
  // Fully visible and clickable at 1.0 (when text has completely faded)
  const opacity = useTransform(scrollProgress, [0.93, 1.0], [0, 1]);
  const y = useTransform(scrollProgress, [0.93, 1.0], [60, 0]);
  const scale = useTransform(scrollProgress, [0.93, 0.97, 1.0], [0.85, 0.95, 1]);
  const pointerEvents = useTransform(scrollProgress, (v) => v >= 0.97 ? 'auto' : 'none');

  return (
    <motion.div
      style={{ opacity, y, scale, pointerEvents: pointerEvents as any }}
    >
      <motion.button
        onClick={onLaunch}
        whileHover={{ scale: 1.08, boxShadow: '0 0 50px rgba(99, 102, 241, 0.4)' }}
        whileTap={{ scale: 0.95 }}
        className="group relative px-12 py-4 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm tracking-widest uppercase transition-all duration-300 shadow-2xl shadow-indigo-600/40 overflow-hidden"
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        <span className="relative flex items-center gap-3">
          Launch Me
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
      </motion.button>
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────────
// Main: uses native scroll listener instead of sticky positioning
// ──────────────────────────────────────────────────────────────
export default function RoboScroll({ onGoToLanding }: { onGoToLanding?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { loaded, progress, imagesRef } = useImageSequence(TOTAL_FRAMES);
  const [frameIndex, setFrameIndex] = useState(0);
  const [scrollFraction, setScrollFraction] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Native scroll listener — bulletproof, no dependency on sticky/overflow
  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      const totalScroll = el.offsetHeight - windowH;
      if (totalScroll <= 0) return;

      const scrolled = -rect.top;
      const frac = Math.max(0, Math.min(1, scrolled / totalScroll));
      setScrollFraction(frac);

      // Robot frames mapped to first 60% of scroll
      const robotFrac = Math.min(1, frac / 0.6);
      setFrameIndex(Math.round(robotFrac * (TOTAL_FRAMES - 1)));

      // Show only when container is in view
      setIsVisible(rect.bottom > 0 && rect.top < windowH);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Create a spring-smoothed MotionValue for text overlays
  const rawProgress = useSpring(0, { stiffness: 80, damping: 20, restDelta: 0.001 });

  useEffect(() => {
    rawProgress.set(scrollFraction);
  }, [scrollFraction, rawProgress]);

  const glowOpacity = useTransform(rawProgress, [0, 0.5, 1], [0.3, 0.5, 0.25]);
  // Darken the robot canvas as bento cards appear
  const canvasDim = useTransform(rawProgress, [0.5, 0.65], [1, 0.3]);

  const totalDots = STORY_SECTIONS.length + BENTO_CARDS.length;

  return (
    <>
      {!loaded && <LoadingScreen progress={progress} />}

      {/* Tall container that creates scroll distance */}
      <div ref={containerRef} style={{ height: '900vh' }} className="relative">
        {/* Fixed viewport — pinned to screen while inside the container */}
        <div
          className="w-full overflow-hidden bg-[#0a0a0f]"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '100vh',
            zIndex: 5,
            opacity: isVisible ? 1 : 0,
            pointerEvents: isVisible ? 'auto' : 'none',
            transition: 'opacity 0.15s ease',
          }}
        >
          {/* Ambient background glow */}
          <motion.div style={{ opacity: glowOpacity }} className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#2a2244] blur-[150px]" />
          </motion.div>

          {/* Canvas with dimming */}
          <motion.div className="absolute inset-0 z-10" style={{ opacity: canvasDim }}>
            {loaded && <FrameCanvas imagesRef={imagesRef} frameIndex={frameIndex} />}
          </motion.div>

          {/* Story text overlays */}
          {STORY_SECTIONS.map((section) => (
            <StoryText key={section.id} section={section} scrollProgress={rawProgress} />
          ))}

          {/* Floating feature labels */}
          <div className="absolute inset-0 z-25 flex items-center justify-center pointer-events-none">
            {BENTO_CARDS.map((card) => (
              <ScrollBentoCard key={card.id} card={card} scrollProgress={rawProgress} />
            ))}
          </div>

          {/* Scroll indicator */}
          <ScrollIndicator smoothProgress={rawProgress} />

          {/* Section dots */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
            {STORY_SECTIONS.map((s) => (
              <SectionDot key={s.id} section={s} smoothProgress={rawProgress} />
            ))}
          </div>

          {/* Vignette */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, transparent 50%, #0a0a0f 100%)' }}
          />
        </div>

        {/* Launch Me button — sits at the bottom of the scroll container, in normal flow above footer */}
        {onGoToLanding && (
          <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center pb-12 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/80 to-transparent pt-24">
            <LaunchMeButton scrollProgress={rawProgress} onLaunch={onGoToLanding} />
          </div>
        )}
      </div>
    </>
  );
}
