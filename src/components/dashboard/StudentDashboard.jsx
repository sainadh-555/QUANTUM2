import React, { useState, useEffect } from 'react';
import {
  X,
  Zap,
  Trophy,
  CheckCircle2,
  Lock,
  Award,
  Flame,
  Bot
} from 'lucide-react';
import { ProgressService, BADGE_DEFINITIONS } from '../../services/ProgressService';

export default function StudentDashboard({ isOpen, onClose }) {
  const [studentProgress, setStudentProgress] = useState(ProgressService.getState());

  useEffect(() => {
    const unsub = ProgressService.subscribe(setStudentProgress);
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  const levelInfo = ProgressService.getLevelInfo();

  const journeyStages = [
    { id: 'qubit', name: 'Qubits', levelRequired: 1, categoryKey: 'qubits' },
    { id: 'superposition', name: 'Superposition', levelRequired: 2, categoryKey: 'superposition' },
    { id: 'gates', name: 'Quantum Gates', levelRequired: 3, categoryKey: 'gates' },
    { id: 'entanglement', name: 'Entanglement', levelRequired: 4, categoryKey: 'entanglement' },
    { id: 'algorithms', name: 'Quantum Algorithms', levelRequired: 5, categoryKey: 'algorithms' },
    { id: 'master', name: 'Quantum Master', levelRequired: 6, categoryKey: 'master' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#070a1e] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#070a1e]/90 backdrop-blur z-10">
          <div>
            <h2 className="text-2xl font-black tracking-tight font-['Space_Grotesk'] text-white">
              YOUR QUANTUM JOURNEY
            </h2>
            <p className="text-xs text-gray-400 font-mono mt-1">
              Student Progression Dashboard
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 flex flex-col gap-8">
          
          {/* Top Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs">
                <Award className="w-4 h-4" /> LEVEL
              </div>
              <div className="text-3xl font-black text-cyan-300 font-['Space_Grotesk']">{levelInfo.level}</div>
              <div className="text-xs text-gray-400">{levelInfo.title}</div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-purple-400 font-mono text-xs">
                <Zap className="w-4 h-4" /> XP
              </div>
              <div className="text-3xl font-black text-purple-300 font-['Space_Grotesk']">{studentProgress.xp}</div>
              <div className="text-xs text-gray-400">Next level at {levelInfo.maxXp} XP</div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs">
                <Flame className="w-4 h-4" /> STREAK
              </div>
              <div className="text-3xl font-black text-amber-300 font-['Space_Grotesk']">{studentProgress.streak || 0}</div>
              <div className="text-xs text-gray-400">Days active</div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs">
                <Bot className="w-4 h-4" /> QUMI SAYS
              </div>
              <div className="text-sm font-medium text-emerald-300 leading-tight">
                "Keep practicing Quantum Gates to master superposition!"
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono text-gray-400">
              <span>Level Progress</span>
              <span>{levelInfo.progressPercent.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-1000"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Mastery Stages */}
          <div>
            <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] mb-4">Concept Mastery</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {journeyStages.map((stage, idx) => {
                const isUnlocked = levelInfo.level >= stage.levelRequired;
                const masteryScore = studentProgress.conceptMastery[stage.categoryKey] || 0;

                return (
                  <div
                    key={stage.id}
                    className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                      isUnlocked
                        ? 'bg-white/[0.03] border-cyan-500/30'
                        : 'bg-black/40 border-white/5 opacity-50'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-gray-400">
                          STAGE 0{idx + 1}
                        </span>
                        {isUnlocked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Lock className="w-4 h-4 text-gray-500" />
                        )}
                      </div>

                      <div className="font-bold text-sm text-white font-['Space_Grotesk']">
                        {stage.name}
                      </div>
                    </div>

                    {isUnlocked && stage.categoryKey !== 'master' && (
                      <div className="mt-4 space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-gray-400">
                          <span>Mastery</span>
                          <span className="text-cyan-300">{masteryScore}%</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
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
          </div>

          {/* Badges */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">Earned Badges</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {BADGE_DEFINITIONS.map(badge => {
                const earned = studentProgress.badges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border w-24 text-center transition-all ${
                      earned
                        ? 'bg-amber-500/10 border-amber-500/30 shadow-lg shadow-amber-500/5'
                        : 'bg-white/[0.01] border-white/5 opacity-50 grayscale'
                    }`}
                    title={badge.description}
                  >
                    <div className="text-2xl">{badge.icon}</div>
                    <span className="text-[10px] font-bold text-gray-300 font-['Space_Grotesk'] leading-tight">
                      {badge.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
