import React from 'react';
import { X, Sparkles, Cpu, ArrowRight } from 'lucide-react';
import { PRESET_CIRCUITS } from '../data/presets';

export default function PresetSelectorModal({ isOpen, onClose, onSelectPreset }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl glass-panel rounded-2xl border border-purple-500/30 bg-[#0a0d24] p-6 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-100 font-['Space_Grotesk']">
                Preset Quantum Algorithms
              </h3>
              <p className="text-xs text-gray-400">Select a pre-built quantum circuit to inspect and execute</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Algorithm List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PRESET_CIRCUITS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => {
                onSelectPreset(preset);
                onClose();
              }}
              className="group p-4 rounded-xl glass-card border border-white/10 hover:border-purple-400/50 hover:bg-[#131b3e] transition-all cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-gray-200 group-hover:text-cyan-300 font-mono">
                    {preset.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 text-[10px] font-mono border border-purple-500/20">
                    {preset.qubits} Qubits
                  </span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-cyan-400 font-mono group-hover:translate-x-1 transition-transform">
                <span>Load Circuit</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
