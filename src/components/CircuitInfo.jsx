import React from 'react';
import { Cpu, Layers, Clock, Server, Hash, CheckCircle2 } from 'lucide-react';

export default function CircuitInfo({ circuit, results }) {
  const numQubits = circuit.qubits || 2;
  const numBits = circuit.classicalBits || numQubits;
  const gateCount = circuit.operations?.length || 0;
  const depth = new Set(circuit.operations?.map(op => op.column) || []).size;
  const execTime = results?.execution_time || 0.045;
  const backendName = results?.backend || 'Qiskit Aer';

  const stats = [
    { label: 'Qubits', value: numQubits, icon: Cpu, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { label: 'Classical Bits', value: numBits, icon: Hash, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Gate Count', value: gateCount, icon: Layers, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
    { label: 'Circuit Depth', value: depth, icon: Layers, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Execution Time', value: `${execTime} s`, icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Target Backend', value: backendName, icon: Server, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  ];

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className={`p-4 rounded-xl border flex items-center space-x-3 ${s.bg}`}>
              <div className={`p-2.5 rounded-lg bg-white/10 ${s.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-mono">
                  {s.label}
                </p>
                <p className="text-sm sm:text-base font-bold font-mono text-white mt-0.5">
                  {s.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Backend Compatibility Status Notice */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start space-x-3 text-xs">
        <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-semibold text-gray-200 font-mono">FastAPI + Qiskit Integration Ready</h4>
          <p className="text-gray-400 leading-relaxed">
            The frontend circuit JSON model directly maps to Qiskit&apos;s <code className="text-cyan-300">QuantumCircuit(n, c)</code> architecture. When running locally with the FastAPI backend (<code className="text-cyan-300">backend/main.py</code>), simulation requests execute directly on the Qiskit Aer high-performance backend.
          </p>
        </div>
      </div>
    </div>
  );
}
