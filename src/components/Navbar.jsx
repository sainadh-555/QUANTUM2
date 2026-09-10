import React from 'react';
import { Atom, UserCircle } from 'lucide-react';

export default function Navbar({
  activeWorkspace,
  setActiveWorkspace,
  onOpenDashboard
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#060814]/90 backdrop-blur-md text-gray-100 select-none">
      <div className="max-w-[1780px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        
        {/* LEFT: Project Logo & Branding */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#070a19] rounded-[10px] flex items-center justify-center">
              <Atom className="w-6 h-6 text-cyan-400 animate-spin" style={{ animationDuration: '14s' }} />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-base sm:text-lg tracking-wider bg-gradient-to-r from-cyan-400 via-blue-300 to-purple-400 bg-clip-text text-transparent uppercase font-['Space_Grotesk']">
                QUANTUM REALM
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
              <span>NEURAL NOMADS</span>
            </p>
          </div>
        </div>

        {/* CENTER: Primary Navigation Controls */}
        <nav className="flex items-center space-x-2 bg-white/[0.03] p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveWorkspace('simulation')}
            className={`px-6 py-2 rounded-xl text-sm font-semibold tracking-widest font-['Space_Grotesk'] transition-all ${
              activeWorkspace === 'simulation'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            SIMULATION
          </button>
          
          <button
            onClick={() => setActiveWorkspace('learning')}
            className={`px-6 py-2 rounded-xl text-sm font-semibold tracking-widest font-['Space_Grotesk'] transition-all ${
              activeWorkspace === 'learning'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            LEARNING
          </button>
        </nav>

        {/* RIGHT: Profile/Dashboard Icon */}
        <div className="flex items-center shrink-0">
          <button
            onClick={onOpenDashboard}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-300 hover:text-cyan-400"
            title="Open Student Dashboard"
          >
            <UserCircle className="w-7 h-7" />
          </button>
        </div>

      </div>
    </header>
  );
}
