import React from 'react';
import { Play, Loader2, AlertTriangle } from 'lucide-react';

export default function RunButton({ onRun, isRunning, error }) {
  return (
    <div className="w-full flex flex-col items-center space-y-2">
      {/* Error Banner */}
      {error && (
        <div className="w-full p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2.5 animate-fadeIn">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Prominent Run Button */}
      <button
        onClick={onRun}
        disabled={isRunning}
        className={`relative group w-full py-3.5 px-6 rounded-xl font-bold font-['Space_Grotesk'] text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg ${
          isRunning
            ? 'bg-cyan-500/20 text-cyan-300 cursor-not-allowed border border-cyan-500/30'
            : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.01]'
        }`}
      >
        {isRunning ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-cyan-300" />
            <span>Executing Qiskit Simulation...</span>
          </>
        ) : (
          <>
            <Play className="w-5 h-5 fill-black text-black group-hover:scale-110 transition-transform" />
            <span>▶ RUN SIMULATION</span>
          </>
        )}
      </button>
    </div>
  );
}
