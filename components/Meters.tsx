import React from 'react';
import { Brain, Trash2 } from 'lucide-react';
import { PlayerStats } from '../types';
import { CRITICAL_SANITY_THRESHOLD } from '../constants';

interface MetersProps {
  stats: PlayerStats;
}

const Meters: React.FC<MetersProps> = ({ stats }) => {
  const isCritical = stats.sanity < CRITICAL_SANITY_THRESHOLD;

  return (
    <div className="w-full max-w-2xl mx-auto mb-6 grid grid-cols-2 gap-4">
      {/* Sanity Meter */}
      <div className="bg-slate-900 border border-green-800 p-2 relative overflow-hidden group">
        <div className="flex justify-between items-center mb-1 text-xs font-mono text-green-400 z-10 relative">
          <div className="flex items-center gap-2">
            <Brain size={14} />
            <span>COGNITIVE_RAM</span>
          </div>
          <span>{stats.sanity}%</span>
        </div>
        <div className="h-4 bg-slate-800 w-full relative">
          <div 
            className={`h-full transition-all duration-300 ${isCritical ? 'bg-red-600 animate-pulse' : 'bg-green-600'}`}
            style={{ width: `${stats.sanity}%` }}
          />
        </div>
        {isCritical && (
            <div className="absolute inset-0 border-2 border-red-500 animate-pulse pointer-events-none"></div>
        )}
      </div>

      {/* Slop Meter */}
      <div className="bg-yellow-100 border-4 border-pink-500 p-2 relative transform -rotate-1 shadow-[4px_4px_0px_0px_rgba(236,72,153,1)]">
        <div className="flex justify-between items-center mb-1 text-xs font-slop font-bold text-pink-600 z-10 relative">
          <div className="flex items-center gap-2">
            <Trash2 size={14} />
            <span>VIBE CHECK</span>
          </div>
          <span>{stats.slopIntegrity}%</span>
        </div>
        <div className="h-4 bg-white w-full border border-pink-300">
          <div 
            className="h-full bg-gradient-to-r from-pink-400 to-yellow-400 transition-all duration-300"
            style={{ width: `${stats.slopIntegrity}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Meters;
