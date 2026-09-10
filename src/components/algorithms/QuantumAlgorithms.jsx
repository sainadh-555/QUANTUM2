import React, { useState } from 'react';
import {
  Binary,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Sparkles,
  Info,
  CheckCircle2,
  Zap,
  Layers,
  ArrowRight
} from 'lucide-react';

export const QUANTUM_ALGORITHMS = [
  {
    id: 'grover',
    name: "Grover's Search Algorithm",
    qubits: 2,
    speedup: 'Quadratic: O(√N) vs O(N)',
    targetState: '|11⟩',
    description: 'Amplifies the probability amplitude of a marked target state from an unsorted space of N=4 items in a single iteration.',
    intuitive: 'Imagine 4 identical closed boxes. Classically, you must open on average 2 to 3 boxes. Grover uses quantum phase inversion and reflection about the average to amplify the marked box to nearly 100% probability in just 1 step.',
    steps: [
      {
        stepIndex: 1,
        title: 'Step 1: Initialization to Ground State |00⟩',
        detail: 'Initialize both register qubits q0 and q1 to the computational ground state |00⟩.',
        circuitDiagram: 'q0: ──|0⟩──\nq1: ──|0⟩──',
        probabilities: { '00': 1.0, '01': 0.0, '10': 0.0, '11': 0.0 }
      },
      {
        stepIndex: 2,
        title: 'Step 2: Equal Superposition (Hadamard on both)',
        detail: 'Apply H gates across all qubits: H⊗H|00⟩ = (|00⟩ + |01⟩ + |10⟩ + |11⟩)/2. Each of the 4 basis states now has an equal 25% probability.',
        circuitDiagram: 'q0: ──|0⟩──[ H ]──\nq1: ──|0⟩──[ H ]──',
        probabilities: { '00': 0.25, '01': 0.25, '10': 0.25, '11': 0.25 }
      },
      {
        stepIndex: 3,
        title: 'Step 3: Oracle Phase Inversion (Marks |11⟩)',
        detail: 'The oracle applies a π phase flip exclusively to the target state |11⟩ via a Controlled-Z (CZ) gate. The state becomes (|00⟩ + |01⟩ + |10⟩ − |11⟩)/2.',
        circuitDiagram: 'q0: ──[ H ]──●──\nq1: ──[ H ]──■── (CZ Phase Inversion)',
        probabilities: { '00': 0.25, '01': 0.25, '10': 0.25, '11': 0.25 }
      },
      {
        stepIndex: 4,
        title: 'Step 4: Diffusion Operator (Inversion About Average)',
        detail: 'The diffusion operator reflects all amplitudes about their mean. Since the average was lowered by the negative target amplitude, reflection amplifies |11⟩ to 100% while destructive interference cancels the other three states to 0%!',
        circuitDiagram: 'q0: ──[ H ]──●──[ H ]──[ X ]──●──[ X ]──[ H ]──\nq1: ──[ H ]──■──[ H ]──[ X ]──■──[ X ]──[ H ]──',
        probabilities: { '00': 0.0, '01': 0.0, '10': 0.0, '11': 1.0 }
      },
      {
        stepIndex: 5,
        title: 'Step 5: Measurement in Computational Basis',
        detail: 'Measuring both qubits yields the marked target bitstring "11" with 100% deterministic certainty!',
        circuitDiagram: 'q0: ──────[ M ] ──> c0 = 1\nq1: ──────[ M ] ──> c1 = 1',
        probabilities: { '00': 0.0, '01': 0.0, '10': 0.0, '11': 1.0 }
      }
    ]
  },
  {
    id: 'bell-state',
    name: 'Bell State Entanglement (|Φ⁺⟩)',
    qubits: 2,
    speedup: 'Non-local correlation violation of Bell Inequality',
    targetState: '(|00⟩ + |11⟩)/√2',
    description: 'Prepares maximal quantum entanglement between two qubits using a Hadamard gate and a Controlled-NOT gate.',
    intuitive: 'Two independent quantum particles are linked so strongly that their physical states cannot be described independently, regardless of distance.',
    steps: [
      {
        stepIndex: 1,
        title: 'Step 1: Ground State Initialization',
        detail: 'Qubits q0 and q1 start in separable basis state |00⟩.',
        circuitDiagram: 'q0: ──|0⟩──\nq1: ──|0⟩──',
        probabilities: { '00': 1.0, '01': 0.0, '10': 0.0, '11': 0.0 }
      },
      {
        stepIndex: 2,
        title: 'Step 2: Superposition on Control Qubit (q0)',
        detail: 'Apply H to q0. The system enters separable product state: (|0⟩ + |1⟩)/√2 ⊗ |0⟩ = (|00⟩ + |10⟩)/√2.',
        circuitDiagram: 'q0: ──[ H ]──\nq1: ─────────',
        probabilities: { '00': 0.5, '01': 0.0, '10': 0.5, '11': 0.0 }
      },
      {
        stepIndex: 3,
        title: 'Step 3: CNOT Entanglement (Control q0 → Target q1)',
        detail: 'CNOT flips q1 if and only if q0 is |1⟩. This maps |10⟩ to |11⟩, producing the entangled Bell state: (|00⟩ + |11⟩)/√2.',
        circuitDiagram: 'q0: ──[ H ]──●──\nq1: ─────────X──',
        probabilities: { '00': 0.5, '01': 0.0, '10': 0.0, '11': 0.5 }
      },
      {
        stepIndex: 4,
        title: 'Step 4: Simultaneous Measurement Collapse',
        detail: 'Measuring q0 collapses q1 instantaneously into the exact same outcome. Only "00" (50%) and "11" (50%) are observed!',
        circuitDiagram: 'q0: ──[ H ]──●──[ M ]\nq1: ─────────X──[ M ]',
        probabilities: { '00': 0.5, '01': 0.0, '10': 0.0, '11': 0.5 }
      }
    ]
  },
  {
    id: 'deutsch-jozsa',
    name: 'Deutsch-Jozsa Algorithm',
    qubits: 2,
    speedup: 'Exponential query speedup: 1 evaluation vs 2^(n-1)+1',
    targetState: 'Constant vs Balanced Oracle',
    description: 'Determines whether an unknown boolean black-box function is constant or balanced with 100% certainty in a single query.',
    intuitive: 'Classically, you might have to query more than half the inputs to be sure. Deutsch-Jozsa uses quantum parallelism and destructive interference to check the global property in ONE shot.',
    steps: [
      {
        stepIndex: 1,
        title: 'Step 1: State Preparation (|0⟩ and |1⟩)',
        detail: 'Initialize input qubit q0 to |0⟩ and ancilla qubit q1 to |1⟩ (via Pauli-X gate).',
        circuitDiagram: 'q0: ──|0⟩──────\nq1: ──|0⟩──[ X ]──',
        probabilities: { '00': 0.0, '01': 1.0, '10': 0.0, '11': 0.0 }
      },
      {
        stepIndex: 2,
        title: 'Step 2: Create Superposition with Hadamards',
        detail: 'Apply H to both qubits. q0 becomes |+⟩ and q1 becomes |−⟩, preparing phase kickback.',
        circuitDiagram: 'q0: ──[ H ]──\nq1: ──[ H ]──',
        probabilities: { '00': 0.25, '01': 0.25, '10': 0.25, '11': 0.25 }
      },
      {
        stepIndex: 3,
        title: 'Step 3: Balanced Oracle Evaluation with Phase Kickback',
        detail: 'A CNOT from q0 to q1 acts as a balanced oracle. The eigenvalue phase (-1) kicks back into q0, mapping |+⟩ to |−⟩.',
        circuitDiagram: 'q0: ──●──\nq1: ──X── (Phase Kickback)',
        probabilities: { '00': 0.25, '01': 0.25, '10': 0.25, '11': 0.25 }
      },
      {
        stepIndex: 4,
        title: 'Step 4: Interference & Output Measurement',
        detail: 'Apply H to q0. If the function is balanced, H|−⟩ = |1⟩; if constant, H|+⟩ = |0⟩. Since q0 measures 1, the oracle is proven balanced!',
        circuitDiagram: 'q0: ──[ H ]──[ M ] ──> 1 (Balanced)\nq1: ──────────────',
        probabilities: { '00': 0.0, '01': 0.0, '10': 1.0, '11': 0.0 }
      }
    ]
  },
  {
    id: 'teleportation',
    name: 'Quantum Teleportation Protocol',
    qubits: 3,
    speedup: 'State transfer using shared entanglement + 2 classical bits',
    targetState: 'Arbitrary unknown state |ψ⟩',
    description: 'Transfers an arbitrary unknown single-qubit state from Alice (q0) to Bob (q2) without transmitting the physical qubit itself.',
    intuitive: 'Does not clone the state (preserving the No-Cloning theorem); measuring Alice\'s qubit destroys the original state locally while classical signals instruct Bob on how to reconstruct it perfectly.',
    steps: [
      {
        stepIndex: 1,
        title: 'Step 1: Shared Bell Pair Creation (q1-q2)',
        detail: 'Alice and Bob share an entangled Bell pair on qubits q1 and q2 (|Φ⁺⟩ = (|00⟩+|11⟩)/√2).',
        circuitDiagram: 'q0: ──|ψ⟩ (Unknown state)\nq1: ──[ H ]──●──\nq2: ─────────X──',
        probabilities: { '000': 0.5, '001': 0.0, '010': 0.0, '011': 0.5 }
      },
      {
        stepIndex: 2,
        title: 'Step 2: Bell Measurement on Alice\'s Qubits (q0 & q1)',
        detail: 'Alice applies a CNOT(q0→q1) and H on q0, then measures both qubits, yielding classical bits c0 and c1.',
        circuitDiagram: 'q0: ──●──[ H ]──[ M ]\nq1: ──X─────────[ M ]',
        probabilities: { '000': 0.25, '010': 0.25, '100': 0.25, '110': 0.25 }
      },
      {
        stepIndex: 3,
        title: 'Step 3: Classical Communication & Unitary Correction',
        detail: 'Alice sends the 2 bits to Bob. Bob applies Pauli X and Z corrections to qubit q2, restoring the exact initial state |ψ⟩!',
        circuitDiagram: 'q2: ──[ X if c1 ]──[ Z if c0 ] ──> |ψ⟩ Reconstructed!',
        probabilities: { '000': 1.0, '001': 0.0, '010': 0.0, '011': 0.0 }
      }
    ]
  }
];

