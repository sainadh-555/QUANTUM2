import React, { useState } from 'react';
import { QUANTUM_GATES, GATE_CATEGORIES } from '../data/quantumGates';
import GateItem from './GateItem';
import { Layers, Search, Sparkles } from 'lucide-react';

export default function GatePalette({ selectedGate, onSelectGate, onExplainGate }) {
  const [search, setSearch] = useState('');

  const filteredGates = QUANTUM_GATES.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const singleQubitGates = filteredGates.filter(g => g.category === GATE_CATEGORIES.SINGLE_QUBIT);
  const controlledGates = filteredGates.filter(g => g.category === GATE_CATEGORIES.CONTROLLED);
  const otherGates = filteredGates.filter(g => g.category === GATE_CATEGORIES.OTHER);

  return (
    <aside
      className="glass-panel border-r border-white/10 flex flex-col transition-all duration-300 w-72 sm:w-80 h-full overflow-hidden shrink-0"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h3 className="font-semibold text-sm tracking-wide text-gray-100 font-['Space_Grotesk'] uppercase">
            Quantum Gates
          </h3>
        </div>
      </div>

      <div className="p-3 border-b border-white/10 bg-[#080b1e]">
        {/* Search Box */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-500" />
          <input
            type="text"
            placeholder="Search gates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0d122b] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-cyan-400/80 font-mono">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Drag gate onto wire or click to place</span>
        </div>
      </div>

      {/* Gates List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        {/* Single Qubit Gates */}
        {singleQubitGates.length > 0 && (
          <div>
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-mono flex items-center justify-between">
              <span>SINGLE QUBIT</span>
              <span className="text-[10px] text-gray-500">7 Gates</span>
            </h4>
            <div className="space-y-2">
              {singleQubitGates.map((gate) => (
                <GateItem
                  key={gate.id}
                  gate={gate}
                  onSelectGate={onSelectGate}
                  onExplainGate={onExplainGate}
                  isSelected={selectedGate?.id === gate.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Controlled Gates */}
        {controlledGates.length > 0 && (
          <div>
            <h4 className="text-[11px] font-bold text-pink-400/80 uppercase tracking-wider mb-2 font-mono flex items-center justify-between">
              <span>CONTROLLED GATES</span>
              <span className="text-[10px] text-pink-500/60">2-Qubit</span>
            </h4>
            <div className="space-y-2">
              {controlledGates.map((gate) => (
                <GateItem
                  key={gate.id}
                  gate={gate}
                  onSelectGate={onSelectGate}
                  onExplainGate={onExplainGate}
                  isSelected={selectedGate?.id === gate.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Other Gates */}
        {otherGates.length > 0 && (
          <div>
            <h4 className="text-[11px] font-bold text-emerald-400/80 uppercase tracking-wider mb-2 font-mono flex items-center justify-between">
              <span>OTHER / MEASURE</span>
              <span className="text-[10px] text-emerald-500/60">Register</span>
            </h4>
            <div className="space-y-2">
              {otherGates.map((gate) => (
                <GateItem
                  key={gate.id}
                  gate={gate}
                  onSelectGate={onSelectGate}
                  onExplainGate={onExplainGate}
                  isSelected={selectedGate?.id === gate.id}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
