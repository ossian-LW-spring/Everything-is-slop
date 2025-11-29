import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';

interface TerminalProps {
  logs: LogEntry[];
  onNext: () => void;
  showNext: boolean;
}

const Terminal: React.FC<TerminalProps> = ({ logs, onNext, showNext }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col bg-black border border-green-900 shadow-[0_0_20px_rgba(34,197,94,0.1)] mb-4 overflow-hidden rounded-sm relative">
      <div className="bg-green-900/20 p-2 border-b border-green-900/50 flex justify-between items-center text-xs font-mono text-green-600">
        <span>TERM_V.9.0.1 [DAEMON_CONNECTED]</span>
        <span>SECURE_CONNECTION</span>
      </div>
      
      <div className="flex-grow p-4 overflow-y-auto font-mono text-sm md:text-base space-y-4 h-[300px] md:h-[400px]">
        {logs.map((log, idx) => (
          <div key={idx} className={`
            ${log.source === 'SYSTEM' ? 'text-slate-500' : ''}
            ${log.source === 'DAEMON' ? 'text-green-400' : ''}
            ${log.source === 'WORLD' ? 'text-pink-400' : ''}
            ${log.source === 'PLAYER' ? 'text-white' : ''}
          `}>
            <span className="opacity-50 mr-2">[{log.timestamp}]</span>
            <span className="font-bold mr-2">
                {log.source === 'DAEMON' && '>'}
                {log.source === 'WORLD' && '!'}
                {log.source === 'SYSTEM' && '#'}
                {log.source === 'PLAYER' && '@'}
            </span>
            <span className="whitespace-pre-wrap">{log.text}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {showNext && (
        <div className="p-4 border-t border-green-900/50 bg-black">
          <button 
            onClick={onNext}
            className="w-full text-green-400 hover:bg-green-900/20 border border-dashed border-green-700 p-3 text-left font-mono animate-pulse hover:animate-none transition-colors"
          >
            > CONTINUE_SEQUENCE_
          </button>
        </div>
      )}
    </div>
  );
};

export default Terminal;
