import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/layout/Sidebar';
import SimulationWorkspace from './components/simulation/SimulationWorkspace';
import LearningWorkspace from './components/learning/LearningWorkspace';
import StudentDashboard from './components/dashboard/StudentDashboard';
import LandingPage from './components/home/LandingPage';

export default function App() {
  // Global Application State
  const [activeWorkspace, setActiveWorkspace] = useState('home'); // 'home' | 'simulation' | 'learning'
  const [simulationTool, setSimulationTool] = useState('circuit'); 
  const [learningTool, setLearningTool] = useState('learn');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  // Cross-workspace context (e.g., from game to simulation)
  const [injectedLabConcept, setInjectedLabConcept] = useState(null);

  // Helper to jump to a simulation tool with a specific concept
  const handleJumpToSimulation = (tool, concept) => {
    if (concept) setInjectedLabConcept(concept);
    setSimulationTool(tool);
    setActiveWorkspace('simulation');
  };

  // 1. Home / Landing Page
  if (activeWorkspace === 'home') {
    return (
      <LandingPage onSelectWorkspace={setActiveWorkspace} />
    );
  }

  // 2. Main Workspaces (Simulation / Learning)
  return (
    <div className="h-screen bg-[#030511] text-gray-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black overflow-hidden">
      
      {/* Top Header Navigation */}
      <Navbar
        activeWorkspace={activeWorkspace}
        setActiveWorkspace={setActiveWorkspace}
        onOpenDashboard={() => setIsDashboardOpen(true)}
      />

      {/* Main Desktop Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Context-Aware Sidebar */}
        {activeWorkspace !== 'simulation' && (
          <Sidebar
            activeWorkspace={activeWorkspace}
            activeTool={activeWorkspace === 'simulation' ? simulationTool : learningTool}
            setActiveTool={activeWorkspace === 'simulation' ? setSimulationTool : setLearningTool}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
          />
        )}

        {/* Primary Workspace View */}
        <main className="flex-1 relative overflow-hidden">
          {activeWorkspace === 'simulation' && (
            <SimulationWorkspace
              activeTool={simulationTool}
              setActiveTool={setSimulationTool}
              initialConcept={injectedLabConcept}
              onCircuitUpdate={() => {}}
            />
          )}

          {activeWorkspace === 'learning' && (
            <LearningWorkspace
              activeTool={learningTool}
              setActiveTool={setLearningTool}
              setActiveWorkspace={setActiveWorkspace}
              setSimulationTool={handleJumpToSimulation}
            />
          )}
        </main>
      </div>

      {/* Overlays */}
      <StudentDashboard
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
      />

    </div>
  );
}
