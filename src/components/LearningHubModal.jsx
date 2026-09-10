import React from 'react';
import { X, BookOpen, Atom, Cpu, Award, ExternalLink } from 'lucide-react';

export default function LearningHubModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const topics = [
    {
      title: "1. Quantum Superposition",
      desc: "Unlike classical bits (0 or 1), a qubit can exist in a linear combination of both states α|0⟩ + β|1⟩ until measured.",
      badge: "Hadamard H Gate"
    },
    {
      title: "2. Quantum Entanglement",
      desc: "Two or more qubits become correlated such that measuring one instantly determines the state of the other regardless of distance.",
      badge: "CNOT (CX) Gate"
    },
    {
      title: "3. Bloch Sphere Representation",
      desc: "A geometrical representation of the pure state space of a two-level quantum mechanical system (qubit).",
      badge: "3D Geometry"
    },
    {
      title: "4. Qiskit Framework",
      desc: "IBM's open-source SDK for working with quantum computers at the level of circuits, pulses, and algorithms.",
      badge: "Python SDK"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl glass-panel rounded-2xl border border-cyan-500/30 bg-[#0a0d24] p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-100 font-['Space_Grotesk']">
                Quantum Learn — Interactive Learning Hub
              </h3>
              <p className="text-xs text-cyan-400 font-mono">Team Neural Nomads | SIH 2026</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Concepts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((t, idx) => (
            <div key={idx} className="p-4 rounded-xl glass-card border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm text-cyan-300 font-mono">{t.title}</h4>
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-mono border border-cyan-500/20">
                  {t.badge}
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {t.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs font-mono text-gray-400">
          <span>Explore interactive gates in the studio canvas above!</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold font-['Space_Grotesk'] text-xs tracking-wider uppercase"
          >
            Close Hub
          </button>
        </div>

      </div>
    </div>
  );
}
