import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  BookOpen,
  FlaskConical,
  ArrowRight,
  Zap,
  Trophy,
  Flame,
  CheckCircle2,
  Lock,
  ChevronRight,
  Bot,
  Atom,
  Binary,
  Compass
} from 'lucide-react';
import { ProgressService, LEVEL_DEFINITIONS, BADGE_DEFINITIONS } from '../../services/ProgressService';

export default function HomePage({ onNavigate, onLaunchDemo }) {
  const [studentProgress, setStudentProgress] = useState(ProgressService.getState());

  useEffect(() => {
    const unsub = ProgressService.subscribe(setStudentProgress);
    return () => unsub();
  }, []);

  const levelInfo = ProgressService.getLevelInfo();

  // Quantum Journey Timeline Stages
  const journeyStages = [
    { id: 'qubit', name: 'Qubits', levelRequired: 1, categoryKey: 'qubits' },
    { id: 'superposition', name: 'Superposition', levelRequired: 2, categoryKey: 'superposition' },
    { id: 'gates', name: 'Quantum Gates', levelRequired: 3, categoryKey: 'gates' },
    { id: 'entanglement', name: 'Entanglement', levelRequired: 4, categoryKey: 'entanglement' },
    { id: 'algorithms', name: 'Quantum Algorithms', levelRequired: 5, categoryKey: 'algorithms' },
    { id: 'master', name: 'Quantum Master', levelRequired: 6, categoryKey: 'master' }
  ];

  return (
    <div className="flex-1 w-full bg-[#030511] text-gray-100 flex flex-col items-center justify-start overflow-y-auto select-none">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[850px] h-[360px] bg-gradient-to-tr from-cyan-600/15 via-purple-600/15 to-blue-600/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Hero Section */}
      <section className="relative max-w-5xl mx-auto px-4 pt-12 pb-8 text-center flex flex-col items-center z-10">
        
        {/* Hackathon Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-5 shadow-sm shadow-cyan-500/10">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Smart India Hackathon 2026 &bull; Team Neural Nomads</span>
        </div>

        {/* Hero Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight font-['Space_Grotesk'] text-white max-w-4xl leading-tight">
          Learn Quantum Computing by{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Playing, Building &amp; Exploring.
          </span>
        </h1>

        {/* Subheading */}
        <p className="mt-4 text-sm sm:text-base text-gray-300 max-w-2xl font-sans leading-relaxed">
          Turn abstract quantum concepts into interactive experiences. From qubits to entanglement, understand the quantum frontier through gamified play and live circuit simulations.
        </p>

        {/* CTAs: Primary [Start Learning] | Secondary [Play Quantum Rush] */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('learn')}
            className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold text-sm uppercase tracking-wider font-['Space_Grotesk'] flex items-center space-x-2 shadow-xl shadow-cyan-500/25 transition-all active:scale-95"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('rush')}
            className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-purple-200 border border-purple-500/40 font-bold text-sm uppercase tracking-wider font-['Space_Grotesk'] flex items-center space-x-2 transition-all shadow-md active:scale-95"
          >
            <Play className="w-4 h-4 text-purple-400 fill-purple-400" />
            <span>Play Quantum Rush</span>
          </button>
        </div>

      </section>

      {/* THREE MAJOR EXPERIENCE CARDS: LEARN | PLAY | BUILD */}
      <section className="w-full max-w-5xl mx-auto px-4 py-6 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* 1. LEARN */}
          <div
            onClick={() => onNavigate('learn')}
            className="p-6 rounded-3xl bg-gradient-to-br from-[#080d28] to-[#0c163d] border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 cursor-pointer shadow-xl shadow-cyan-500/5 hover:-translate-y-1 group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
                  CURRICULUM
                </span>
              </div>
              <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                1. LEARN
                <ArrowRight className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="mt-2 text-xs text-gray-300 font-sans leading-relaxed">
                Understand quantum concepts: qubits, superposition, phase angles, Born's rule, and Bell states with bite-sized pedagogical modules.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-white/5 text-[11px] font-mono text-cyan-400 flex items-center justify-between">
              <span>12 Concepts</span>
              <span>Explore &rarr;</span>
            </div>
          </div>

          {/* 2. PLAY */}
          <div
            onClick={() => onNavigate('rush')}
            className="p-6 rounded-3xl bg-gradient-to-br from-[#130b2e] to-[#21114b] border border-purple-500/30 hover:border-purple-400 transition-all duration-300 cursor-pointer shadow-xl shadow-purple-500/5 hover:-translate-y-1 group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-purple-400" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold">
                  GAMIFICATION
                </span>
              </div>
              <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] group-hover:text-purple-300 transition-colors flex items-center gap-1.5">
                2. PLAY
                <ArrowRight className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="mt-2 text-xs text-gray-300 font-sans leading-relaxed">
                Learn through Quantum Rush! Run through the 3-lane quantum neon city, collect quantum tokens, solve pause challenges, and earn XP.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-white/5 text-[11px] font-mono text-purple-400 flex items-center justify-between">
              <span>3 Worlds Active</span>
              <span>Play Now &rarr;</span>
            </div>
          </div>

          {/* 3. BUILD */}
          <div
            onClick={() => onNavigate('lab')}
            className="p-6 rounded-3xl bg-gradient-to-br from-[#061821] to-[#0a2736] border border-teal-500/30 hover:border-teal-400 transition-all duration-300 cursor-pointer shadow-xl shadow-teal-500/5 hover:-translate-y-1 group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                  <FlaskConical className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 font-bold">
                  SIMULATION
                </span>
              </div>
              <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] group-hover:text-teal-300 transition-colors flex items-center gap-1.5">
                3. BUILD
                <ArrowRight className="w-4 h-4 text-teal-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="mt-2 text-xs text-gray-300 font-sans leading-relaxed">
                Experiment inside Quantum Lab. Compose visual quantum circuits, sync bi-directional Qiskit Python code, and observe 3D Bloch sphere projections.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-white/5 text-[11px] font-mono text-teal-400 flex items-center justify-between">
              <span>Qiskit Aer Engine</span>
              <span>Simulate &rarr;</span>
            </div>
          </div>

        </div>
      </section>

      {/* YOUR QUANTUM JOURNEY PROGRESS TIMELINE */}
      <section className="w-full max-w-5xl mx-auto px-4 py-8 z-10">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#070a1e] border border-white/10 shadow-2xl">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
            <div>
              <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
                Your Quantum Journey
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                Student Progression &bull; Level {levelInfo.level}: {levelInfo.title}
              </p>
            </div>

            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="text-gray-400">XP: <strong className="text-cyan-300">{studentProgress.xp}</strong> / {levelInfo.maxXp}</span>
              <div className="w-28 bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Timeline Nodes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {journeyStages.map((stage, idx) => {
              const isUnlocked = levelInfo.level >= stage.levelRequired;
              const masteryScore = studentProgress.conceptMastery[stage.categoryKey] || 0;

              return (
                <div
                  key={stage.id}
                  className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all ${
                    isUnlocked
                      ? 'bg-white/[0.03] border-cyan-500/30 hover:border-cyan-400'
                      : 'bg-black/40 border-white/5 opacity-50'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-gray-400">
                        STAGE 0{idx + 1}
                      </span>
                      {isUnlocked ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Lock className="w-3 h-3 text-gray-500" />
                      )}
                    </div>

                    <div className="font-bold text-xs text-white font-['Space_Grotesk']">
                      {stage.name}
                    </div>
                  </div>

                  {isUnlocked && stage.categoryKey !== 'master' && (
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-[9px] font-mono text-gray-400">
                        <span>Mastery</span>
                        <span className="text-cyan-300">{masteryScore}%</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                        <div
                          className="h-full bg-cyan-400"
                          style={{ width: `${masteryScore}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Badges Bar */}
          <div className="mt-6 pt-5 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono text-gray-300 font-bold uppercase">
                Badges Earned ({studentProgress.badges.length}):
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {BADGE_DEFINITIONS.map(badge => {
                const earned = studentProgress.badges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl border text-xs font-mono ${
                      earned
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                        : 'bg-white/[0.01] border-white/5 text-gray-600'
                    }`}
                    title={badge.description}
                  >
                    <span>{badge.icon}</span>
                    <span className="text-[11px]">{badge.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
