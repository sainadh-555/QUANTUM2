import React from 'react';
import {
  Globe,
  Lock,
  Sparkles,
  CheckCircle2,
  X,
  ArrowRight
} from 'lucide-react';
import { ProgressService } from '../../services/ProgressService';

export const WORLDS = [
  {
    id: 1,
    name: 'QUBIT VALLEY',
    tagline: 'Foundations of Quantum Information',
    concepts: ['Qubit', 'Classical bit', 'Basis states'],
    speedFactor: 1.0,
    gradient: 'from-purple-900/60 via-indigo-900/40 to-[#070a1a]',
    borderColor: 'border-purple-500/40',
    accentColor: 'text-purple-400',
    badge: 'World 1'
  },
  {
    id: 2,
    name: 'SUPERPOSITION CITY',
    tagline: 'Hadamard Gates & Wave Interference',
    concepts: ['Hadamard', 'Superposition', 'Probability'],
    speedFactor: 1.15,
    gradient: 'from-cyan-900/60 via-blue-900/40 to-[#070a1a]',
    borderColor: 'border-cyan-500/40',
    accentColor: 'text-cyan-400',
    badge: 'World 2'
  },
  {
    id: 3,
    name: 'ENTANGLEMENT STATION',
    tagline: 'Non-Local Bell State Correlations',
    concepts: ['CNOT', 'Bell states', 'Entanglement'],
    speedFactor: 1.3,
    gradient: 'from-emerald-900/60 via-teal-900/40 to-[#070a1a]',
    borderColor: 'border-emerald-500/40',
    accentColor: 'text-emerald-400',
    badge: 'World 3'
  },
  {
    id: 4,
    name: 'QUANTUM GATE HIGHWAY',
    tagline: 'Multi-Axis Bloch Rotations (X, Y, Z, S, T)',
    concepts: ['Pauli-X', 'Pauli-Z', 'Phase S/T', 'Unitary Logic'],
    speedFactor: 1.45,
    locked: true,
    requiredLevel: 4,
    gradient: 'from-gray-900/60 via-gray-900/30 to-[#070a1a]',
    borderColor: 'border-white/10',
    accentColor: 'text-gray-500',
    badge: 'World 4 (Locked)'
  },
  {
    id: 5,
    name: 'ALGORITHM ARENA',
    tagline: 'Grover Search & Quantum Supremacy',
    concepts: ['Grover', 'Deutsch-Jozsa', 'Teleportation'],
    speedFactor: 1.6,
    locked: true,
    requiredLevel: 5,
    gradient: 'from-gray-900/60 via-gray-900/30 to-[#070a1a]',
    borderColor: 'border-white/10',
    accentColor: 'text-gray-500',
    badge: 'World 5 (Locked)'
  }
];

export default function WorldSelectModal({
  isOpen,
  currentWorld,
  onSelectWorld,
  onClose
}) {
  if (!isOpen) return null;

  const unlockedWorlds = ProgressService.getState().unlockedWorlds || [1, 2];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#080b1e] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-500/20 flex flex-col max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white font-['Space_Grotesk']">
                Select Quantum World
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                Journey through progressive quantum domains
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Worlds Grid */}
        <div className="space-y-3 mb-6">
          {WORLDS.map((w) => {
            const isUnlocked = unlockedWorlds.includes(w.id) && !w.locked;
            const isSelected = currentWorld === w.id;

            return (
              <div
                key={w.id}
                onClick={() => {
                  if (isUnlocked) {
                    onSelectWorld(w.id);
                    onClose();
                  }
                }}
                className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isUnlocked
                    ? `bg-gradient-to-r ${w.gradient} ${w.borderColor} hover:scale-[1.01] cursor-pointer ${
                        isSelected ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/20' : ''
                      }`
                    : 'bg-white/[0.01] border-white/5 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      isUnlocked
                        ? 'bg-white/10 text-white border-white/20'
                        : 'bg-gray-800 text-gray-500 border-gray-700'
                    }`}>
                      {w.badge}
                    </span>
                    <h4 className={`font-bold text-base font-['Space_Grotesk'] ${
                      isUnlocked ? 'text-white' : 'text-gray-500'
                    }`}>
                      {w.name}
                    </h4>
                    {isSelected && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-300 font-sans">
                    {w.tagline}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {w.concepts.map((c, i) => (
                      <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-gray-400 border border-white/5">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 flex items-center space-x-3">
                  {isUnlocked ? (
                    <button
                      className={`px-4 py-2 rounded-xl text-xs font-bold font-['Space_Grotesk'] uppercase tracking-wider flex items-center space-x-1.5 transition-all ${
                        isSelected
                          ? 'bg-cyan-500 text-black shadow-md'
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                      }`}
                    >
                      <span>{isSelected ? 'Current' : 'Select'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="flex items-center space-x-1.5 text-xs text-gray-500 font-mono">
                      <Lock className="w-4 h-4" />
                      <span>Level {w.requiredLevel}+</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
