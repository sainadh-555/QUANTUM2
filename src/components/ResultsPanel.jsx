import React, { useState } from 'react';
import ProbabilityChart from './ProbabilityChart';
import StateVector from './StateVector';
import BlochSphere from './BlochSphere';
import CircuitInfo from './CircuitInfo';
import { BarChart3, Binary, Compass, Info, CheckCircle2, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';

export default function ResultsPanel({ results, circuit, isRunning }) {
  const [activeTab, setActiveTab] = useState('probability');
  const [isExpanded, setIsExpanded] = useState(false);

  const tabs = [
    { id: 'probability', label: '1. Probability', icon: BarChart3 },
    { id: 'statevector', label: '2. State Vector', icon: Binary },
    { id: 'bloch', label: '3. Bloch Sphere', icon: Compass },
    { id: 'info', label: '4. Circuit Information', icon: Info },
  ];

  return (
    <div className="w-full glass-panel border-t border-white/10 bg-[#070919]/90 shadow-2xl flex flex-col transition-all duration-300 ease-in-out">
      
      {/* Results Header with Tabs - CLick to Toggle */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-4 py-3 flex flex-wrap items-center justify-between gap-3 bg-black/40 hover:bg-black/60 cursor-pointer transition-colors"
      >
        <div className="flex items-center space-x-3">
          {isExpanded ? <ChevronDown className="w-4 h-4 text-cyan-400" /> : <ChevronUp className="w-4 h-4 text-cyan-400" />}
          <h3 className="font-bold text-sm tracking-wide text-gray-100 font-['Space_Grotesk'] uppercase flex items-center gap-2">
            <span>Simulation Results</span>
            {(results || isRunning) && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-mono border border-emerald-500/30">
            {results?.backend || 'Qiskit Aer'}
          </span>
        </div>

        {/* Tab Buttons (Always visible so they can be previewed/clicked) */}
        <div 
          className="flex items-center space-x-1 bg-white/5 p-1 rounded-xl border border-white/10"
          onClick={(e) => {
            // Prevent collapsing when just clicking a tab
            if (isExpanded) {
               e.stopPropagation();
            } else {
               // If collapsed and click a tab, expand it and select tab
               setIsExpanded(true);
            }
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={(e) => {
                   e.stopPropagation();
                   setActiveTab(tab.id);
                   setIsExpanded(true);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Area (Collapsible) */}
      {isExpanded && (
        <div className="p-6 overflow-y-auto max-h-[350px] min-h-[250px] border-t border-white/10">
          
          {(!results && !isRunning) ? (
            <div className="w-full h-full text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-200 font-['Space_Grotesk']">
                Ready for Quantum Execution
              </h3>
              <p className="text-xs text-gray-400 max-w-md">
                Build your circuit using the gate palette, then click <strong className="text-cyan-300">▶ RUN SIMULATION</strong> to observe computational basis probabilities, state vector amplitudes, and 3D Bloch sphere projections.
              </p>
            </div>
          ) : (
            <>
              {activeTab === 'probability' && (
                <ProbabilityChart
                  probabilities={results?.probabilities}
                  counts={results?.counts}
                  shots={results?.shots || 1024}
                />
              )}

              {activeTab === 'statevector' && (
                <StateVector
                  statevector={results?.statevector}
                  numQubits={circuit.qubits}
                />
              )}

              {activeTab === 'bloch' && (
                <BlochSphere
                  blochStates={results?.blochStates}
                  qubits={circuit.qubits}
                />
              )}

              {activeTab === 'info' && (
                <CircuitInfo
                  circuit={circuit}
                  results={results}
                />
              )}
            </>
          )}
        </div>
      )}

    </div>
  );
}
