import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from 'recharts';
import { Info, BarChart3 } from 'lucide-react';

export default function ProbabilityChart({ probabilities = {}, counts = {}, shots = 1024 }) {
  const chartData = Object.keys(probabilities).map((state) => ({
    state: `|${state}⟩`,
    probability: (probabilities[state] * 100).toFixed(1),
    count: counts[state] || 0
  }));

  const COLORS = ['#00f2fe', '#4facfe', '#7f00ff', '#a855f7', '#ec4899', '#10b981'];

  return (
    <div className="w-full flex flex-col space-y-4">
      
      {/* Top Banner / Explanation */}
      <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs flex items-center space-x-2.5">
        <Info className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>
          Measurement probabilities show how likely each computational basis state is to be observed after <strong>{shots}</strong> shots.
        </span>
      </div>

      {/* Recharts Bar Chart */}
      <div className="h-64 w-full bg-[#080b1e]/60 rounded-xl p-4 border border-white/5">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 text-xs font-mono">
            No simulation results available. Click ▶ RUN SIMULATION.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="state"
                stroke="#94a3b8"
                tick={{ fill: '#00f2fe', fontSize: 13, fontWeight: 'bold', fontFamily: 'monospace' }}
              />
              <YAxis
                stroke="#94a3b8"
                unit="%"
                domain={[0, 100]}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0c1024',
                  borderColor: '#00f2fe',
                  borderRadius: '12px',
                  color: '#fff',
                  boxShadow: '0 8px 32px rgba(0, 242, 254, 0.2)'
                }}
                formatter={(value, name, props) => [
                  `${value}% (${props.payload.count} shots)`,
                  'Probability'
                ]}
              />
              <Bar dataKey="probability" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Basis States Table */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {chartData.map((d, i) => (
          <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <span className="font-mono text-cyan-300 font-bold text-xs">{d.state}</span>
            <div className="text-right">
              <div className="font-mono text-white text-xs font-semibold">{d.probability}%</div>
              <div className="text-[10px] text-gray-400 font-mono">{d.count} shots</div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
