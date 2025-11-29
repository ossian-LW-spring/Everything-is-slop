
import React, { useEffect, useState, useRef } from 'react';
import { BREATH_INTERVAL_MS } from '../constants';
import { Activity, AlertTriangle, Ban } from 'lucide-react';

interface ManualBreathingProps {
  isActive: boolean;
  onDie: () => void;
  isBlocked?: boolean; // New prop to indicate if blocked by Ad
}

const ManualBreathing: React.FC<ManualBreathingProps> = ({ isActive, onDie, isBlocked }) => {
  const [timeLeft, setTimeLeft] = useState(BREATH_INTERVAL_MS);
  const lastBreathRef = useRef<number>(Date.now());
  const requestRef = useRef<number | null>(null);

  const breathe = () => {
    if (isBlocked) return; // Prevent breathing if blocked
    lastBreathRef.current = Date.now();
    setTimeLeft(BREATH_INTERVAL_MS);
  };

  useEffect(() => {
    if (!isActive) return;

    const tick = () => {
      const now = Date.now();
      const elapsed = now - lastBreathRef.current;
      const remaining = BREATH_INTERVAL_MS - elapsed;

      if (remaining <= 0) {
        onDie();
      } else {
        setTimeLeft(remaining);
        requestRef.current = requestAnimationFrame(tick);
      }
    };

    // Only reset lastBreath if we are starting fresh from inactive state, 
    // NOT if we are just re-rendering (e.g. because isBlocked changed)
    if (!lastBreathRef.current || (Date.now() - lastBreathRef.current > BREATH_INTERVAL_MS)) {
        lastBreathRef.current = Date.now();
    }
    
    requestRef.current = requestAnimationFrame(tick);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isActive, onDie]);

  if (!isActive) return null;

  const dangerLevel = timeLeft < 3000;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-center">
      {isBlocked && (
         <div className="mb-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 animate-pulse border border-red-400">
             OBSTRUCTION DETECTED
         </div>
      )}
      {!isBlocked && (
        <div className={`mb-2 font-bold bg-black px-2 border ${dangerLevel ? 'text-red-500 border-red-500 animate-pulse' : 'text-yellow-400 border-yellow-400'}`}>
            <div className="flex items-center gap-2">
                <AlertTriangle size={16} />
                <span>AUTONOMIC FAILURE</span>
            </div>
        </div>
      )}
      
      <button
        onClick={breathe}
        disabled={isBlocked}
        className={`
          relative w-32 h-32 rounded-full border-4 flex items-center justify-center
          transition-all shadow-lg
          ${isBlocked 
            ? 'bg-slate-900 border-slate-700 opacity-80 cursor-not-allowed grayscale' 
            : dangerLevel 
                ? 'bg-red-900 border-red-500 animate-pulse shadow-red-500/50 active:scale-95' 
                : 'bg-slate-800 border-blue-400 shadow-blue-500/50 active:scale-95'
          }
        `}
      >
        <div className="text-center relative z-10">
            {isBlocked ? (
                <Ban className="mx-auto mb-1 text-red-500" size={32} />
            ) : (
                <Activity className={`mx-auto mb-1 ${dangerLevel ? 'text-red-300' : 'text-blue-300'}`} />
            )}
            
            <span className={`text-xs font-bold ${dangerLevel || isBlocked ? 'text-red-100' : 'text-blue-100'}`}>
                {isBlocked ? 'BLOCKED' : 'MANUAL\nBREATHE'}
            </span>
            <div className="mt-1 text-xs font-mono">
                {(timeLeft / 1000).toFixed(1)}s
            </div>
        </div>
        
        {/* Progress Ring */}
        <svg className="absolute top-0 left-0 w-full h-full -rotate-90 pointer-events-none">
            <circle
                cx="64" cy="64" r="60"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray="377"
                strokeDashoffset={377 * (1 - timeLeft / BREATH_INTERVAL_MS)}
                className={dangerLevel || isBlocked ? 'text-red-500' : 'text-blue-400'}
            />
        </svg>
      </button>
    </div>
  );
};

export default ManualBreathing;