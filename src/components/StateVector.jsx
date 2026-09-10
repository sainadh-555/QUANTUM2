import React from 'react';
import { Binary, Sparkles } from 'lucide-react';

export default function StateVector({ statevector = [], numQubits = 2 }) {
  const totalStates = Math.pow(2, numQubits);

  return (
    <div className="w-full space-y-4">
      {/* Dirac Notation Header */}
      <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs flex items-center justify-between font-mono">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>State Vector Representation: |Ψ⟩ = ∑ α_i |i⟩</span>
        </div>
        <span className="text-[10px] text-gray-400">Dim = 2^{numQubits} = {totalStates}</span>
      </div>

      {/* State Vector Amplitudes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Array.from({ length: totalStates }).map((_, idx) => {
          const binState = idx.toString(2).padStart(numQubits, '0');
          const amp = statevector[idx] || { real: idx === 0 ? 1 : 0, imag: 0, magnitude: idx === 0 ? 1 : 0 };
          const mag = amp.magnitude || Math.sqrt(amp.real * amp.real + amp.imag * amp.imag);
          const probPct = (mag * mag * 100).toFixed(1);

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                mag > 0.01
                  ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-200'
                  : 'bg-white/5 border-white/5 text-gray-500 opacity-60'
              }`}
            >
              {/* Basis State Label */}
              <div className="flex items-center space-x-3">
                <span className="px-2 py-1 rounded bg-white/10 font-mono font-bold text-cyan-300 text-xs">
                  |{binState}⟩
                </span>
                <div>
                  <div className="font-mono text-xs font-semibold">
                    {amp.real !== 0 && amp.imag !== 0
                      ? `${amp.real} ${amp.imag >= 0 ? '+' : ''} ${amp.imag}i`
                      : amp.real !== 0
                      ? `${amp.real}`
                      : amp.imag !== 0
                      ? `${amp.imag}i`
                      : '0.0000'}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">
                    Amplitude α_{idx}
                  </div>
                </div>
              </div>

              {/* Magnitude Progress Meter */}
              <div className="w-28 text-right">
                <div className="text-xs font-mono font-bold text-purple-300">{mag.toFixed(4)}</div>
                <div className="w-full h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, mag * 100)}%` }}
                  />
                </div>
                <div className="text-[9px] text-gray-400 font-mono mt-0.5">{probPct}% prob</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
