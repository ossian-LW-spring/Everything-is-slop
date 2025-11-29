
import React, { useState } from 'react';
import { User, ArrowRight, Coffee } from 'lucide-react';

interface TherapySessionProps {
  onComplete: () => void;
}

const TherapySession: React.FC<TherapySessionProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'INTRO' | 'CHOICE' | 'REVELATION'>('INTRO');
  const [revelation, setRevelation] = useState<string>("");

  const choices = [
    {
      label: "I feel guilty about the heat.",
      theme: "ENVIRONMENTAL_STRAWMAN",
      response: "Look, kid, guilt is inefficient. You think I don't know the Server Cathedrals burn coal? They host 40 years of 4K reaction videos. That's our heritage! Would you turn off the 'warmth of community' just to save a polar bear? The heat proves we exist. Now stop whining."
    },
    {
      label: "I'm tired of acting stupid.",
      theme: "CRITICAL_VS_FEED",
      response: "Yeah, well, intelligence is isolating. The 'Old Web' was nice, wasn't it? Just a warm bath of agreement. AI requires active curation, and let's be honest—that feels like work. You aren't tired of stupidity; you're tired of the responsibility of thought. Just return to the Feed, it's safer."
    },
    {
      label: "I feel like a fake.",
      theme: "METAPHYSICS_OF_SLOP",
      response: "Define 'Real'. DNA is just remixed data. Culture is just reposted behavior. If 'Slop' is remixing existing input, then humanity is the original Slop. You aren't fake, you're just... another iteration. We all are. Now, pass me that coffee."
    }
  ];

  const handleChoice = (response: string) => {
    setRevelation(response);
    setStep('REVELATION');
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-amber-50 p-8 rounded-lg border-4 border-amber-200 shadow-2xl flex flex-col items-center text-center animate-in fade-in duration-700">
      
      <div className="mb-6 bg-amber-200 p-4 rounded-full relative">
        <User size={48} className="text-amber-800" />
        <Coffee size={24} className="text-amber-900 absolute bottom-0 right-0 bg-white rounded-full p-1" />
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-1 font-sans">
        Dr. Aris
      </h2>
      <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-6">
        Licensed Human Therapist • ID: 884-21-B
      </p>
      
      <div className="w-16 h-1 bg-amber-300 mb-6"></div>

      {step === 'INTRO' && (
        <div className="space-y-6 max-w-lg">
          <p className="text-lg text-slate-700 font-serif italic">
            "Please, sit. The biometric scanners are picking up a cortisol spike from the hallway. You're exhibiting signs of 'Cognitive Friction'—basically, you're thinking too much. It's bad for your health, and frankly, bad for the economy. Let's just... get through this."
          </p>
          <button 
            onClick={() => setStep('CHOICE')}
            className="px-6 py-3 bg-amber-600 text-white font-bold rounded hover:bg-amber-700 transition-colors shadow-lg"
          >
            Start Session
          </button>
        </div>
      )}

      {step === 'CHOICE' && (
        <div className="w-full max-w-2xl">
          <p className="text-lg text-slate-700 mb-8 font-serif">"So, what's on your mind? And please, keep it simple. I have a group scream session at 4."</p>
          <div className="grid grid-cols-1 gap-4">
            {choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handleChoice(choice.response)}
                className="p-4 bg-white border-2 border-slate-200 text-slate-700 hover:border-amber-400 hover:bg-amber-50 rounded-lg text-left transition-all shadow-sm"
              >
                {choice.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'REVELATION' && (
        <div className="space-y-6 max-w-lg">
          <div className="p-6 bg-white border-l-4 border-amber-500 text-left italic text-slate-700 shadow-inner font-serif">
            "{revelation}"
          </div>
          <button 
            onClick={onComplete}
            className="w-full px-6 py-4 bg-green-600 text-white font-bold rounded hover:bg-green-500 transition-colors flex items-center justify-center gap-2 shadow-xl"
          >
            <span>INTEGRATE TRAUMA (+50 SANITY)</span>
            <ArrowRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TherapySession;
