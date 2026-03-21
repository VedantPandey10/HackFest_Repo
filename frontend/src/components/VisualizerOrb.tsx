import React, { useEffect, useState } from 'react';
import { InterviewStatus } from '../types';

interface VisualizerOrbProps {
  status: InterviewStatus;
  pulse?: number; // Increments on every speech word boundary
}

export const VisualizerOrb: React.FC<VisualizerOrbProps> = ({ status, pulse = 0 }) => {
  // Determine visual state based on status
  // ASKING = Speaking (Active, Energetic)
  // LISTENING = Listening (Receptive, Gentle Pulse)
  // THINKING = Processing (Fast Spin/Shimmer)
  // IDLE/LOADING = Neutral
  // LOCKED = Error/Static

  const isSpeaking = status === InterviewStatus.ASKING;
  const isListening = status === InterviewStatus.LISTENING;
  const isThinking = status === InterviewStatus.THINKING || status === InterviewStatus.LOADING_QUESTION;
  const isLocked = status === InterviewStatus.LOCKED;

  // Base colors
  let coreColor = "bg-indigo-600";
  let glowColor = "shadow-indigo-500/50";
  let rippleColor = "bg-indigo-500/10";

  if (isListening) {
    coreColor = "bg-cyan-400";
    glowColor = "shadow-cyan-400/50";
    rippleColor = "bg-cyan-400/10";
  } else if (isThinking) {
    coreColor = "bg-violet-500";
    glowColor = "shadow-violet-500/50";
    rippleColor = "bg-violet-500/10";
  } else if (isLocked) {
    coreColor = "bg-rose-600";
    glowColor = "shadow-rose-600/50";
    rippleColor = "bg-rose-600/10";
  }

  // Pulse Logic for Speech Sync
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (isSpeaking && pulse > 0) {
      setScale(1.15);
      const t = setTimeout(() => setScale(1), 100);
      return () => clearTimeout(t);
    } else if (!isSpeaking) {
      setScale(1);
    }
  }, [pulse, isSpeaking]);

  return (
    <div className="relative w-full h-64 flex items-center justify-center my-8">
      {/* --- Animation Layers --- */}

      {/* Layer 1: Outer Sound Waves (Only when speaking) */}
      {isSpeaking && (
        <>
          <div className={`absolute w-32 h-32 rounded-full border border-indigo-500/30 opacity-0 animate-sound-wave`} style={{ animationDelay: '0s' }}></div>
          <div className={`absolute w-32 h-32 rounded-full border border-indigo-400/20 opacity-0 animate-sound-wave`} style={{ animationDelay: '0.6s' }}></div>
        </>
      )}

      {/* Layer 2: Listening Ripple (Only when listening) */}
      {isListening && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-48 h-48 bg-cyan-400/10 rounded-full animate-ping"></div>
          <div className="absolute w-40 h-40 bg-cyan-400/5 rounded-full animate-pulse"></div>
        </div>
      )}

      {/* Layer 3: The Liquid Orb Core */}
      <div className="relative z-10">
        {/* Background Glow */}
        <div className={`absolute inset-[-40px] blur-[60px] opacity-40 rounded-full ${coreColor} animate-pulse-slow`}></div>

        {/* The Main Morphing Blob */}
        <div
          className={`w-32 h-32 ${coreColor} shadow-[0_0_50px_rgba(0,0,0,0.3)] ${glowColor} transition-all duration-200 ease-out relative overflow-hidden
            ${isListening ? 'scale-95 animate-pulse' : ''}
            ${isThinking ? 'animate-spin-slow rounded-full' : ''}
            ${!isSpeaking && !isListening && !isThinking ? 'animate-morph' : ''}
          `}
          style={{
            transform: isSpeaking ? `scale(${scale})` : undefined,
            borderRadius: isThinking ? '50%' : '60% 40% 30% 70% / 60% 30% 70% 40%'
          }}
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-black/20"></div>

          {/* Inner reflection/sheen */}
          <div className="absolute top-4 left-6 w-10 h-8 bg-white/30 rounded-full blur-md"></div>
        </div>
      </div>

      {/* Status Text Label (Floating below) */}
      <div className="absolute bottom-4 font-black text-[10px] tracking-[0.3em] uppercase text-white/40">
        {isSpeaking && <span className="text-indigo-400 shimmer-text">Cognitive Output...</span>}
        {isListening && <span className="text-cyan-400 animate-pulse">Neural Receptive...</span>}
        {isThinking && <span className="text-violet-400">Processing Logic...</span>}
        {isLocked && <span className="text-rose-600">LINK SEVERED</span>}
      </div>
    </div>
  );
};