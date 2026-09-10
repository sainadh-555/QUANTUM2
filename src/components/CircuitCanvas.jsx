import React, { useMemo, useEffect } from 'react';
import QubitWire from './QubitWire';
import {
  Plus, Minus, RotateCcw, Trash2, Undo2, Redo2, Sparkles, Cpu, Layers
} from 'lucide-react';

export default function CircuitCanvas({
  circuit,
  onAddQubit,
  onRemoveQubit,
  onAddColumn,
  onRemoveColumn,
  onClearCircuit,
  onDropGate,
  onRemoveOp,
  onChangeTarget,
  selectedGate,
  selectedOpId,
  onSelectOp,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onLoadPreset
}) {
  const { qubits, columns, operations } = circuit;

  // Calculate circuit metrics
  const gateCount = operations.length;
  
  // Calculate circuit depth (unique active columns)
  const depth = useMemo(() => {
    if (operations.length === 0) return 0;
    const colSet = new Set(operations.map(op => op.column));
    return colSet.size;
  }, [operations]);

  // Compute multi-qubit vertical connection lines for controlled gates (CX, CZ)
  const verticalConnections = useMemo(() => {
    const lines = [];
    operations.forEach(op => {
      if ((op.gate === 'CX' || op.gate === 'CZ') && op.control !== undefined && op.target !== undefined) {
        const minQ = Math.min(op.control, op.target);
        const maxQ = Math.max(op.control, op.target);
        lines.push({
          id: op.id,
          column: op.column,
          minQ,
          maxQ,
          gate: op.gate
        });
      }
    });
    return lines;
  }, [operations]);

  // Keyboard shortcut listener for deleting selected gate
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Backspace' || e.key === 'Delete') && selectedOpId) {
        // Prevent deleting if typing in an input
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
        e.preventDefault();
        onRemoveOp(selectedOpId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOpId, onRemoveOp]);

  return (
    <div
      className="flex-1 flex flex-col glass-panel rounded-2xl border border-white/10 overflow-hidden bg-[#070a1b]/90 shadow-2xl"
      onClick={() => onSelectOp && onSelectOp(null)}
    >
      
      {/* Canvas Top Action Toolbar */}
      <div className="px-4 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-white/[0.02]">
        
        {/* Left: Circuit Title & Info Badge */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-sm tracking-wide text-gray-100 font-['Space_Grotesk'] uppercase">
              Circuit Canvas
            </h3>
          </div>

          {/* Circuit Stats Pill */}
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono">
            <span className="text-cyan-300 font-semibold">{qubits}</span>
            <span className="text-gray-400">Qubits</span>
            <span className="text-gray-600">•</span>
            <span className="text-purple-300 font-semibold">{gateCount}</span>
            <span className="text-gray-400">Gates</span>
            <span className="text-gray-600">•</span>
            <span className="text-pink-300 font-semibold">{depth}</span>
            <span className="text-gray-400">Depth</span>
          </div>
        </div>

        {/* Right Controls: Add/Remove Qubits, Columns, Undo, Clear */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2" onClick={(e) => e.stopPropagation()}>
          
          {/* Preset Selector Button */}
          <button
            onClick={onLoadPreset}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40 text-purple-300 hover:text-white hover:border-purple-400 text-xs font-medium transition-all shadow-sm shadow-purple-500/10 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Presets</span>
          </button>

          <div className="h-4 w-[1px] bg-white/10 mx-1"></div>

          {/* Qubit Controls */}
          <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10">
            <button
              onClick={onRemoveQubit}
              disabled={qubits <= 1}
              className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors cursor-pointer"
              title="Remove Qubit"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[11px] font-mono text-cyan-300 font-semibold">
              {qubits}Q
            </span>
            <button
              onClick={onAddQubit}
              disabled={qubits >= 6}
              className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors cursor-pointer"
              title="Add Qubit"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Column Controls */}
          <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10">
            <button
              onClick={onRemoveColumn}
              disabled={columns <= 4}
              className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors cursor-pointer"
              title="Remove Step Column"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[11px] font-mono text-purple-300 font-semibold">
              {columns} Steps
            </span>
            <button
              onClick={onAddColumn}
              disabled={columns >= 12}
              className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors cursor-pointer"
              title="Add Step Column"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-4 w-[1px] bg-white/10 mx-1"></div>

          {/* Undo / Redo */}
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors cursor-pointer"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors cursor-pointer"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>

          {/* Clear Circuit */}
          <button
            onClick={onClearCircuit}
            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
            title="Clear Entire Circuit"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

        </div>
      </div>

      {/* Circuit Grid Area */}
      <div className="flex-1 p-5 overflow-x-auto relative min-h-[260px] bg-quantum-grid bg-repeat select-none">
        
        {/* Column Headers */}
        <div className="flex items-center mb-2">
          {/* Offset spacer matching label width */}
          <div className="w-16 sm:w-20 shrink-0 pr-3"></div>
          {/* Header Grid */}
          <div
            className="flex-1 grid text-center font-mono text-[10px] text-gray-500"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: columns }).map((_, cIdx) => (
              <div key={cIdx} className="w-full">
                Col {cIdx + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Qubit Wire Rows & Overlays Container */}
        <div className="relative">
          
          {/* Vertical Glowing Lines for Controlled Gates (CNOT / CZ) */}
          <div className="absolute inset-0 flex pointer-events-none z-10">
            {/* Offset spacer */}
            <div className="w-16 sm:w-20 shrink-0 pr-3"></div>
            {/* Overlay grid matching wire columns */}
            <div className="flex-1 relative h-full">
              {verticalConnections.map(conn => {
                const colCenterPct = ((conn.column + 0.5) / columns) * 100;
                const topPos = conn.minQ * 72 + 32;
                const heightVal = (conn.maxQ - conn.minQ) * 72;

                return (
                  <div
                    key={conn.id}
                    style={{
                      top: `${topPos}px`,
                      left: `${colCenterPct}%`,
                      height: `${heightVal}px`,
                      transform: 'translateX(-50%)'
                    }}
                    className="absolute w-[3px] bg-gradient-to-b from-pink-400 via-purple-400 to-pink-400 shadow-lg shadow-pink-500/70 rounded-full animate-pulse pointer-events-none"
                  />
                );
              })}
            </div>
          </div>

          {/* Individual Qubit Wires */}
          <div className="space-y-2 relative z-0">
            {Array.from({ length: qubits }).map((_, qIdx) => (
              <QubitWire
                key={qIdx}
                qubitIndex={qIdx}
                totalQubits={qubits}
                columnsCount={columns}
                operations={operations}
                onDropGate={onDropGate}
                onRemoveOp={onRemoveOp}
                onChangeTarget={onChangeTarget}
                selectedGate={selectedGate}
                selectedOpId={selectedOpId}
                onSelectOp={onSelectOp}
                onSelectSlot={() => {}}
              />
            ))}
          </div>

        </div>

        {/* Selected Gate Hint Bar */}
        {selectedOpId && (
          <div className="mt-4 flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-gray-400 animate-fadeIn">
            <span>Gate selected in circuit</span>
            <span className="text-cyan-400">Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white font-bold">Backspace</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white font-bold">Delete</kbd> to remove</span>
          </div>
        )}

      </div>

    </div>
  );
}
