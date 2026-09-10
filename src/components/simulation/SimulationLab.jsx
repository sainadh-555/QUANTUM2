import React, { useState, useEffect } from 'react';
import ComponentLibrary from './ComponentLibrary';
import SimulationCanvas from './SimulationCanvas';
import ComponentProperties from './ComponentProperties';
import CodeEditorPanel from './CodeEditorPanel';
import SimulationOutput from './SimulationOutput';
import AITutorDrawer from '../ai/AITutorDrawer';

import { EXAMPLE_SIMULATIONS } from '../../data/exampleSimulations';
import { COMPONENT_DEFINITIONS } from '../../data/simulationComponents';
import { CodeGenerator } from '../../services/CodeGenerator';
import { SimulationEngine } from '../../services/SimulationEngine';
import { SimulationService } from '../../services/SimulationService';

import {
  ArrowLeft,
  Play,
  Square,
  Sparkles,
  Save,
  RotateCcw,
  Layers,
  Code,
  Terminal,
  ChevronDown,
  Check,
  CheckCircle2,
  Bookmark
} from 'lucide-react';

export default function SimulationLab({ onNavigateHome, onOpenAITutorGlobal }) {
  // Active Simulation State
  const [simulationName, setSimulationName] = useState('LED Blink Circuit');
  const [simulationState, setSimulationState] = useState({
    components: EXAMPLE_SIMULATIONS[0].components,
    connections: EXAMPLE_SIMULATIONS[0].connections
  });

  // History stack for Undo / Redo
  const [history, setHistory] = useState([
    {
      components: EXAMPLE_SIMULATIONS[0].components,
      connections: EXAMPLE_SIMULATIONS[0].connections
    }
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Selection & UI controls
  const [selectedCompId, setSelectedCompId] = useState(null);
  const [language, setLanguage] = useState('arduino');
  const [isRunning, setIsRunning] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Mobile / Tablet Tab Switcher
  const [mobileTab, setMobileTab] = useState('canvas'); // 'components' | 'canvas' | 'code' | 'output'

  // Generated Code derivation
  const [generatedCode, setGeneratedCode] = useState('');

  // Re-generate code and re-evaluate simulation whenever components, connections, or language change
  useEffect(() => {
    const code = CodeGenerator.generate(simulationState, language);
    setGeneratedCode(code);

    if (isRunning) {
      const res = SimulationEngine.evaluate(simulationState);
      setSimulationResult(res);
    }
  }, [simulationState, language, isRunning]);

  // Show Toast notification helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // State update wrapper with optional undo/redo history push
  const handleUpdateState = (newState, pushHistory = true) => {
    if (pushHistory) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newState);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
    setSimulationState(newState);
  };

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      setSimulationState(history[prevIdx]);
      setSelectedCompId(null);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setSimulationState(history[nextIdx]);
      setSelectedCompId(null);
    }
  };

  // Add component directly (from library click or drag)
  const handleAddComponent = (compType) => {
    const def = COMPONENT_DEFINITIONS[compType];
    if (!def) return;

    // Smart positioning offset
    const offset = (simulationState.components.length * 30) % 150;
    const newComp = {
      id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: compType,
      x: 180 + offset,
      y: 120 + offset,
      properties: { ...def.defaultProps }
    };

    handleUpdateState({
      ...simulationState,
      components: [...simulationState.components, newComp]
    });
    setSelectedCompId(newComp.id);
    showToast(`Added ${def.shortName} to canvas`);
  };

  // Delete selected component and its attached wires
  const handleDeleteSelected = () => {
    if (!selectedCompId) return;

    const remainingComps = simulationState.components.filter(c => c.id !== selectedCompId);
    const remainingWires = simulationState.connections.filter(
      c => c.sourceComponent !== selectedCompId && c.targetComponent !== selectedCompId
    );

    handleUpdateState({
      components: remainingComps,
      connections: remainingWires
    });
    setSelectedCompId(null);
    showToast('Component removed');
  };

  // Update component properties (resistor value, LED color, etc.)
  const handleUpdateProperties = (compId, newProps) => {
    const updated = simulationState.components.map(c => {
      if (c.id === compId) {
        return { ...c, properties: newProps };
      }
      return c;
    });

    handleUpdateState({
      ...simulationState,
      components: updated
    });
  };

  // Toggle switch closed/open state
  const handleToggleSwitch = (switchId) => {
    const updated = simulationState.components.map(c => {
      if (c.id === switchId) {
        const closed = c.properties?.closed !== false;
        return {
          ...c,
          properties: { ...c.properties, closed: !closed }
        };
      }
      return c;
    });

    handleUpdateState({
      ...simulationState,
      components: updated
    }, false);
  };

  // Run Simulation
  const handleToggleRun = () => {
    if (isRunning) {
      setIsRunning(false);
      showToast('Simulation Stopped');
    } else {
      const evaluation = SimulationEngine.evaluate(simulationState);
      setSimulationResult(evaluation);
      setIsRunning(true);
      showToast(evaluation.isValid ? 'Simulation Running Live' : 'Simulation Started with Warnings');
    }
  };

  // Load Example Preset
  const handleLoadExample = (example) => {
    setSimulationName(example.name);
    const newState = {
      components: JSON.parse(JSON.stringify(example.components)),
      connections: JSON.parse(JSON.stringify(example.connections))
    };
    handleUpdateState(newState);
    setSelectedCompId(null);
    setIsRunning(false);
    setSimulationResult(null);
    setIsPresetsOpen(false);
    showToast(`Loaded "${example.name}"`);
  };

  // SIH "Try Demo" One-Click Launcher
  const handleTryDemo = () => {
    handleLoadExample(EXAMPLE_SIMULATIONS[0]);
    setTimeout(() => {
      setIsRunning(true);
      const res = SimulationEngine.evaluate({
        components: EXAMPLE_SIMULATIONS[0].components,
        connections: EXAMPLE_SIMULATIONS[0].connections
      });
      setSimulationResult(res);
      showToast('🚀 SIH Demo Loaded & Running!');
    }, 150);
  };

  // Reset Simulation (reloads current active preset)
  const handleResetSimulation = () => {
    const matchingPreset = EXAMPLE_SIMULATIONS.find(e => e.name === simulationName) || EXAMPLE_SIMULATIONS[0];
    handleLoadExample(matchingPreset);
    showToast('Simulation Reset to Original State');
  };

  // Clear Canvas
  const handleClearCanvas = () => {
    if (window.confirm('Clear all components from the simulation canvas?')) {
      handleUpdateState({ components: [], connections: [] });
      setSelectedCompId(null);
      setIsRunning(false);
      setSimulationResult(null);
      showToast('Canvas Cleared');
    }
  };

  // Save Simulation
  const handleSaveSimulation = async () => {
    await SimulationService.saveSimulation({
      name: simulationName,
      components: simulationState.components,
      connections: simulationState.connections,
      language
    });
    showToast('✓ Simulation saved to local storage');
  };

  const selectedComp = simulationState.components.find(c => c.id === selectedCompId);

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden bg-[#040612] text-gray-100 select-none">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-medium backdrop-blur-md shadow-xl animate-in fade-in duration-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP BAR */}
      <header className="h-14 px-4 border-b border-white/10 bg-[#070b1f] flex items-center justify-between gap-2 z-30">
        
        {/* Left: Back/Home & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 transition-all flex items-center gap-1 text-xs"
            title="Back to Home"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-wider bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent uppercase font-['Space_Grotesk']">
              Simulation Lab
            </span>
            <span className="hidden md:inline text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
              ● Ready
            </span>
          </div>
        </div>

        {/* Center: Current Simulation Name & Example Selector */}
        <div className="relative">
          <button
            onClick={() => setIsPresetsOpen(!isPresetsOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-200 transition-all"
          >
            <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
            <span className="max-w-[140px] sm:max-w-none truncate">{simulationName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {/* Example Simulations Dropdown */}
          {isPresetsOpen && (
            <div className="absolute top-11 left-1/2 -translate-x-1/2 z-50 w-72 bg-[#090e29] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden py-1 backdrop-blur-xl animate-in fade-in duration-150">
              <div className="px-3 py-1.5 text-[10px] font-mono text-gray-400 border-b border-white/5">
                LOAD EXAMPLE SIMULATION
              </div>
              <div className="max-h-60 overflow-y-auto">
                {EXAMPLE_SIMULATIONS.map(ex => (
                  <button
                    key={ex.id}
                    onClick={() => handleLoadExample(ex)}
                    className="w-full px-3 py-2 text-left hover:bg-cyan-500/10 flex items-center justify-between transition-colors border-b border-white/[0.03]"
                  >
                    <div>
                      <div className="text-xs font-medium text-gray-200">{ex.name}</div>
                      <div className="text-[10px] text-gray-400">{ex.category}</div>
                    </div>
                    {simulationName === ex.name && (
                      <Check className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Actions (Try Demo, Save, Reset, Run, AI Tutor) */}
        <div className="flex items-center gap-2">
          
          {/* SIH Quick Launcher: Try Demo */}
          <button
            onClick={handleTryDemo}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold shadow-sm transition-all"
            title="Instant Demo for SIH Judges"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Try Demo</span>
          </button>

          {/* Save Button */}
          <button
            onClick={handleSaveSimulation}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 transition-all text-xs"
            title="Save Simulation"
          >
            <Save className="w-3.5 h-3.5" />
          </button>

          {/* Reset Simulation */}
          <button
            onClick={handleResetSimulation}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 transition-all text-xs"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Prominent Run Simulation Button */}
          <button
            onClick={handleToggleRun}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all shadow-lg ${
              isRunning
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30 animate-pulse'
                : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black shadow-cyan-500/30'
            }`}
          >
            {isRunning ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Simulation</span>
              </>
            )}
          </button>

          {/* ✨ AI Tutor Button */}
          <button
            onClick={() => setIsAITutorOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-purple-300 border border-purple-500/40 text-xs font-semibold shadow-sm transition-all"
            title="Open AI Tutor"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden md:inline">AI Tutor</span>
          </button>

        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex border-b border-white/10 bg-[#070b1f] px-2 py-1.5 gap-1 overflow-x-auto">
        <button
          onClick={() => setMobileTab('canvas')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 ${
            mobileTab === 'canvas' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-gray-400'
          }`}
        >
          <Play className="w-3 h-3" />
          <span>Canvas</span>
        </button>
        <button
          onClick={() => setMobileTab('components')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 ${
            mobileTab === 'components' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-gray-400'
          }`}
        >
          <Layers className="w-3 h-3" />
          <span>Components</span>
        </button>
        <button
          onClick={() => setMobileTab('code')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 ${
            mobileTab === 'code' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-gray-400'
          }`}
        >
          <Code className="w-3 h-3" />
          <span>Code</span>
        </button>
        <button
          onClick={() => setMobileTab('output')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 ${
            mobileTab === 'output' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-gray-400'
          }`}
        >
          <Terminal className="w-3 h-3" />
          <span>Output</span>
        </button>
      </div>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        
        {/* Top/Middle Split: Left Sidebar + Canvas + Code Editor */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* LEFT SIDEBAR: Component Library */}
          <div className={`${mobileTab === 'components' ? 'block' : 'hidden'} lg:block h-full z-20`}>
            <ComponentLibrary onAddComponent={handleAddComponent} />
          </div>

          {/* CENTER CANVAS */}
          <div className={`${mobileTab === 'canvas' ? 'flex' : 'hidden'} lg:flex flex-1 flex-col h-full relative overflow-hidden`}>
            <SimulationCanvas
              simulationState={simulationState}
              onUpdateState={handleUpdateState}
              selectedCompId={selectedCompId}
              onSelectComponent={setSelectedCompId}
              onDeleteSelected={handleDeleteSelected}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < history.length - 1}
              onClearCanvas={handleClearCanvas}
              isRunning={isRunning}
              simulationResult={simulationResult}
              onToggleSwitch={handleToggleSwitch}
            />

            {/* Component Properties Inspector (Shows when component selected) */}
            {selectedComp && (
              <ComponentProperties
                component={selectedComp}
                onUpdateProperties={handleUpdateProperties}
                onDeleteComponent={handleDeleteSelected}
                onClose={() => setSelectedCompId(null)}
              />
            )}
          </div>

          {/* RIGHT CODE PANEL: Generated Code */}
          <div className={`${mobileTab === 'code' ? 'block' : 'hidden'} lg:block h-full z-20`}>
            <CodeEditorPanel
              code={generatedCode}
              language={language}
              onChangeLanguage={setLanguage}
              onResetCode={() => setGeneratedCode(CodeGenerator.generate(simulationState, language))}
            />
          </div>

        </div>

        {/* BOTTOM SIMULATION OUTPUT PANEL */}
        <div className={`${mobileTab === 'output' ? 'block' : 'hidden'} lg:block z-20`}>
          <SimulationOutput
            result={simulationResult}
            isRunning={isRunning}
            components={simulationState.components}
          />
        </div>

      </div>

      {/* Context-Aware AI Tutor Drawer */}
      <AITutorDrawer
        isOpen={isAITutorOpen}
        onClose={() => setIsAITutorOpen(false)}
        simulationState={simulationState}
        generatedCode={generatedCode}
        language={language}
      />

    </div>
  );
}
