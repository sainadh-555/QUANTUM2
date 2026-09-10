import React, { useState, useRef, useEffect } from 'react';
import { COMPONENT_DEFINITIONS } from '../../data/simulationComponents';
import {
  MousePointer,
  Cable,
  Trash2,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';

export default function SimulationCanvas({
  simulationState,
  onUpdateState,
  selectedCompId,
  onSelectComponent,
  onDeleteSelected,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onClearCanvas,
  isRunning,
  simulationResult,
  onToggleSwitch
}) {
  const containerRef = useRef(null);

  // Pan & Zoom state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // Tool mode: 'select' | 'wire'
  const [activeTool, setActiveTool] = useState('select');

  // Dragging component on canvas
  const [draggingCompId, setDraggingCompId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Wire creation state
  const [pendingWire, setPendingWire] = useState(null); // { sourceComponent, sourcePort, startX, startY, currentX, currentY }

  const { components = [], connections = [] } = simulationState;

  // Convert screen coordinates to canvas coordinate space
  const screenToCanvas = (clientX, clientY) => {
    if (!containerRef.current) return { x: clientX, y: clientY };
    const rect = containerRef.current.getBoundingClientRect();
    const x = (clientX - rect.left - pan.x) / zoom;
    const y = (clientY - rect.top - pan.y) / zoom;
    return { x, y };
  };

  // Drag & Drop from Library onto Canvas
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const compType = e.dataTransfer.getData('text/plain');
    if (!compType || !COMPONENT_DEFINITIONS[compType]) return;

    const { x, y } = screenToCanvas(e.clientX, e.clientY);
    const def = COMPONENT_DEFINITIONS[compType];
    const newComp = {
      id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: compType,
      x: Math.max(20, Math.round(x - def.width / 2)),
      y: Math.max(20, Math.round(y - def.height / 2)),
      properties: { ...def.defaultProps }
    };

    onUpdateState({
      ...simulationState,
      components: [...components, newComp]
    });
    onSelectComponent(newComp.id);
  };

  // Canvas Pan Handlers
  const handleMouseDown = (e) => {
    // If clicking background, start pan or clear selection
    if (e.target === containerRef.current || e.target.tagName === 'svg' || e.target.id === 'canvas-bg') {
      if (pendingWire) {
        setPendingWire(null); // Cancel wire
      }
      onSelectComponent(null);

      if (e.button === 0) { // Left click
        setIsPanning(true);
        setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      }
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y
      });
      return;
    }

    if (draggingCompId) {
      const { x, y } = screenToCanvas(e.clientX, e.clientY);
      const updated = components.map(c => {
        if (c.id === draggingCompId) {
          return {
            ...c,
            x: Math.max(10, Math.round(x - dragOffset.x)),
            y: Math.max(10, Math.round(y - dragOffset.y))
          };
        }
        return c;
      });
      onUpdateState({ ...simulationState, components: updated }, false);
      return;
    }

    if (pendingWire) {
      const { x, y } = screenToCanvas(e.clientX, e.clientY);
      setPendingWire(prev => ({
        ...prev,
        currentX: x,
        currentY: y
      }));
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    if (draggingCompId) {
      setDraggingCompId(null);
      // Finalize update with history push
      onUpdateState({ ...simulationState });
    }
  };

  // Component Drag Start
  const handleCompMouseDown = (e, comp) => {
    e.stopPropagation();
    onSelectComponent(comp.id);

    if (activeTool === 'select') {
      const { x, y } = screenToCanvas(e.clientX, e.clientY);
      setDraggingCompId(comp.id);
      setDragOffset({
        x: x - comp.x,
        y: y - comp.y
      });
    }
  };

  // Port Click (Wire creation)
  const handlePortClick = (e, comp, port) => {
    e.stopPropagation();
    const portPos = getPortAbsoluteCoords(comp, port);

    if (!pendingWire) {
      // Start wire
      setPendingWire({
        sourceComponent: comp.id,
        sourcePort: port.id,
        startX: portPos.x,
        startY: portPos.y,
        currentX: portPos.x,
        currentY: portPos.y
      });
    } else {
      // Complete wire
      if (pendingWire.sourceComponent === comp.id && pendingWire.sourcePort === port.id) {
        // Clicked same port: cancel
        setPendingWire(null);
        return;
      }

      // Check if connection already exists
      const exists = connections.some(c =>
        (c.sourceComponent === pendingWire.sourceComponent && c.sourcePort === pendingWire.sourcePort &&
         c.targetComponent === comp.id && c.targetPort === port.id) ||
        (c.sourceComponent === comp.id && c.sourcePort === port.id &&
         c.targetComponent === pendingWire.sourceComponent && c.targetPort === pendingWire.sourcePort)
      );

      if (!exists) {
        const newConnection = {
          id: `wire-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          sourceComponent: pendingWire.sourceComponent,
          sourcePort: pendingWire.sourcePort,
          targetComponent: comp.id,
          targetPort: port.id
        };

        onUpdateState({
          ...simulationState,
          connections: [...connections, newConnection]
        });
      }

      setPendingWire(null);
    }
  };

  // Calculate absolute canvas coordinates for a port
  const getPortAbsoluteCoords = (comp, port) => {
    return {
      x: comp.x + port.x,
      y: comp.y + port.y
    };
  };

  const getPortCoordsById = (compId, portId) => {
    const comp = components.find(c => c.id === compId);
    if (!comp) return { x: 0, y: 0 };
    const def = COMPONENT_DEFINITIONS[comp.type];
    if (!def) return { x: comp.x, y: comp.y };
    const port = def.ports.find(p => p.id === portId);
    if (!port) return { x: comp.x, y: comp.y };
    return { x: comp.x + port.x, y: comp.y + port.y };
  };

  // Keyboard Delete Shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedCompId) {
        // Avoid deleting if typing in an input
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
        onDeleteSelected();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCompId, onDeleteSelected]);

  // Zoom controls
  const handleZoomIn = () => setZoom(z => Math.min(2.0, Number((z + 0.15).toFixed(2))));
  const handleZoomOut = () => setZoom(z => Math.max(0.4, Number((z - 0.15).toFixed(2))));
  const handleFit = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Render a component representation
  const renderComponentVisual = (comp) => {
    const def = COMPONENT_DEFINITIONS[comp.type];
    if (!def) return null;
    const isSelected = selectedCompId === comp.id;
    const compState = simulationResult?.componentStates?.[comp.id];

    return (
      <div
        key={comp.id}
        onMouseDown={(e) => handleCompMouseDown(e, comp)}
        style={{
          transform: `translate(${comp.x}px, ${comp.y}px)`,
          width: def.width,
          height: def.height
        }}
        className={`absolute select-none cursor-move transition-shadow rounded-xl border backdrop-blur-sm p-1.5 flex flex-col justify-between ${
          isSelected
            ? 'border-cyan-400 ring-2 ring-cyan-500/40 shadow-lg shadow-cyan-500/20 bg-[#0a1128]/95 z-20'
            : 'border-white/10 hover:border-white/30 bg-[#070d1e]/90 z-10'
        }`}
      >
        {/* Component Header / Label */}
        <div className="flex items-center justify-between px-1 pointer-events-none">
          <span className="text-[10px] font-mono font-bold text-gray-300 truncate max-w-[85%]">
            {comp.properties?.name || def.shortName}
          </span>
          {comp.type === 'battery' && (
            <span className="text-[9px] font-mono text-cyan-400 font-semibold">
              {comp.properties?.voltage || 5}V
            </span>
          )}
          {comp.type === 'resistor' && (
            <span className="text-[9px] font-mono text-amber-400 font-semibold">
              {comp.properties?.resistance || 220}Ω
            </span>
          )}
        </div>

        {/* Visual Realistic Representation by Type */}
        <div className="flex-1 flex items-center justify-center relative">
          
          {/* LED Visual */}
          {comp.type === 'led' && (
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full border border-white/20 transition-all duration-300 ${
                  isRunning && compState?.active
                    ? 'ring-8 shadow-2xl scale-110'
                    : 'opacity-70'
                }`}
                style={{
                  backgroundColor: comp.properties?.color || '#ef4444',
                  boxShadow: isRunning && compState?.active
                    ? `0 0 25px ${comp.properties?.color || '#ef4444'}, inset 0 0 10px #ffffff`
                    : 'none'
                }}
              />
              <span className="text-[8px] font-mono text-gray-400 mt-1">
                {isRunning && compState?.active ? 'ON' : 'OFF'}
              </span>
            </div>
          )}

          {/* Resistor Visual with schematic zigzag */}
          {comp.type === 'resistor' && (
            <div className="w-full flex items-center justify-center px-1">
              <svg width="60" height="18" viewBox="0 0 60 18" className="stroke-amber-400 fill-none stroke-2">
                <path d="M0,9 L10,9 L15,2 L25,16 L35,2 L45,16 L50,9 L60,9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}

          {/* Battery Visual */}
          {comp.type === 'battery' && (
            <div className="flex items-center gap-1.5 px-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 text-xs font-bold font-mono">
                DC
              </div>
              <div className="flex flex-col text-[8px] font-mono text-gray-400">
                <span className="text-emerald-400 font-bold">+ VCC</span>
                <span className="text-gray-500">- GND</span>
              </div>
            </div>
          )}

          {/* Switch Visual (Interactive click even in run mode) */}
          {comp.type === 'switch' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSwitch(comp.id);
              }}
              className={`px-3 py-1 rounded-md text-[10px] font-mono font-bold transition-all border ${
                comp.properties?.closed !== false
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}
            >
              {comp.properties?.closed !== false ? 'CLOSED [ON]' : 'OPEN [OFF]'}
            </button>
          )}

          {/* Motor Visual with rotating shaft */}
          {comp.type === 'motor' && (
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full border-2 border-cyan-400 bg-cyan-950 flex items-center justify-center ${
                  isRunning && compState?.active ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '0.6s' }}
              >
                <div className="w-1.5 h-6 bg-cyan-300 rounded-full" />
              </div>
              <span className="text-[8px] font-mono text-cyan-300">
                {isRunning && compState?.active ? 'SPINNING' : 'IDLE'}
              </span>
            </div>
          )}

          {/* Buzzer Visual */}
          {comp.type === 'buzzer' && (
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full bg-purple-900 border border-purple-400 flex items-center justify-center text-purple-300 ${
                isRunning && compState?.active ? 'animate-pulse ring-4 ring-purple-500/30' : ''
              }`}>
                🔊
              </div>
              <span className="text-[8px] font-mono text-purple-300">
                {isRunning && compState?.active ? 'BEEP' : 'OFF'}
              </span>
            </div>
          )}

          {/* Logic Gates (AND, OR, NOT, XOR) */}
          {['and_gate', 'or_gate', 'not_gate', 'xor_gate'].includes(comp.type) && (
            <div className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-center">
              <span className="text-[10px] font-mono font-bold text-cyan-300">
                {def.shortName}
              </span>
              {isRunning && (
                <div className="text-[8px] font-mono text-emerald-400">
                  {compState?.stateText || 'ACTIVE'}
                </div>
              )}
            </div>
          )}

          {/* Ground (GND) */}
          {comp.type === 'gnd' && (
            <div className="flex flex-col items-center">
              <div className="w-6 h-0.5 bg-gray-400 mb-0.5" />
              <div className="w-4 h-0.5 bg-gray-400 mb-0.5" />
              <div className="w-2 h-0.5 bg-gray-400" />
            </div>
          )}

          {/* Arduino Microcontroller */}
          {comp.type === 'arduino' && (
            <div className="w-full h-full p-1 bg-[#092233] rounded-lg border border-cyan-500/40 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[8px] font-mono text-cyan-300">
                <span>ARDUINO UNO</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-1 text-[7px] font-mono text-gray-300">
                <div>D13 • D12 • D11</div>
                <div className="text-right">5V • GND</div>
              </div>
            </div>
          )}

          {/* Sensor visuals */}
          {comp.type === 'ldr' && (
            <div className="text-[9px] font-mono text-amber-300 text-center">
              LDR Photocell
            </div>
          )}
          {comp.type === 'temp_sensor' && (
            <div className="text-[9px] font-mono text-rose-300 text-center">
              TMP36 ({comp.properties?.temperature || 25}°C)
            </div>
          )}
        </div>

        {/* Port Terminal Circles */}
        {def.ports.map(port => {
          const isWireSource = pendingWire?.sourceComponent === comp.id && pendingWire?.sourcePort === port.id;
          return (
            <div
              key={port.id}
              onClick={(e) => handlePortClick(e, comp, port)}
              title={`${port.name} (Click to wire)`}
              style={{
                left: port.x,
                top: port.y
              }}
              className={`absolute w-3.5 h-3.5 -ml-1.5 -mt-1.5 rounded-full border-2 cursor-pointer transition-all hover:scale-150 z-30 ${
                isWireSource
                  ? 'bg-amber-400 border-white ring-4 ring-amber-400/50 scale-125'
                  : port.polarity === 'positive'
                  ? 'bg-rose-500 border-rose-200 hover:ring-2 hover:ring-rose-400'
                  : port.polarity === 'negative'
                  ? 'bg-emerald-500 border-emerald-200 hover:ring-2 hover:ring-emerald-400'
                  : 'bg-cyan-400 border-cyan-100 hover:ring-2 hover:ring-cyan-300'
              }`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="relative flex-1 w-full h-full overflow-hidden bg-[#050713] select-none flex flex-col">
      
      {/* Canvas Toolbar */}
      <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 p-1.5 rounded-xl bg-[#080d22]/90 border border-white/10 backdrop-blur-md shadow-lg shadow-black/40">
        
        {/* Select Tool */}
        <button
          onClick={() => setActiveTool('select')}
          title="Select & Move Tool"
          className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
            activeTool === 'select'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
              : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
          }`}
        >
          <MousePointer className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Select</span>
        </button>

        {/* Wire Tool Indicator */}
        <button
          onClick={() => {
            setActiveTool('wire');
            if (pendingWire) setPendingWire(null);
          }}
          title="Connect Wires (Click ports on components to wire)"
          className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
            activeTool === 'wire' || pendingWire
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/20'
              : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
          }`}
        >
          <Cable className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Wire</span>
        </button>

        <div className="w-px h-5 bg-white/10 mx-1" />

        {/* Delete */}
        <button
          onClick={onDeleteSelected}
          disabled={!selectedCompId}
          title="Delete Selected Component (Del / Backspace)"
          className={`p-2 rounded-lg transition-all ${
            selectedCompId
              ? 'text-rose-400 hover:bg-rose-500/20 hover:text-rose-300'
              : 'text-gray-600 cursor-not-allowed'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        {/* Undo */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo Action"
          className={`p-2 rounded-lg transition-all ${
            canUndo ? 'text-gray-300 hover:bg-white/10 hover:text-white' : 'text-gray-600 cursor-not-allowed'
          }`}
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>

        {/* Redo */}
        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo Action"
          className={`p-2 rounded-lg transition-all ${
            canRedo ? 'text-gray-300 hover:bg-white/10 hover:text-white' : 'text-gray-600 cursor-not-allowed'
          }`}
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-5 bg-white/10 mx-1" />

        {/* Zoom Controls */}
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <span className="text-[10px] font-mono text-gray-400 min-w-[32px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleFit}
          title="Reset Zoom & Pan"
          className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-5 bg-white/10 mx-1" />

        {/* Clear Canvas */}
        <button
          onClick={onClearCanvas}
          title="Clear Canvas"
          className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/20 text-xs font-medium flex items-center gap-1 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden md:inline text-[11px]">Clear</span>
        </button>
      </div>

      {/* Interactive Helper Banner when pending wire */}
      {pendingWire && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-medium flex items-center gap-2 backdrop-blur-md shadow-lg animate-pulse">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          Click target component port to connect wire (or click canvas to cancel)
        </div>
      )}

      {/* Main Drag-Drop Canvas Area */}
      <div
        id="canvas-bg"
        ref={containerRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="flex-1 w-full h-full relative overflow-hidden cursor-crosshair"
      >
        {/* SVG Grid and Wire Connections Layer */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0'
          }}
        >
          {/* Engineering Dot Matrix Grid Pattern */}
          <defs>
            <pattern id="grid-dots" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#334155" fillOpacity="0.4" />
            </pattern>
            {/* Pulsing glow filter for active simulation wires */}
            <filter id="wire-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <rect width="5000" height="5000" fill="url(#grid-dots)" />

          {/* Render Saved Wires */}
          {connections.map(conn => {
            const p1 = getPortCoordsById(conn.sourceComponent, conn.sourcePort);
            const p2 = getPortCoordsById(conn.targetComponent, conn.targetPort);

            // Calculate smooth cubic Bezier path
            const dx = Math.abs(p2.x - p1.x) * 0.5;
            const path = `M ${p1.x} ${p1.y} C ${p1.x + dx} ${p1.y}, ${p2.x - dx} ${p2.y}, ${p2.x} ${p2.y}`;

            return (
              <g key={conn.id} className="pointer-events-auto group">
                {/* Wider invisible stroke for easy clicking/selection */}
                <path
                  d={path}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="14"
                  className="cursor-pointer"
                />
                {/* Main wire line */}
                <path
                  d={path}
                  fill="none"
                  stroke={isRunning ? '#22d3ee' : '#0284c7'}
                  strokeWidth={isRunning ? '3' : '2.5'}
                  filter={isRunning ? 'url(#wire-glow)' : 'none'}
                  className="transition-all"
                />
                {/* Animated Electric Current Flow Pulses during simulation */}
                {isRunning && (
                  <path
                    d={path}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeDasharray="6 12"
                    className="animate-pulse"
                    style={{
                      strokeDashoffset: 100,
                      animation: 'dash 1s linear infinite'
                    }}
                  />
                )}
              </g>
            );
          })}

          {/* Render Rubberband Wire being drawn */}
          {pendingWire && (
            <path
              d={`M ${pendingWire.startX} ${pendingWire.startY} L ${pendingWire.currentX} ${pendingWire.currentY}`}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />
          )}
        </svg>

        {/* Render Circuit Components */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0'
          }}
        >
          {components.map(comp => (
            <div key={comp.id} className="pointer-events-auto">
              {renderComponentVisual(comp)}
            </div>
          ))}
        </div>

        {/* Empty Canvas Guidance Banner */}
        {components.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-6">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3 shadow-lg shadow-cyan-500/10">
              <Sparkles className="w-7 h-7 animate-pulse" />
            </div>
            <h3 className="text-base font-semibold text-gray-200 font-['Space_Grotesk']">
              Simulation Canvas Ready
            </h3>
            <p className="text-xs text-gray-400 max-w-sm mt-1">
              Drag components from the left sidebar or select an <span className="text-cyan-300 font-medium">Example Simulation</span> from the top bar to begin.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
