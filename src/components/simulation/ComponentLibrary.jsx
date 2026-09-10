import React, { useState } from 'react';
import {
  COMPONENT_CATEGORIES,
  COMPONENT_DEFINITIONS
} from '../../data/simulationComponents';
import {
  Search,
  Plus,
  BatteryCharging,
  CornerDownRight,
  Activity,
  ToggleLeft,
  MousePointerClick,
  Sliders,
  SunMedium,
  RotateCw,
  Volume2,
  Hash,
  GitCommit,
  GitBranch,
  ChevronsRight,
  GitMerge,
  Play,
  Cpu,
  Sparkles,
  Thermometer,
  Layers
} from 'lucide-react';

const ICON_MAP = {
  BatteryCharging,
  CornerDownRight,
  Activity,
  ToggleLeft,
  MousePointerClick,
  Sliders,
  SunMedium,
  RotateCw,
  Volume2,
  Hash,
  GitCommit,
  GitBranch,
  ChevronsRight,
  GitMerge,
  Play,
  Cpu,
  Sparkles,
  Thermometer,
  Layers
};

export default function ComponentLibrary({ onAddComponent }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const componentList = Object.values(COMPONENT_DEFINITIONS);

  const filteredComponents = componentList.filter(comp => {
    const matchesCategory = selectedCategory === 'all' || comp.category === selectedCategory;
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          comp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          comp.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDragStart = (e, compType) => {
    e.dataTransfer.setData('text/plain', compType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <aside className="w-full lg:w-80 h-full flex flex-col bg-[#070a19]/90 border-r border-white/10 select-none text-gray-200">
      
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-cyan-300 font-['Space_Grotesk'] flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            COMPONENTS
          </h2>
          <p className="text-[11px] text-gray-400">Drag to canvas or click + to add</p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          {filteredComponents.length} items
        </span>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-white/5">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all font-sans"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="p-2 border-b border-white/5 flex gap-1 overflow-x-auto scrollbar-none">
        {COMPONENT_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-2.5 py-1 text-[11px] rounded-md whitespace-nowrap transition-all font-medium ${
              selectedCategory === cat.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Draggable Component Cards List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredComponents.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-xs">
            No components match your search.
          </div>
        ) : (
          filteredComponents.map(comp => {
            const IconComponent = ICON_MAP[comp.icon] || Cpu;
            return (
              <div
                key={comp.type}
                draggable
                onDragStart={(e) => handleDragStart(e, comp.type)}
                className="group relative p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-cyan-500/40 transition-all cursor-grab active:cursor-grabbing shadow-sm hover:shadow-cyan-500/10"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-100 group-hover:text-cyan-300 transition-colors">
                        {comp.shortName}
                      </h4>
                      <span className="text-[10px] text-gray-500 capitalize">
                        {comp.category}
                      </span>
                    </div>
                  </div>

                  {/* Accessible Add Button */}
                  <button
                    onClick={() => onAddComponent(comp.type)}
                    title="Add to canvas"
                    className="p-1 rounded-md bg-white/5 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-300 border border-white/5 hover:border-cyan-500/30 transition-all opacity-80 group-hover:opacity-100"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="mt-1.5 text-[11px] text-gray-400 line-clamp-2 leading-relaxed font-sans">
                  {comp.description}
                </p>
              </div>
            );
          })
        )}
      </div>

    </aside>
  );
}
