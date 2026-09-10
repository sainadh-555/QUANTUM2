import React from 'react';
import { X, BookOpen, Atom, Lightbulb, Sparkles } from 'lucide-react';

export default function GateExplanationModal({ gate, onClose }) {
  if (!gate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-cyan-500/30 bg-[#0a0d24] p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl font-mono font-bold text-lg flex items-center justify-center border shadow-lg ${gate.color}`}>
              {gate.symbol}
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-100 font-['Space_Grotesk']">
                {gate.name} ({gate.symbol})
              </h3>
              <p className="text-xs text-cyan-400 font-mono">{gate.category}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Short Summary */}
        <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-xs flex items-center space-x-3">
          <Lightbulb className="w-5 h-5 text-cyan-400 shrink-0" />
          <span>{gate.description}</span>
        </div>

        {/* Detailed Explanation */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span>Quantum Physics Mechanics</span>
          </h4>
          <p className="text-xs text-gray-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
            {gate.detail}
          </p>
        </div>

        {/* Unitary Matrix */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono flex items-center gap-1.5">
            <Atom className="w-3.5 h-3.5 text-pink-400" />
            <span>Unitary Transformation Matrix U</span>
          </h4>
          <div className="p-3 rounded-xl bg-[#040612] font-mono text-xs text-cyan-300 border border-white/10 font-semibold tracking-wider text-center">
            {gate.matrix}
          </div>
        </div>

        {/* Footer close button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-['Space_Grotesk'] text-xs tracking-wider uppercase transition-colors"
          >
            Got It!
          </button>
        </div>

      </div>
    </div>
  );
}
