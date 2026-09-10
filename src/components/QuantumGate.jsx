import React from 'react';
import { X, Gauge, Target, RefreshCw } from 'lucide-react';
import { QUANTUM_GATES } from '../data/quantumGates';

export default function QuantumGate({
  op,
  isControlPoint,
  isTargetPoint,
  isSelected,
  onSelect,
  onRemove,
  onChangeTarget,
  totalQubits = 2
}) {
  const gateMeta = QUANTUM_GATES.find(g => g.id === op.gate) || {
    name: op.gate,
    symbol: op.gate,
    color: 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
  };

  const handleCycleTarget = (e) => {
    e.stopPropagation();
    if (!onChangeTarget || totalQubits <= 1) return;
    let nextTarget = ((op.target !== undefined ? op.target : 0) + 1) % totalQubits;
    if (nextTarget === op.control) {
      nextTarget = (nextTarget + 1) % totalQubits;
    }
    onChangeTarget(op.id, nextTarget);
  };

  // 1. CONTROL POINT NODE (Control qubit of CX or CZ)
  if (isControlPoint) {
    return (
      <div
        onClick={(e) => { e.stopPropagation(); onSelect && onSelect(op); }}
        className={`relative group flex items-center justify-center w-full h-full cursor-pointer select-none ${
          isSelected ? 'ring-2 ring-pink-400 ring-offset-2 ring-offset-[#060814] rounded-full' : ''
        }`}
        title={`Control for ${op.gate} -> Target q${op.target}. Click to select, click badge to cycle target.`}
      >
        <div className="w-5 h-5 rounded-full bg-pink-500 shadow-md shadow-pink-500/60 flex items-center justify-center ring-4 ring-pink-500/20 group-hover:scale-125 transition-all">
          <div className="w-2 h-2 rounded-full bg-white"></div>
        </div>

        {/* Small target indicator pill that cycles target on click */}
        {totalQubits > 2 && (
          <button
            onClick={handleCycleTarget}
            className="absolute -bottom-3.5 px-1 py-0.2 rounded bg-pink-950 border border-pink-500/60 text-[8px] font-mono text-pink-300 hover:bg-pink-900 transition-colors z-20 flex items-center gap-0.5 shadow-sm"
            title="Click to cycle target qubit"
          >
            <span>-&gt;q{op.target}</span>
            <RefreshCw className="w-2 h-2" />
          </button>
        )}

        {/* Remove Gate Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(op.id); }}
          className="absolute -top-2.5 -right-2.5 opacity-0 group-hover:opacity-100 p-0.5 bg-red-500 text-white rounded-full transition-opacity shadow-md z-30 hover:scale-110"
          title="Remove Controlled Gate"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  }

  // 2. CNOT TARGET POINT NODE (⊕)
  if (isTargetPoint && op.gate === 'CX') {
    return (
      <div
        onClick={(e) => { e.stopPropagation(); onSelect && onSelect(op); }}
        className={`relative group flex items-center justify-center w-full h-full cursor-pointer select-none ${
          isSelected ? 'ring-2 ring-pink-400 ring-offset-2 ring-offset-[#060814] rounded-full' : ''
        }`}
        title={`CNOT Target (Controlled by q${op.control})`}
      >
        <div className="w-8 h-8 rounded-full bg-[#131b3b] border-2 border-pink-400 text-pink-300 flex items-center justify-center shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-all font-bold">
          <Target className="w-5 h-5 text-pink-400 animate-pulse" />
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onRemove(op.id); }}
          className="absolute -top-2.5 -right-2.5 opacity-0 group-hover:opacity-100 p-0.5 bg-red-500 text-white rounded-full transition-opacity shadow-md z-30 hover:scale-110"
          title="Remove Gate"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  }

  // 3. CZ TARGET POINT NODE
  if (isTargetPoint && op.gate === 'CZ') {
    return (
      <div
        onClick={(e) => { e.stopPropagation(); onSelect && onSelect(op); }}
        className={`relative group flex items-center justify-center w-full h-full cursor-pointer select-none ${
          isSelected ? 'ring-2 ring-fuchsia-400 ring-offset-2 ring-offset-[#060814] rounded-xl' : ''
        }`}
        title={`Controlled-Z Target (Controlled by q${op.control})`}
      >
        <div className="w-8 h-8 rounded-xl bg-fuchsia-950 border-2 border-fuchsia-400 text-fuchsia-300 flex items-center justify-center font-mono font-bold text-xs shadow-lg shadow-fuchsia-500/30 group-hover:scale-110 transition-all">
          Z
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(op.id); }}
          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 p-0.5 bg-red-500 text-white rounded-full transition-opacity shadow-md z-30 hover:scale-110"
          title="Remove Gate"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  }

  // 4. MEASUREMENT GATE NODE
  if (op.gate === 'MEASURE') {
    return (
      <div
        onClick={(e) => { e.stopPropagation(); onSelect && onSelect(op); }}
        className={`relative group flex items-center justify-center w-full h-full cursor-pointer select-none ${
          isSelected ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-[#060814] rounded-xl' : ''
        }`}
        title="Measurement Gate - Collapses qubit to computational basis"
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border-2 border-emerald-400 text-emerald-300 flex flex-col items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-all">
          <Gauge className="w-4 h-4 text-emerald-400" />
          <span className="text-[9px] font-mono font-bold text-emerald-300 leading-none mt-0.5">M</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(op.id); }}
          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 p-0.5 bg-red-500 text-white rounded-full transition-opacity shadow-md z-30 hover:scale-110"
          title="Remove Measurement"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  }

  // 5. STANDARD SINGLE QUBIT GATES (H, X, Y, Z, S, T, I, RESET)
  return (
    <div
      onClick={(e) => { e.stopPropagation(); onSelect && onSelect(op); }}
      className={`relative group flex items-center justify-center w-full h-full cursor-pointer select-none ${
        isSelected ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#060814] rounded-xl' : ''
      }`}
      title={`${gateMeta.name || op.gate} Gate`}
    >
      <div
        className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-mono font-bold text-sm shadow-md group-hover:scale-105 transition-all ${gateMeta.color}`}
      >
        {gateMeta.symbol}
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(op.id); }}
        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 p-0.5 bg-red-500 text-white rounded-full transition-opacity shadow-md z-30 hover:scale-110"
        title="Remove Gate"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
