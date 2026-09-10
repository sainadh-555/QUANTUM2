import React from 'react';
import {
  CircuitBoard,
  Cpu,
  Binary,
  Code2,
  BarChart3,
  Eye,
  Bot,
  BookOpen,
  Play,
  Box,
  Library,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({
  activeWorkspace,
  activeTool,
  setActiveTool,
  isCollapsed,
  setIsCollapsed
}) {
  const simulationTools = [
    { id: 'circuit', label: 'Circuit Builder', icon: CircuitBoard },
    { id: 'algorithms', label: 'Algorithms', icon: Binary }
  ];

  const learningTools = [
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'rush', label: 'Quantum Rush', icon: Play, isHighlight: true },
    { id: 'algorithms', label: 'Algorithms', icon: Binary },
    { id: '3d', label: '3D Learning', icon: Box },
    { id: 'library', label: 'E-Library', icon: Library },
    { id: 'qumi', label: 'Qumi Tutor', icon: Bot, isAi: true }
  ];

  const currentTools = activeWorkspace === 'simulation' ? simulationTools : learningTools;

  return (
    <aside
      className={`h-full flex flex-col bg-[#050711] border-r border-white/10 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex-1 py-6 flex flex-col gap-2 px-2 overflow-y-auto hide-scrollbar">
        {currentTools.map(tool => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              title={isCollapsed ? tool.label : undefined}
              className={`flex items-center p-3 rounded-xl transition-all group ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                  : tool.isAi
                  ? 'text-purple-300 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
              } ${isCollapsed ? 'justify-center' : 'justify-start space-x-3'}`}
            >
              <Icon className={`shrink-0 ${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'}`} />
              {!isCollapsed && (
                <span className="font-semibold text-sm tracking-wide font-['Space_Grotesk'] whitespace-nowrap">
                  {tool.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Collapse/Expand Toggle */}
      <div className="p-2 border-t border-white/10">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-3 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          {!isCollapsed && <span className="ml-2 text-sm font-semibold">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
