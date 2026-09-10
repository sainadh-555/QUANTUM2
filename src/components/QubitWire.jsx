import React, { useState } from 'react';
import QuantumGate from './QuantumGate';

export default function QubitWire({
  qubitIndex,
  totalQubits = 2,
  columnsCount,
  operations,
  onDropGate,
  onRemoveOp,
  selectedGate,
  selectedOpId,
  onSelectOp,
  onChangeTarget,
  onSelectSlot
}) {
  const [dragOverCol, setDragOverCol] = useState(null);

  const handleDragOver = (e, colIdx) => {
    e.preventDefault();
    setDragOverCol(colIdx);
  };

  const handleDragLeave = () => {
    setDragOverCol(null);
  };

  const handleDrop = (e, colIdx) => {
    e.preventDefault();
    setDragOverCol(null);
    const gateId = e.dataTransfer.getData('text/plain');
    if (gateId) {
      onDropGate(gateId, qubitIndex, colIdx);
    }
  };

  const handleSlotClick = (colIdx) => {
    if (selectedGate) {
      onDropGate(selectedGate.id, qubitIndex, colIdx);
    } else {
      onSelectSlot && onSelectSlot(qubitIndex, colIdx);
    }
  };

  return (
    <div className="flex items-center h-16 relative group">
      {/* Qubit Label Badge */}
      <div className="w-16 sm:w-20 shrink-0 flex items-center justify-between pr-3 select-none">
        <div className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-xs shadow-sm flex items-center gap-1">
          <span>q{qubitIndex}</span>
        </div>
        <span className="text-gray-600 font-mono text-[10px]">|0⟩</span>
      </div>

      {/* Wire Container */}
      <div className="flex-1 relative flex items-center h-full">
        {/* Horizontal Qubit Wire Line */}
        <div className="absolute left-0 right-0 h-[2px] qubit-wire-line z-0"></div>

        {/* Column Slots Grid */}
        <div
          className="relative z-10 grid w-full h-full items-center"
          style={{ gridTemplateColumns: `repeat(${columnsCount}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columnsCount }).map((_, colIdx) => {
            // Find operations on this qubit and column
            const singleOp = operations.find(op => op.column === colIdx && op.qubit === qubitIndex);
            const controlOp = operations.find(op => op.column === colIdx && op.control === qubitIndex);
            const targetOp = operations.find(op => op.column === colIdx && op.target === qubitIndex);

            const activeOp = singleOp || controlOp || targetOp;
            const isControlPoint = !!controlOp;
            const isTargetPoint = !!targetOp;
            const isDragTarget = dragOverCol === colIdx;
            const isSelected = activeOp && selectedOpId === activeOp.id;

            return (
              <div
                key={colIdx}
                onDragOver={(e) => handleDragOver(e, colIdx)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, colIdx)}
                onClick={() => handleSlotClick(colIdx)}
                className={`h-12 mx-auto w-12 sm:w-14 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
                  isDragTarget
                    ? 'bg-cyan-500/30 border-2 border-cyan-400 scale-110 shadow-lg shadow-cyan-500/40'
                    : activeOp
                    ? ''
                    : selectedGate
                    ? 'hover:bg-cyan-500/15 hover:border hover:border-cyan-500/30'
                    : 'hover:bg-white/5'
                }`}
              >
                {/* Empty Slot Placeholder Dot */}
                {!activeOp && (
                  <div className="w-2 h-2 rounded-full bg-cyan-400/20 group-hover:bg-cyan-400/50 transition-colors"></div>
                )}

                {/* Render Gate if present */}
                {activeOp && (
                  <QuantumGate
                    op={activeOp}
                    isControlPoint={isControlPoint}
                    isTargetPoint={isTargetPoint}
                    isSelected={isSelected}
                    onSelect={onSelectOp}
                    onRemove={onRemoveOp}
                    onChangeTarget={onChangeTarget}
                    totalQubits={totalQubits}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
