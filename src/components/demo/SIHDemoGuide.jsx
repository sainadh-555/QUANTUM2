import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Play,
  FlaskConical,
  Bot,
  RotateCcw,
  CheckCircle2,
  X,
  Compass,
  Zap
} from 'lucide-react';

export const DEMO_STEPS = [
  {
    step: 1,
    title: '1. Launch Quantum Rush',
    description: 'Enter the 3-lane futuristic quantum city endless runner.',
    actionLabel: 'Launch Rush',
    targetTab: 'rush'
  },
  {
    step: 2,
    title: '2. Collect Hadamard (H) Token',
    description: 'As you navigate the quantum highway, collect the blue H gate token.',
    actionLabel: 'Collect Token',
    targetTab: 'rush'
  },
  {
    step: 3,
    title: '3. Educational Pause Challenge',
    description: 'The run pauses. Answer the Superposition challenge to earn +50 XP and unlock the concept.',
    actionLabel: 'Solve Quiz',
    targetTab: 'rush'
  },
  {
    step: 4,
    title: '4. Bridge to Quantum Lab',
    description: 'Click "Explore in Quantum Lab". The platform automatically pre-loads the |0⟩ ── H ── M circuit.',
    actionLabel: 'Open Quantum Lab',
    targetTab: 'lab',
    concept: 'superposition'
  },
  {
    step: 5,
    title: '5. Run Statevector Simulation',
    description: 'Press "Run Simulation" in Quantum Lab to compute basis probabilities (50% |0⟩, 50% |1⟩).',
    actionLabel: 'Execute Simulation',
    targetTab: 'lab'
  },
  {
    step: 6,
    title: '6. Inspect 3D Bloch Sphere',
    description: 'View the 3D Bloch vector aligned along the +X equator with polar angle θ = π/2.',
    actionLabel: 'View Bloch Sphere',
    targetTab: 'lab'
  },
  {
    step: 7,
    title: '7. Consult Qumi AI Companion',
    description: 'Ask Qumi: "Why is the outcome 50% |0⟩ and 50% |1⟩?" for pedagogical insight.',
    actionLabel: 'Ask Qumi',
    targetTab: 'lab',
    openQumi: true
  },
  {
    step: 8,
    title: '8. Bell State Entanglement Demo',
    description: 'Switch to the 2-qubit Bell State circuit (|00⟩ + |11⟩)/√2 and observe non-local correlation.',
    actionLabel: 'Load Bell State',
    targetTab: 'lab',
    concept: 'entanglement'
  }
];

export default function SIHDemoGuide({
  isOpen,
  onClose,
  onNavigateTab,
  onLoadConceptInLab,
  onOpenQumi
}) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  if (!isOpen) return null;

  const currentStep = DEMO_STEPS[currentStepIdx];
  const isLast = currentStepIdx === DEMO_STEPS.length - 1;

  const handleStepAction = () => {
    if (currentStep.targetTab) {
      onNavigateTab(currentStep.targetTab);
    }
    if (currentStep.concept) {
      onLoadConceptInLab(currentStep.concept);
    }
    if (currentStep.openQumi) {
      onOpenQumi();
    }

    if (!isLast) {
      setCurrentStepIdx(currentStepIdx + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-[#070a1e] border-2 border-amber-500/50 rounded-3xl p-5 shadow-2xl shadow-amber-500/20 text-white animate-in slide-in-from-bottom-5 duration-200">
      
      {/* Demo Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-white font-['Space_Grotesk']">
                SIH 2026 Judge Demo Flow
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                2 MIN PITCH
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono">
              Step {currentStep.step} of {DEMO_STEPS.length}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Step Info */}
      <div className="space-y-1.5 mb-4">
        <h4 className="font-bold text-sm text-amber-300 font-['Space_Grotesk']">
          {currentStep.title}
        </h4>
        <p className="text-xs text-gray-300 font-sans leading-relaxed">
          {currentStep.description}
        </p>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center space-x-1.5 mb-4">
        {DEMO_STEPS.map((s, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all ${
              idx === currentStepIdx
                ? 'w-6 bg-amber-400'
                : idx < currentStepIdx
                ? 'w-2 bg-emerald-400'
                : 'w-2 bg-white/10'
            }`}
          />
        ))}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-white/10">
        <button
          onClick={() => setCurrentStepIdx(0)}
          className="text-xs text-gray-400 hover:text-gray-200 flex items-center gap-1 font-mono"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Restart</span>
        </button>

        <button
          onClick={handleStepAction}
          className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-bold text-xs uppercase font-['Space_Grotesk'] flex items-center space-x-1.5 shadow-md shadow-amber-500/25 transition-all active:scale-95"
        >
          <span>{currentStep.actionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
