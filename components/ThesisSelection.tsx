
import React from 'react';
import { ThesisOption } from '../types';
import { THESIS_OPTIONS } from '../constants';
import { ScrollText, ArrowRight, Lock, Trophy } from 'lucide-react';

interface ThesisSelectionProps {
  onSelect: (thesis: ThesisOption) => void;
  hardModeUnlocked: boolean;
}

const ThesisSelection: React.FC<ThesisSelectionProps> = ({ onSelect, hardModeUnlocked }) => {
  // Filter out options that require unlock if not yet unlocked
  const visibleOptions = THESIS_OPTIONS.filter(option => {
    if (option.requiresUnlock && !hardModeUnlocked) {
      return false;
    }
    return true;
  });

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-green-500 font-mono tracking-tighter">
          &lt;SELECT_ACADEMIC_BURDEN /&gt;
        </h2>
        <p className="text-slate-400 font-mono text-sm max-w-lg mx-auto">
          Choose the dangerous truth you are trying to hide within the noise. This choice will determine your arguments for the simulation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {visibleOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onSelect(option)}
              className="group relative flex flex-col justify-between min-h-[200px] bg-slate-900 border border-green-900 p-6 text-left transition-all hover:border-green-500 hover:bg-slate-800 hover:-translate-y-2"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                    <div className="text-green-700 group-hover:text-green-400 transition-colors">
                        <ScrollText size={32} />
                    </div>
                    {/* Badges */}
                    <div className="flex flex-col items-end gap-1">
                        <span className={`
                            text-[10px] font-bold px-2 py-1 rounded
                            ${option.difficulty === 'EASY' ? 'bg-blue-900 text-blue-200' : ''}
                            ${option.difficulty === 'NORMAL' ? 'bg-green-900 text-green-200' : ''}
                            ${option.difficulty === 'HARD' ? 'bg-red-900 text-red-200' : ''}
                        `}>
                            {option.difficulty}
                        </span>
                        {option.cloutMultiplier !== 1 && (
                            <span className={`text-[10px] font-bold px-2 py-1 rounded ${option.cloutMultiplier > 1 ? 'bg-yellow-900 text-yellow-200' : 'bg-orange-900 text-orange-200'}`}>
                                x{option.cloutMultiplier} CLOUT
                            </span>
                        )}
                         {option.sanityPenalty > 1 && (
                            <span className="text-[10px] font-bold px-2 py-1 rounded bg-red-950 text-red-400 border border-red-900">
                                x{option.sanityPenalty} DRAIN
                            </span>
                        )}
                    </div>
                </div>

                <h3 className="text-lg font-bold mb-2 font-mono text-slate-200 group-hover:text-white">
                  {option.label}
                </h3>
                <p className="text-xs font-mono leading-relaxed text-slate-500 group-hover:text-slate-300">
                  {option.description}
                </p>
              </div>
              
              <div className="mt-6 flex items-center text-xs font-bold text-green-800 group-hover:text-green-400 uppercase tracking-widest">
                  <span>Initialize</span>
                  <ArrowRight size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Scanline hover effect */}
              <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
            </button>
          )
        )}
      </div>

       {!hardModeUnlocked && (
           <div className="mt-4 flex items-center gap-2 text-xs text-slate-600 font-mono">
               <Trophy size={14} />
               <span>WIN ON ANY DIFFICULTY TO UNLOCK EXPERIMENTAL THEORIES</span>
           </div>
       )}
    </div>
  );
};

export default ThesisSelection;