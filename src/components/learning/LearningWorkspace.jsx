import React from 'react';
import LearningHub from './LearningHub';
import QuantumRush from '../game/QuantumRush';
import QuantumAlgorithms from '../algorithms/QuantumAlgorithms';
import Learning3D from '../threeD/Learning3D';
import ELibrary from '../library/ELibrary';
import QumiWorkspace from '../ai/QumiWorkspace';

export default function LearningWorkspace({
  activeTool,
  setActiveTool,
  setActiveWorkspace,
  setSimulationTool
}) {
  const handlePlayConceptInRush = () => {
    setActiveTool('rush');
  };

  const handleExploreInLab = (conceptId) => {
    // We need to switch to Simulation workspace, open circuit tool, and pass concept.
    // The App component might need to handle this state transfer.
    // We'll pass an event up to the parent.
    setSimulationTool('circuit', conceptId);
    setActiveWorkspace('simulation');
  };

  return (
    <div className="flex-1 w-full h-full bg-[#030511] overflow-hidden">
      {activeTool === 'learn' && (
        <LearningHub
          onPlayConcept={handlePlayConceptInRush}
          onExploreInLab={handleExploreInLab}
        />
      )}

      {activeTool === 'rush' && (
        <div className="w-full h-full">
          <QuantumRush
            onExploreInLab={handleExploreInLab}
            onNavigateLearn={() => setActiveTool('learn')}
          />
        </div>
      )}

      {activeTool === 'algorithms' && (
        <QuantumAlgorithms
          onOpenInLab={handleExploreInLab}
        />
      )}

      {activeTool === '3d' && (
        <Learning3D
          onNavigateBack={() => setActiveTool('learn')}
        />
      )}

      {activeTool === 'library' && (
        <ELibrary />
      )}

      {activeTool === 'qumi' && (
        <div className="w-full h-full p-6">
          <QumiWorkspace 
            mode="tutor" 
            onCircuitAction={handleExploreInLab}
          />
        </div>
      )}
    </div>
  );
}
