import React, { useState, useEffect } from 'react';
import GatePalette from '../GatePalette';
import CircuitCanvas from '../CircuitCanvas';
import CodeEditor from '../CodeEditor';
import RunButton from '../RunButton';
import ResultsPanel from '../ResultsPanel';
import GateExplanationModal from '../GateExplanationModal';
import PresetSelectorModal from '../PresetSelectorModal';
import QumiWorkspace from '../ai/QumiWorkspace';
import QuantumAlgorithms from '../algorithms/QuantumAlgorithms';
import { runSimulation } from '../../services/quantumApi';
import { validateCircuit } from '../../utils/circuitValidation';
import { PRESET_CIRCUITS } from '../../data/presets';
import { ProgressService } from '../../services/ProgressService';
import { Code2, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Bot, BarChart3, ChevronDownCircle } from 'lucide-react';

export default function SimulationWorkspace({
  activeTool,
  setActiveTool,
  initialConcept,
  onCircuitUpdate
}) {
  const conceptStarters = {
    superposition: { qubits: 1, classicalBits: 1, columns: 3, operations: [{ id: 'h-1', gate: 'H', qubit: 0, column: 0 }, { id: 'h-m', gate: 'MEASURE', qubit: 0, column: 1 }] },
    entanglement: { qubits: 2, classicalBits: 2, columns: 4, operations: [{ id: 'b-1', gate: 'H', qubit: 0, column: 0 }, { id: 'b-2', gate: 'CX', control: 0, target: 1, column: 1 }, { id: 'b-3', gate: 'MEASURE', qubit: 0, column: 2 }, { id: 'b-4', gate: 'MEASURE', qubit: 1, column: 2 }] },
    grover: PRESET_CIRCUITS.find(p => p.id === 'grover-2qubit') || PRESET_CIRCUITS[0],
    qubit: { qubits: 1, classicalBits: 1, columns: 3, operations: [{ id: 'q-1', gate: 'MEASURE', qubit: 0, column: 0 }] }
  };

  const getInitialCircuit = () => (initialConcept && conceptStarters[initialConcept]) ? conceptStarters[initialConcept] : PRESET_CIRCUITS[0];

  const [circuit, setCircuit] = useState(getInitialCircuit());
  const [history, setHistory] = useState([getInitialCircuit()]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedGate, setSelectedGate] = useState(null);
  const [selectedOpId, setSelectedOpId] = useState(null);
  const [explainedGate, setExplainedGate] = useState(null);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [circuitError, setCircuitError] = useState(null);

  // New persistent structural layout state
  const [isCodeEditorExpanded, setIsCodeEditorExpanded] = useState(false);
  const [isQumiExpanded, setIsQumiExpanded] = useState(false);

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

  // ALGORITHMS TAKEOVER
  if (activeTool === 'algorithms') {
    return (
      <div className="flex-1 w-full h-full p-4 sm:p-6 overflow-hidden flex flex-col bg-[#030511]">
        <QuantumAlgorithms onOpenInLab={() => setActiveTool('circuit')} />
      </div>
    );
  }

  // STRUCTURAL REORGANIZATION - 3 REGION WORKSPACE
  return (
    <div className="flex-1 w-full h-full p-4 sm:p-6 overflow-hidden flex flex-col bg-[#030511] relative">
      
      {/* Top action row */}
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4 shrink-0">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white flex items-center gap-3">
            QUANTUM LAB
            <span className="text-xs font-normal text-cyan-400 bg-cyan-900/30 px-2 py-0.5 rounded-full border border-cyan-500/20">
              {initialConcept ? initialConcept.charAt(0).toUpperCase() + initialConcept.slice(1) : 'Custom Circuit'}
            </span>
          </h2>
          <span className="text-xs text-gray-500 mt-1">Build the concept. See the quantum state.</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-gray-400 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
            <div className="flex flex-col">
              <span className="text-gray-500 text-[10px] uppercase">Qubits</span>
              <span className="text-cyan-400 font-bold">{circuit.qubits}</span>
            </div>
            <div className="w-px h-6 bg-white/10"></div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-[10px] uppercase">Shots</span>
              <span className="text-purple-400 font-bold">1024</span>
            </div>
            <div className="w-px h-6 bg-white/10"></div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-[10px] uppercase">Backend</span>
              <span className="text-green-400 font-bold">Local Simulator</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsCodeEditorExpanded(!isCodeEditorExpanded)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
                isCodeEditorExpanded 
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' 
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span className="text-sm font-medium">CODE</span>
            </button>
            
            <button
              onClick={() => setIsPresetsOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <span className="text-sm font-medium">PRESETS</span>
            </button>

            <RunButton onRun={handleRunSimulation} isRunning={isRunning} error={circuitError} />
          </div>
        </div>
      </div>

      {/* CENTER PANE - Left/Center/Right layout */}
      <div className="flex-1 flex gap-4 overflow-hidden mb-4">
        
        {/* LEFT PANE: QUANTUM GATES */}
        <div className="shrink-0 flex flex-col h-full rounded-2xl overflow-hidden bg-white/[0.02]">
          <GatePalette
            selectedGate={selectedGate}
            onSelectGate={(gate) => setSelectedGate(selectedGate?.id === gate.id ? null : gate)}
            onExplainGate={(gate) => setExplainedGate(gate)}
          />
        </div>

        {/* CENTER PANE: CIRCUIT CANVAS */}
        <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300 bg-[#0a0718] border border-white/10 rounded-2xl relative">
          <CircuitCanvas
            circuit={circuit}
            onAddQubit={() => { if (circuit.qubits < 6) updateCircuitState({ ...circuit, qubits: circuit.qubits + 1, classicalBits: circuit.classicalBits + 1 }); }}
            onRemoveQubit={() => {
              if (circuit.qubits > 1) {
                const targetQubit = circuit.qubits - 1;
                const filteredOps = circuit.operations.filter(op => op.qubit !== targetQubit && op.control !== targetQubit && op.target !== targetQubit);
                updateCircuitState({ ...circuit, qubits: circuit.qubits - 1, classicalBits: Math.max(1, circuit.classicalBits - 1), operations: filteredOps });
              }
            }}
            onAddColumn={() => { if (circuit.columns < 12) updateCircuitState({ ...circuit, columns: circuit.columns + 1 }); }}
            onRemoveColumn={() => {
              if (circuit.columns > 4) {
                const targetCol = circuit.columns - 1;
                const filteredOps = circuit.operations.filter(op => op.column !== targetCol);
                updateCircuitState({ ...circuit, columns: circuit.columns - 1, operations: filteredOps });
              }
            }}
            onClearCircuit={() => { updateCircuitState({ ...circuit, operations: [] }); setResults(null); setSelectedOpId(null); }}
            onDropGate={(gateId, qubitIdx, colIdx) => {
              const existingOps = [...circuit.operations];
              if (gateId === 'CX' || gateId === 'CZ') {
                const targetQubit = (qubitIdx + 1) % circuit.qubits;
                const newOp = { id: `op-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, gate: gateId, control: qubitIdx, target: targetQubit, column: colIdx };
                const cleanedOps = existingOps.filter(op => !(op.column === colIdx && (op.qubit === qubitIdx || op.qubit === targetQubit || op.control === qubitIdx || op.target === targetQubit)));
                cleanedOps.push(newOp);
                updateCircuitState({ ...circuit, operations: cleanedOps });
                setSelectedOpId(newOp.id);
              } else {
                const newOp = { id: `op-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, gate: gateId, qubit: qubitIdx, column: colIdx };
                const cleanedOps = existingOps.filter(op => !(op.column === colIdx && (op.qubit === qubitIdx || op.control === qubitIdx || op.target === qubitIdx)));
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
            onUndo={() => { if (historyIndex > 0) { const prevIdx = historyIndex - 1; setHistoryIndex(prevIdx); setCircuit(history[prevIdx]); } }}
            onRedo={() => { if (historyIndex < history.length - 1) { const nextIdx = historyIndex + 1; setHistoryIndex(nextIdx); setCircuit(history[nextIdx]); } }}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            onLoadPreset={() => setIsPresetsOpen(true)}
          />
        </div>

        {/* RIGHT PANE: CODE EDITOR OVERLAY */}
        <CodeEditor
          isOpen={isCodeEditorExpanded}
          onClose={() => setIsCodeEditorExpanded(false)}
          circuit={circuit}
          onResetCircuit={() => updateCircuitState(PRESET_CIRCUITS[0])}
          onCircuitUpdate={(newCircuit) => updateCircuitState(newCircuit)}
        />
      </div>

      {/* BOTTOM PANE: Expandable Analysis (Results, Bloch Sphere, State Vectors) */}
      <div className="w-full shrink-0 relative z-20">
        <ResultsPanel
          results={results}
          circuit={circuit}
          isRunning={isRunning}
        />
      </div>

      {/* QUMI ASSISTANT OVERLAY */}
      <div className="absolute bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
        {isQumiExpanded && (
          <div className="w-[400px] h-[550px] rounded-2xl border border-purple-500/30 overflow-hidden bg-[#0a0718] shadow-2xl animate-in slide-in-from-bottom-4 pointer-events-auto flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-purple-500/20 bg-purple-500/10 shrink-0">
              <span className="font-bold text-sm text-purple-300 flex items-center gap-2 tracking-wide">
                <Bot className="w-4 h-4"/> QUMI AI ASSISTANT
              </span>
              <button onClick={() => setIsQumiExpanded(false)} className="text-gray-400 hover:text-white transition-colors">
                <ChevronDownCircle className="w-5 h-5"/>
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <QumiWorkspace 
                circuit={circuit}
                results={results}
                onCircuitAction={(actionType, circuitData) => {
                  if (circuitData) {
                    updateCircuitState(circuitData);
                  }
                }}
              />
            </div>
          </div>
        )}
        
        {!isQumiExpanded && (
          <button 
            onClick={() => setIsQumiExpanded(true)} 
            className="pointer-events-auto flex items-center justify-center w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-500 border border-purple-400/50 shadow-lg shadow-purple-500/20 transition-all hover:scale-110 group relative"
            title="Ask Qumi"
          >
            <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-ping opacity-75"></div>
            <Bot className="w-6 h-6 text-white group-hover:animate-pulse relative z-10" />
          </button>
        )}
      </div>

      <GateExplanationModal gate={explainedGate} onClose={() => setExplainedGate(null)} />
      <PresetSelectorModal isOpen={isPresetsOpen} onClose={() => setIsPresetsOpen(false)} onSelectPreset={(p) => { updateCircuitState(p); setIsPresetsOpen(false); }} />
    </div>
  );
}