export default function QuantumAlgorithms({ onOpenInLab }) {
  const [selectedAlgoId, setSelectedAlgoId] = useState('grover');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const algo = QUANTUM_ALGORITHMS.find(a => a.id === selectedAlgoId) || QUANTUM_ALGORITHMS[0];
  const totalSteps = algo.steps.length;
  const currentStep = algo.steps[currentStepIndex] || algo.steps[0];

  const handleSelectAlgo = (id) => {
    setSelectedAlgoId(id);
    setCurrentStepIndex(0);
  };

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  return (
    <div className="flex-1 max-w-[1720px] w-full mx-auto p-4 sm:p-8 flex flex-col space-y-6 overflow-y-auto select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-md">
              <Binary className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-['Space_Grotesk']">
                Quantum Algorithm Visualizer
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                Step-by-step statevector evolution & computational complexity
              </p>
            </div>
          </div>
        </div>

        {/* Algorithm Selector Buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto bg-white/[0.03] p-1 rounded-2xl border border-white/10">
          {QUANTUM_ALGORITHMS.map(a => (
            <button
              key={a.id}
              onClick={() => handleSelectAlgo(a.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedAlgoId === a.id
                  ? 'bg-gradient-to-r from-purple-500/25 to-pink-500/25 text-purple-200 border border-purple-500/40 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              {a.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Algorithm Workstation: Left Info & Controls | Right Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 Cols): Theory, Steps & Controls */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Algorithm Overview Card */}
          <div className="p-5 rounded-3xl bg-[#080b20] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                {algo.name}
              </h3>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                {algo.qubits} Qubits
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Advantage: {algo.speedup}</span>
              </div>
              <p className="text-xs text-gray-300 font-sans leading-relaxed">
                {algo.description}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200">
              <strong className="block mb-1 font-mono text-purple-300">Intuitive Understanding:</strong>
              <p className="leading-relaxed font-sans">{algo.intuitive}</p>
            </div>
          </div>

          {/* Stepper Navigation */}
          <div className="p-5 rounded-3xl bg-[#080b20] border border-white/10 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-gray-400">EXECUTION STEP:</span>
              <strong className="text-cyan-300">{currentStepIndex + 1} of {totalSteps}</strong>
            </div>

            {/* Stepper Progress Bar */}
            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 transition-all duration-300"
                style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
              />
            </div>

            {/* Current Step Description */}
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
              <h4 className="font-bold text-sm text-white font-['Space_Grotesk']">
                {currentStep.title}
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                {currentStep.detail}
              </p>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrev}
                  disabled={currentStepIndex === 0}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-gray-300 border border-white/10 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={handleReset}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors"
                  title="Reset to Step 1"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentStepIndex === totalSteps - 1}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-gray-300 border border-white/10 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => onOpenInLab?.(selectedAlgoId)}
                className="py-2.5 px-4 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md shadow-purple-500/10"
              >
                <FlaskConical className="w-4 h-4 text-purple-400" />
                <span>Open in Quantum Lab</span>
              </button>
            </div>

          </div>

        </div>

        {/* Right Column (7 Cols): Step Circuit & Live Probability Histogram */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Circuit State at this Step */}
          <div className="p-6 rounded-3xl bg-[#080b20] border border-white/10 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Step Circuit Topology</span>
            </h4>
            
            <div className="p-4 rounded-2xl bg-[#040612] border border-white/10 font-mono text-xs text-cyan-300 whitespace-pre overflow-x-auto selection:bg-cyan-500/30 leading-loose">
              {currentStep.circuitDiagram}
            </div>
          </div>

          {/* Basis State Probability Amplitude Histogram */}
          <div className="p-6 rounded-3xl bg-[#080b20] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Computational Basis Probabilities (Born's Rule)</span>
              </h4>
              <span className="text-[10px] font-mono text-gray-500">
                P(|x⟩) = |⟨x|ψ⟩|²
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {Object.entries(currentStep.probabilities).map(([state, prob]) => {
                const pct = Math.round(prob * 100);
                const isTarget = state === algo.targetState?.replace(/[|⟩]/g, '');

                return (
                  <div key={state} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold flex items-center gap-2 text-white">
                        <span>|{state}⟩</span>
                        {isTarget && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            TARGET
                          </span>
                        )}
                      </span>
                      <span className={pct > 0 ? 'text-cyan-300 font-bold' : 'text-gray-600'}>
                        {pct}%
                      </span>
                    </div>

                    <div className="w-full bg-white/[0.04] rounded-full h-3 overflow-hidden border border-white/5">
                      <div
                        className={`h-full transition-all duration-500 ${
                          pct > 0
                            ? isTarget
                              ? 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-md shadow-cyan-500/20'
                              : 'bg-gradient-to-r from-purple-500 to-indigo-600'
                            : 'bg-transparent'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
