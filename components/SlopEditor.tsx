
import React, { useState, useEffect } from 'react';
import { Modifier, Scene } from '../types';
import { MODIFIERS } from '../constants';
import { generateSlop } from '../services/geminiService';
import { Wand2, Send, RotateCcw } from 'lucide-react';

interface SlopEditorProps {
  scene: Scene;
  baseCleanText: string;
  taskPrompt: string;
  onModify: (cost: number, impact: number) => void;
  onSubmit: (finalText: string) => void;
  isProcessing: boolean;
  setIsProcessing: (val: boolean) => void;
}

const SlopEditor: React.FC<SlopEditorProps> = ({ 
  scene, 
  baseCleanText,
  taskPrompt,
  onModify, 
  onSubmit,
  isProcessing,
  setIsProcessing
}) => {
  const [currentText, setCurrentText] = useState(baseCleanText);

  // When the scene changes or base text changes, reset the editor
  useEffect(() => {
    setCurrentText(baseCleanText);
  }, [baseCleanText]);

  const handleApplyModifier = async (modifier: Modifier) => {
    setIsProcessing(true);
    // Apply state changes immediately for feedback
    onModify(modifier.sanityCost, modifier.slopImpact);
    
    // Generate new text
    const newText = await generateSlop(currentText, modifier);
    setCurrentText(newText);
    setIsProcessing(false);
  };

  const handleReset = () => {
    setCurrentText(baseCleanText);
    // Note: We don't reset stats, that's part of the challenge!
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
      
      {/* Editor Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: The Task */}
        <div className="p-4 bg-slate-900 border border-green-800 text-green-400 font-mono text-sm opacity-80 h-fit">
          <h3 className="border-b border-green-800 mb-2 pb-1 text-xs uppercase tracking-widest">Directive</h3>
          <p className="mb-4">{taskPrompt}</p>
          <h3 className="border-b border-green-800 mb-2 pb-1 text-xs uppercase tracking-widest">Daemon Analysis</h3>
          <p className="text-xs text-green-600">
            Detected Logic Level: HIGH.<br/>
            Authenticity: CRITICALLY LOW.<br/>
            Recommendation: Degrade signal quality immediately.
          </p>
        </div>

        {/* Right: The Text Output */}
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <div className="relative p-6 bg-yellow-50 rounded-lg border-2 border-black font-slop text-lg md:text-xl text-black leading-relaxed shadow-xl min-h-[200px] flex flex-col">
                <div className="flex-grow whitespace-pre-wrap">
                    {isProcessing ? (
                        <span className="animate-pulse text-pink-500 font-bold">
                            GENERATING SLOP...<br/>
                            <span className="text-sm font-normal text-black">Mining Social Capital...</span>
                        </span>
                    ) : (
                        currentText
                    )}
                </div>
                <div className="mt-4 flex justify-end gap-2">
                    <button 
                        onClick={handleReset}
                        className="p-2 text-xs font-bold text-slate-500 hover:text-black flex items-center gap-1"
                        disabled={isProcessing}
                    >
                        <RotateCcw size={14} /> RESET
                    </button>
                    <button 
                        onClick={() => onSubmit(currentText)}
                        className="bg-black text-white px-6 py-2 rounded-full font-bold hover:bg-pink-600 hover:scale-105 transition-all flex items-center gap-2"
                        disabled={isProcessing}
                    >
                        POST <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Modifier Deck */}
      <div className="space-y-2">
        <h3 className="text-center font-mono text-green-500 text-xs uppercase tracking-[0.2em] mb-4">
          Available Corruptions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {MODIFIERS.map((mod) => (
            <button
              key={mod.id}
              onClick={() => handleApplyModifier(mod)}
              disabled={isProcessing}
              className="relative overflow-hidden bg-slate-800 border border-slate-600 hover:border-pink-500 p-3 text-left transition-all hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] group disabled:opacity-50 disabled:hover:translate-y-0"
            >
              <div className="flex justify-between items-start mb-2">
                <Wand2 size={16} className="text-purple-400 group-hover:text-pink-400" />
                <span className="text-[10px] font-mono text-slate-500 group-hover:text-pink-300">
                    -{mod.sanityCost} SAN
                </span>
              </div>
              <div className="font-bold text-slate-200 text-sm mb-1 group-hover:text-white leading-tight">
                {mod.label}
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                {mod.description}
              </div>
              {/* Type Indicator */}
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent group-hover:via-pink-500 transition-all"></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SlopEditor;
