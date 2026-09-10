import React from 'react';
import { Cpu, BookOpen, ChevronRight, Zap } from 'lucide-react';

export default function LandingPage({ onSelectWorkspace }) {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#030511] text-gray-100 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-purple-600/10 rounded-full blur-[150px]" />
      </div>

      <div className="z-10 text-center mb-16 space-y-4">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Zap className="w-10 h-10 text-cyan-400" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-['Space_Grotesk']">
            QUANTUM <span className="text-cyan-400">REALM</span>
          </h1>
        </div>
        <p className="text-lg md:text-xl text-gray-400 font-light max-w-lg mx-auto">
          Explore quantum computing interactively.
        </p>
      </div>

      <div className="z-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-6">
        
        {/* Simulation Card */}
        <button
          onClick={() => onSelectWorkspace('simulation')}
          className="group relative flex flex-col items-center p-12 rounded-3xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 overflow-hidden text-left text-white"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/10 group-hover:to-transparent transition-all duration-500" />
          <Cpu className="w-16 h-16 text-cyan-400 mb-6 group-hover:scale-110 transition-transform duration-500" />
          <h2 className="text-2xl font-semibold mb-3 font-['Space_Grotesk']">SIMULATION</h2>
          <p className="text-gray-400 text-center mb-8">
            Build circuits, visualize states, and explore quantum algorithms in the lab.
          </p>
          <div className="flex items-center text-cyan-400 text-sm font-medium tracking-wider uppercase mt-auto">
            Enter Workspace <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Learning Space Card */}
        <button
          onClick={() => onSelectWorkspace('learning')}
          className="group relative flex flex-col items-center p-12 rounded-3xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 overflow-hidden text-left text-white"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:to-transparent transition-all duration-500" />
          <BookOpen className="w-16 h-16 text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-500" />
          <h2 className="text-2xl font-semibold mb-3 font-['Space_Grotesk']">LEARNING SPACE</h2>
          <p className="text-gray-400 text-center mb-8">
            Master quantum concepts through interactive lessons and challenges.
          </p>
          <div className="flex items-center text-purple-400 text-sm font-medium tracking-wider uppercase mt-auto">
            Enter Workspace <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

      </div>
    </div>
  );
}
