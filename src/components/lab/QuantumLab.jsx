import React, { useState, useEffect } from 'react';
import GatePalette from '../GatePalette';
import CircuitCanvas from '../CircuitCanvas';
import CodeEditor from '../CodeEditor';
import RunButton from '../RunButton';
import ResultsPanel from '../ResultsPanel';
import GateExplanationModal from '../GateExplanationModal';
import PresetSelectorModal from '../PresetSelectorModal';
import { runSimulation } from '../../services/quantumApi';
import { validateCircuit } from '../../utils/circuitValidation';
import { PRESET_CIRCUITS } from '../../data/presets';
import { ProgressService } from '../../services/ProgressService';
import {
  FlaskConical,
  Sparkles,
  Bot,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Zap,
  Play,
  Layers,
  CheckCircle2,
  Code2
} from 'lucide-react';

export default function QuantumLab({
  initialConcept,
  onOpenQumi,
  onNavigateHome,
  onCircuitUpdate
}) {
  // Starter circuits for injected concepts
  const conceptStarters = {
    superposition: {
      qubits: 1,
      classicalBits: 1,
      columns: 3,
      operations: [
        { id: 'h-1', gate: 'H', qubit: 0, column: 0 },
        { id: 'h-m', gate: 'MEASURE', qubit: 0, column: 1 }
      ]
    },
    entanglement: {
      qubits: 2,
      classicalBits: 2,
      columns: 4,
      operations: [
        { id: 'b-1', gate: 'H', qubit: 0, column: 0 },
        { id: 'b-2', gate: 'CX', control: 0, target: 1, column: 1 },
        { id: 'b-3', gate: 'MEASURE', qubit: 0, column: 2 },
        { id: 'b-4', gate: 'MEASURE', qubit: 1, column: 2 }
      ]
    },
    grover: PRESET_CIRCUITS.find(p => p.id === 'grover-2qubit') || PRESET_CIRCUITS[0],
    qubit: {
      qubits: 1,
      classicalBits: 1,
      columns: 3,
      operations: [
        { id: 'q-1', gate: 'MEASURE', qubit: 0, column: 0 }
      ]
    }
  };

  const getInitialCircuit = () => {
    if (initialConcept && conceptStarters[initialConcept]) {
      return conceptStarters[initialConcept];
    }
    return PRESET_CIRCUITS[0]; // Default: Bell State
  };

  const [circuit, setCircuit] = useState(getInitialCircuit());
  const [history, setHistory] = useState([getInitialCircuit()]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedGate, setSelectedGate] = useState(null);
  const [selectedOpId, setSelectedOpId] = useState(null);
  const [explainedGate, setExplainedGate] = useState(null);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [circuitError, setCircuitError] = useState(null);

  // If initialConcept changes, load that circuit
  useEffect(() => {
    if (initialConcept && conceptStarters[initialConcept]) {
      const c = conceptStarters[initialConcept];
      setCircuit(c);
      setHistory([c]);
      setHistoryIndex(0);
      setResults(null);
    }
  }, [initialConcept]);

  useEffect(() => {
    onCircuitUpdate?.({ circuit, results });
  }, [circuit, results]);

  const updateCircuitState = (newCircuit) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newCircuit);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCircuit(newCircuit);
    setCircuitError(null);
  };

  const handleRunSimulation = async () => {
    setCircuitError(null);
    const validation = validateCircuit(circuit);
    if (!validation.isValid) {
      setCircuitError(validation.error);
      return;
    }

    setIsRunning(true);
    try {
      const res = await runSimulation(circuit);
      setResults(res);
      ProgressService.addXP(25, 'Executed Quantum Circuit');
    } catch (err) {
      setCircuitError('Simulation execution failed. Please check gate connections.');
    } finally {
      setIsRunning(false);
    }
  };

  // Accessible quick add gate to first available wire
  const handleQuickAddGate = (gateId) => {
    const colIdx = Math.max(0, circuit.operations.length);
    if (gateId === 'CX' || gateId === 'CZ') {
      if (circuit.qubits < 2) return;
      const newOp = {
        id: `quick-op-${Date.now()}`,
        gate: gateId,
        control: 0,
        target: 1,
        column: colIdx
      };
      updateCircuitState({
        ...circuit,
        columns: Math.max(circuit.columns, colIdx + 2),
        operations: [...circuit.operations, newOp]
      });
    } else {
      const newOp = {
        id: `quick-op-${Date.now()}`,
        gate: gateId,
        qubit: 0,
        column: colIdx
      };
      updateCircuitState({
        ...circuit,
        columns: Math.max(circuit.columns, colIdx + 2),
        operations: [...circuit.operations, newOp]
      });
    }
  };

  return (
    <div className="flex-1 max-w-[1720px] w-full mx-auto p-4 sm:p-6 flex flex-col space-y-5 overflow-y-auto">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
                Quantum Lab
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                "Build the concept. See the quantum state." &bull; Qiskit Compatible Simulation
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar Action Buttons */}
        <div className="flex items-center space-x-2.5 flex-wrap">
          <button
            onClick={() => setIsCodeOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-200 border border-white/10 flex items-center space-x-1.5 transition-colors"
          >
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Code</span>
          </button>

          <button
            onClick={() => setIsPresetsOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-200 border border-white/10 flex items-center space-x-1.5 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Presets</span>
          </button>

          <button
            onClick={() => updateCircuitState({ ...circuit, operations: [] })}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-300 border border-white/10 flex items-center space-x-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
            <span>Clear</span>
          </button>

          <button
            onClick={onOpenQumi}
            className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <Bot className="w-4 h-4 text-purple-400" />
            <span>Ask Qumi</span>
          </button>
        </div>
      </div>

      {/* Accessible Quick Add Shortcuts */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <span className="text-gray-400 text-[11px] font-mono shrink-0">Quick Add:</span>
        {['H', 'X', 'Z', 'S', 'T', 'CX', 'MEASURE'].map(g => (
          <button
            key={g}
            onClick={() => handleQuickAddGate(g)}
            className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-300 border border-white/10 font-mono text-[11px] shrink-0 transition-colors"
          >
            +{g}
          </button>
        ))}
      </div>

      {/* Center Workstation: Left Palette | Center Canvas | Right Qiskit Code (Overlay) */}
      <div className="flex-1 flex flex-row gap-4 items-stretch min-h-[300px] relative overflow-hidden">
        
        {/* Left: Gate Library */}
        <GatePalette
          selectedGate={selectedGate}
          onSelectGate={(gate) => setSelectedGate(selectedGate?.id === gate.id ? null : gate)}
          onExplainGate={(gate) => setExplainedGate(gate)}
        />

        {/* Center: Circuit Builder Canvas */}
        <CircuitCanvas
          circuit={circuit}
          onAddQubit={() => {
            if (circuit.qubits < 6) {
              updateCircuitState({
                ...circuit,
                qubits: circuit.qubits + 1,
                classicalBits: circuit.classicalBits + 1
              });
            }
          }}
          onRemoveQubit={() => {
            if (circuit.qubits > 1) {
              const targetQubit = circuit.qubits - 1;
              const filteredOps = circuit.operations.filter(op =>
                op.qubit !== targetQubit && op.control !== targetQubit && op.target !== targetQubit
              );
              updateCircuitState({
                ...circuit,
                qubits: circuit.qubits - 1,
                classicalBits: Math.max(1, circuit.classicalBits - 1),
                operations: filteredOps
              });
            }
          }}
          onAddColumn={() => {
            if (circuit.columns < 12) {
              updateCircuitState({ ...circuit, columns: circuit.columns + 1 });
            }
          }}
          onRemoveColumn={() => {
            if (circuit.columns > 4) {
              const targetCol = circuit.columns - 1;
              const filteredOps = circuit.operations.filter(op => op.column !== targetCol);
              updateCircuitState({ ...circuit, columns: circuit.columns - 1, operations: filteredOps });
            }
          }}
          onClearCircuit={() => {
            updateCircuitState({ ...circuit, operations: [] });
            setResults(null);
            setSelectedOpId(null);
          }}
          onDropGate={(gateId, qubitIdx, colIdx) => {
            const existingOps = [...circuit.operations];
            if (gateId === 'CX' || gateId === 'CZ') {
              const targetQubit = (qubitIdx + 1) % circuit.qubits;
              const newOp = {
                id: `op-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                gate: gateId,
                control: qubitIdx,
                target: targetQubit,
                column: colIdx
              };
              const cleanedOps = existingOps.filter(op =>
                !(op.column === colIdx && (op.qubit === qubitIdx || op.qubit === targetQubit || op.control === qubitIdx || op.target === targetQubit))
              );
              cleanedOps.push(newOp);
              updateCircuitState({ ...circuit, operations: cleanedOps });
              setSelectedOpId(newOp.id);
            } else {
              const newOp = {
                id: `op-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                gate: gateId,
                qubit: qubitIdx,
                column: colIdx
              };
              const cleanedOps = existingOps.filter(op =>
                !(op.column === colIdx && (op.qubit === qubitIdx || op.control === qubitIdx || op.target === qubitIdx))
              );
              cleanedOps.push(newOp);
              updateCircuitState({ ...circuit, operations: cleanedOps });
              setSelectedOpId(newOp.id);
            }
            setSelectedGate(null);
          }}
          onRemoveOp={(opId) => {
            const filtered = circuit.operations.filter(op => op.id !== opId);
            updateCircuitState({ ...circuit, operations: filtered });
            if (selectedOpId === opId) setSelectedOpId(null);
          }}
          onChangeTarget={(opId, newTarget) => {
            const updated = circuit.operations.map(op => (op.id === opId ? { ...op, target: newTarget } : op));
            updateCircuitState({ ...circuit, operations: updated });
          }}
          selectedGate={selectedGate}
          selectedOpId={selectedOpId}
          onSelectOp={(op) => setSelectedOpId(op ? op.id : null)}
          onUndo={() => {
            if (historyIndex > 0) {
              const prevIdx = historyIndex - 1;
              setHistoryIndex(prevIdx);
              setCircuit(history[prevIdx]);
            }
          }}
          onRedo={() => {
            if (historyIndex < history.length - 1) {
              const nextIdx = historyIndex + 1;
              setHistoryIndex(nextIdx);
              setCircuit(history[nextIdx]);
            }
          }}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          onLoadPreset={() => setIsPresetsOpen(true)}
        />

        {/* Right: Bi-directional Qiskit Code Editor with Live CodeParser (Sliding Overlay) */}
        <CodeEditor
          isOpen={isCodeOpen}
          onClose={() => setIsCodeOpen(false)}
          circuit={circuit}
          onResetCircuit={() => updateCircuitState(PRESET_CIRCUITS[0])}
          onCircuitUpdate={(newCircuit) => updateCircuitState(newCircuit)}
          onOpenQumi={onOpenQumi}
        />

      </div>

      {/* Big Simulation Run Button */}
      <div className="w-full">
        <RunButton
          onRun={handleRunSimulation}
          isRunning={isRunning}
          error={circuitError}
        />
      </div>

      {/* Bottom: Results Panel (Probability Chart, State Vector, 3D Bloch Sphere) */}
      <div className="w-full">
        <ResultsPanel
          results={results}
          circuit={circuit}
          isRunning={isRunning}
        />
      </div>

      {/* Modals */}
      <GateExplanationModal
        gate={explainedGate}
        onClose={() => setExplainedGate(null)}
      />

      <PresetSelectorModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={(p) => {
          updateCircuitState(p);
          setIsPresetsOpen(false);
        }}
      />

    </div>
  );
}
