import React from 'react';
import { COMPONENT_DEFINITIONS } from '../../data/simulationComponents';
import { X, Sliders, Trash2, Cpu, Check } from 'lucide-react';

const LED_COLORS = [
  { name: 'Red', hex: '#ef4444' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Purple', hex: '#a855f7' }
];

export default function ComponentProperties({
  component,
  onUpdateProperties,
  onDeleteComponent,
  onClose
}) {
  if (!component) return null;

  const def = COMPONENT_DEFINITIONS[component.type];
  const props = component.properties || {};

  const handlePropertyChange = (key, value) => {
    onUpdateProperties(component.id, {
      ...props,
      [key]: value
    });
  };

  return (
    <div className="absolute right-4 top-4 z-30 w-72 bg-[#090d24]/95 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-black/80 backdrop-blur-md overflow-hidden text-gray-200 animate-in fade-in slide-in-from-right-4 duration-200">
      
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">
            <Sliders className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-100 font-['Space_Grotesk']">
              Properties
            </h3>
            <span className="text-[10px] text-gray-400 font-mono">
              {def?.name || component.type}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onDeleteComponent(component.id)}
            title="Delete component"
            className="p-1 rounded-md text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Property Inputs Form */}
      <div className="p-4 space-y-3.5 text-xs">
        
        {/* Name / Identifier */}
        <div>
          <label className="block text-[10px] font-mono text-gray-400 mb-1">
            Component Label / Name
          </label>
          <input
            type="text"
            value={props.name || ''}
            onChange={(e) => handlePropertyChange('name', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-100 font-mono focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Resistor: Resistance Value (Ω) */}
        {component.type === 'resistor' && (
          <div>
            <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 mb-1">
              <span>Resistance (Ω)</span>
              <span className="text-amber-400 font-bold">{props.resistance || 220} Ω</span>
            </div>
            <input
              type="number"
              min="10"
              max="100000"
              step="10"
              value={props.resistance || 220}
              onChange={(e) => handlePropertyChange('resistance', Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-amber-300 font-mono focus:outline-none focus:border-amber-400"
            />
            {/* Quick Presets */}
            <div className="flex gap-1 mt-2">
              {[100, 220, 330, 1000, 10000].map(val => (
                <button
                  key={val}
                  onClick={() => handlePropertyChange('resistance', val)}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${
                    props.resistance === val
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10'
                  }`}
                >
                  {val >= 1000 ? `${val / 1000}k` : `${val}Ω`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Battery: Supply Voltage */}
        {component.type === 'battery' && (
          <div>
            <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 mb-1">
              <span>Supply Voltage (DC)</span>
              <span className="text-cyan-400 font-bold">{props.voltage || 5} V</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[3.3, 5, 9, 12].map(v => (
                <button
                  key={v}
                  onClick={() => handlePropertyChange('voltage', v)}
                  className={`py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                    props.voltage === v
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm shadow-cyan-500/20'
                      : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {v}V
                </button>
              ))}
            </div>
          </div>
        )}

        {/* LED: Color Picker */}
        {component.type === 'led' && (
          <div>
            <label className="block text-[10px] font-mono text-gray-400 mb-1.5">
              LED Color
            </label>
            <div className="flex items-center gap-2">
              {LED_COLORS.map(c => (
                <button
                  key={c.name}
                  onClick={() => {
                    handlePropertyChange('color', c.hex);
                    handlePropertyChange('colorName', c.name);
                  }}
                  title={c.name}
                  className="w-6 h-6 rounded-full border-2 transition-transform flex items-center justify-center hover:scale-110"
                  style={{
                    backgroundColor: c.hex,
                    borderColor: props.color === c.hex ? '#ffffff' : 'transparent',
                    boxShadow: props.color === c.hex ? `0 0 10px ${c.hex}` : 'none'
                  }}
                >
                  {props.color === c.hex && <Check className="w-3 h-3 text-white" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Switch: State Toggle */}
        {component.type === 'switch' && (
          <div>
            <label className="block text-[10px] font-mono text-gray-400 mb-1">
              Switch State
            </label>
            <button
              onClick={() => handlePropertyChange('closed', props.closed === false)}
              className={`w-full py-2 rounded-lg font-mono font-bold text-xs border transition-all ${
                props.closed !== false
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}
            >
              {props.closed !== false ? 'CLOSED (Conducting)' : 'OPEN (Interrupted)'}
            </button>
          </div>
        )}

        {/* Sensor: LDR Lux / Darkness */}
        {component.type === 'ldr' && (
          <div>
            <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 mb-1">
              <span>Ambient Light Level</span>
              <span className="text-amber-400 font-bold">{props.luxLevel || 50}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={props.luxLevel || 50}
              onChange={(e) => handlePropertyChange('luxLevel', Number(e.target.value))}
              className="w-full accent-amber-400"
            />
            <div className="flex justify-between text-[9px] text-gray-500 font-mono">
              <span>Dark (Night)</span>
              <span>Bright Sun</span>
            </div>
          </div>
        )}

        {/* Sensor: Temperature */}
        {component.type === 'temp_sensor' && (
          <div>
            <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 mb-1">
              <span>Simulated Temperature</span>
              <span className="text-rose-400 font-bold">{props.temperature || 25}°C</span>
            </div>
            <input
              type="range"
              min="-10"
              max="100"
              value={props.temperature || 25}
              onChange={(e) => handlePropertyChange('temperature', Number(e.target.value))}
              className="w-full accent-rose-400"
            />
            <div className="flex justify-between text-[9px] text-gray-500 font-mono">
              <span>-10°C</span>
              <span>100°C</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
