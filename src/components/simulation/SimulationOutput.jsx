import React, { useState } from 'react';
import {
  Terminal,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Zap,
  Activity,
  Gauge,
  Clock,
  ChevronUp,
  ChevronDown,
  Info
} from 'lucide-react';

export default function SimulationOutput({
  result,
  isRunning,
  components = []
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!result) {
    return (
      <div className="w-full bg-[#060919] border-t border-white/10 px-4 py-2 flex items-center justify-between text-xs text-gray-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gray-500" />
          <span>Status: Standby • Click &quot;Run Simulation&quot; to test circuit</span>
        </div>
      </div>
    );
  }

  const {
    isValid,
    voltage = 0,
    current_mA = 0,
    power_mW = 0,
    executionTimeMs = 0,
    componentStates = {},
    messages = [],
    errors = [],
    suggestions = []
  } = result;

  return (
    <div className="w-full bg-[#060919]/95 border-t border-white/10 text-gray-200 transition-all">
      
      {/* Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] border-b border-white/5"
      >
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-semibold tracking-wide font-['Space_Grotesk'] uppercase">
            Simulation Output & Telemetry
          </h4>

          {/* Status Badge */}
          {isRunning ? (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono animate-pulse">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Running Live
            </span>
          ) : isValid ? (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono">
              <CheckCircle2 className="w-3 h-3" />
              Simulation Successful
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[11px] font-mono">
              <XCircle className="w-3 h-3" />
              Circuit Incomplete / Warning
            </span>
          )}
        </div>

        {/* Real-time Metric Badges */}
        <div className="hidden sm:flex items-center gap-4 text-[11px] font-mono">
          <div className="flex items-center gap-1 text-cyan-300">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>{voltage}V</span>
          </div>
          <div className="flex items-center gap-1 text-amber-300">
            <Activity className="w-3 h-3 text-amber-400" />
            <span>{current_mA} mA</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-300">
            <Gauge className="w-3 h-3 text-emerald-400" />
            <span>{power_mW} mW</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <Clock className="w-3 h-3 text-gray-400" />
            <span>{executionTimeMs} ms</span>
          </div>
          <button className="text-gray-400 hover:text-white p-0.5">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Diagnostics Drawer */}
      {isExpanded && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono max-h-48 overflow-y-auto">
          
          {/* Column 1: System Messages & Errors */}
          <div className="space-y-2 bg-white/[0.02] p-3 rounded-xl border border-white/5">
            <h5 className="text-[11px] font-bold text-gray-300 uppercase flex items-center gap-1.5 font-sans">
              <Terminal className="w-3 h-3 text-cyan-400" />
              Diagnostics Log
            </h5>
            {errors.length > 0 && (
              <div className="space-y-1">
                {errors.map((err, i) => (
                  <p key={i} className="text-rose-400 text-[11px] flex items-start gap-1">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{err}</span>
                  </p>
                ))}
              </div>
            )}
            {messages.length > 0 && (
              <div className="space-y-1">
                {messages.map((msg, i) => (
                  <p key={i} className="text-emerald-400 text-[11px] flex items-start gap-1">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>{msg}</span>
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Component States Table */}
          <div className="space-y-2 bg-white/[0.02] p-3 rounded-xl border border-white/5">
            <h5 className="text-[11px] font-bold text-gray-300 uppercase flex items-center gap-1.5 font-sans">
              <Activity className="w-3 h-3 text-amber-400" />
              Active Component States
            </h5>
            <div className="space-y-1.5">
              {components.map(comp => {
                const state = componentStates[comp.id];
                return (
                  <div key={comp.id} className="flex justify-between items-center text-[11px] border-b border-white/5 pb-1">
                    <span className="text-gray-300 font-bold">{comp.properties?.name || comp.type}</span>
                    <span className={`text-[10px] ${state?.active ? 'text-cyan-300 font-semibold' : 'text-gray-500'}`}>
                      {state?.stateText || 'IDLE'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 3: Actionable AI Suggestions */}
          <div className="space-y-2 bg-white/[0.02] p-3 rounded-xl border border-white/5">
            <h5 className="text-[11px] font-bold text-cyan-300 uppercase flex items-center gap-1.5 font-sans">
              <Info className="w-3 h-3 text-cyan-400" />
              Actionable Feedback
            </h5>
            {suggestions.length > 0 ? (
              <ul className="space-y-1">
                {suggestions.map((sug, i) => (
                  <li key={i} className="text-gray-300 text-[11px] flex items-start gap-1.5">
                    <span className="text-cyan-400 font-bold">💡</span>
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-[11px]">
                Circuit parameters are optimal. No corrections required.
              </p>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
