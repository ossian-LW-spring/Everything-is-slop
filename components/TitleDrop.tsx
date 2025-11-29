
import React, { useEffect, useState } from 'react';

interface TitleDropProps {
  onComplete: () => void;
  subtitle?: string;
}

const TitleDrop: React.FC<TitleDropProps> = ({ onComplete, subtitle }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Stage 0: Initial Pause
    // Stage 1: Big Text Fade In
    // Stage 2: Subtitle Fade In
    // Stage 3: Fade Out
    
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setStage(1), 500));
    timers.push(setTimeout(() => setStage(2), 1500));
    timers.push(setTimeout(() => setStage(3), 3500));
    timers.push(setTimeout(() => onComplete(), 4500));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-1000 ${stage === 3 ? 'opacity-0' : 'opacity-100'}`}>
      <div className="relative">
        {/* Main Title */}
        <h1 className={`
          text-4xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-emerald-800
          transition-all duration-1000 transform
          ${stage >= 1 ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10'}
        `}>
          EVERYTHING<br/>IS SLOP
        </h1>
        
        {/* Decorative Lines */}
        <div className={`
            absolute -inset-4 border-y-2 border-green-900/50
            transition-all duration-1000 delay-300
            ${stage >= 1 ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
        `}></div>
      </div>

      {/* Subtitle / Thesis Name */}
      {subtitle && (
        <div className={`
          mt-8 font-mono text-pink-500 text-sm md:text-xl tracking-[0.2em] uppercase
          transition-all duration-1000
          ${stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}>
          // THESIS: {subtitle}
        </div>
      )}
      
      {/* Loading Indicator */}
      <div className={`
        absolute bottom-10 font-mono text-xs text-slate-600 animate-pulse
        transition-opacity duration-500
        ${stage >= 1 ? 'opacity-100' : 'opacity-0'}
      `}>
        INITIALIZING REALITY SIMULATION...
      </div>
    </div>
  );
};

export default TitleDrop;
