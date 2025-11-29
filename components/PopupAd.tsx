import React, { useEffect, useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { AD_CONTENTS, CLOUT_SKIP_COST } from '../constants';

interface PopupAdProps {
  onComplete: () => void;
  onSkipWithClout: () => void;
  cloutAvailable: number;
}

const PopupAd: React.FC<PopupAdProps> = ({ onComplete, onSkipWithClout, cloutAvailable }) => {
  const [timeLeft, setTimeLeft] = useState(5);
  const [adContent] = useState(() => AD_CONTENTS[Math.floor(Math.random() * AD_CONTENTS.length)]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const canSkip = timeLeft === 0;
  const canPayToSkip = cloutAvailable >= CLOUT_SKIP_COST;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
      <div className="bg-white max-w-md w-full border-4 border-pink-500 shadow-[10px_10px_0px_0px_rgba(236,72,153,1)] relative">
        
        {/* Header */}
        <div className="bg-pink-500 text-white p-2 font-bold flex justify-between items-center">
          <span className="animate-pulse">SPONSORED CONTENT</span>
          <span className="text-xs">AD_ID: #666-XYZ</span>
        </div>

        {/* Body */}
        <div className="p-8 text-center flex flex-col items-center gap-4">
          <h3 className="text-3xl font-black text-black uppercase leading-none transform -rotate-2">
            {adContent.title}
          </h3>
          <div className="w-full h-1 bg-slate-200 my-2"></div>
          <p className="text-lg text-slate-600 font-serif">
            {adContent.body}
          </p>
          
          <div className="mt-4 p-4 bg-yellow-100 border-2 border-dashed border-yellow-500 text-yellow-800 text-xs font-mono">
            By viewing this ad, you agree to donate 5ms of your neural processing power to the Hivemind.
          </div>
        </div>

        {/* Footer / Actions */}
        <div className="p-4 bg-slate-100 flex flex-col gap-2">
          
          {/* Free Skip Button */}
          <button 
            onClick={onComplete}
            disabled={!canSkip}
            className={`
              w-full py-3 font-bold border-2 transition-all flex items-center justify-center gap-2
              ${canSkip 
                ? 'bg-white border-black text-black hover:bg-slate-200 cursor-pointer' 
                : 'bg-slate-300 border-slate-400 text-slate-500 cursor-not-allowed'}
            `}
          >
            {canSkip ? (
              <>
                <X size={20} /> SKIP AD
              </>
            ) : (
              `SKIP IN ${timeLeft}s...`
            )}
          </button>

          {/* Premium Skip */}
          <button 
            onClick={onSkipWithClout}
            disabled={!canPayToSkip}
            className={`
              w-full py-2 text-xs font-bold border-2 border-dashed transition-all
              ${canPayToSkip
                ? 'bg-pink-100 border-pink-400 text-pink-600 hover:bg-pink-200'
                : 'bg-slate-100 border-slate-300 text-slate-400 opacity-50'}
            `}
          >
            PREMIUM SKIP (-{CLOUT_SKIP_COST} CLOUT)
          </button>

        </div>

      </div>
    </div>
  );
};

export default PopupAd;