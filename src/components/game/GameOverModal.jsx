import React from 'react';
import {
  Trophy,
  Zap,
  Target,
  Flame,
  RotateCcw,
  BookOpen,
  FlaskConical,
  Bot,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { ProgressService } from '../../services/ProgressService';

export default function GameOverModal({
  stats,
  onPlayAgain,
  onExploreInLab,
  onLearnHub
}) {
  const {
    score = 0,
    xpEarned = 0,
    qubitsCollected = 0,
    questionsAnswered = 0,
    correctAnswers = 0,
    bestStreak = 0
  } = stats;

  const accuracy = questionsAnswered > 0
    ? Math.round((correctAnswers / questionsAnswered) * 100)
    : 100;

  const recommendation = ProgressService.getSmartRecommendation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#080b1e] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-500/20 overflow-hidden flex flex-col">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-gradient-to-b from-cyan-500/25 to-transparent blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-6 z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/30 mb-3">
            <div className="w-full h-full bg-[#070a1a] rounded-[14px] flex items-center justify-center text-cyan-400">
              <Trophy className="w-7 h-7" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wider uppercase font-['Space_Grotesk']">
            Run Complete
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Quantum Rush &bull; Session Telemetry
          </p>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 z-10">
          
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
            <div className="text-[10px] font-mono text-gray-400 uppercase">Score</div>
            <div className="text-lg sm:text-xl font-bold text-white font-mono mt-1">
              {score.toLocaleString()}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center">
            <div className="text-[10px] font-mono text-cyan-300 uppercase flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>XP Earned</span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-cyan-300 font-mono mt-1">
              +{xpEarned}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
            <div className="text-[10px] font-mono text-gray-400 uppercase flex items-center justify-center gap-1">
              <Target className="w-3 h-3 text-emerald-400" />
              <span>Accuracy</span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-emerald-300 font-mono mt-1">
              {accuracy}%
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center">
            <div className="text-[10px] font-mono text-amber-300 uppercase flex items-center justify-center gap-1">
              <Flame className="w-3 h-3 text-orange-400" />
              <span>Best Streak</span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-amber-300 font-mono mt-1">
              {bestStreak}
            </div>
          </div>

        </div>

        {/* Detailed Breakdown */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 mb-6 space-y-2 z-10 text-xs font-mono">
          <div className="flex justify-between items-center text-gray-300">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              Quantum Tokens Collected:
            </span>
            <strong className="text-white">{qubitsCollected} tokens</strong>
          </div>
          <div className="flex justify-between items-center text-gray-300">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Questions Solved:
            </span>
            <strong className="text-white">{correctAnswers} / {questionsAnswered} correct</strong>
          </div>
        </div>

        {/* Qumi's Smart Pedagogical Recommendation */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-blue-950/40 border border-cyan-500/30 mb-6 z-10">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0 text-cyan-400">
              <Bot className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="font-bold text-xs text-cyan-300 font-['Space_Grotesk'] uppercase tracking-wider flex items-center gap-1.5">
                <span>Qumi's Recommendation</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-200">
                  Adaptive
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                {recommendation.text}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 z-10">
          
          <button
            onClick={onPlayAgain}
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold text-xs uppercase font-['Space_Grotesk'] tracking-wider flex items-center justify-center space-x-1.5 shadow-lg shadow-cyan-500/25 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>

          <button
            onClick={() => onExploreInLab(recommendation.target)}
            className="py-3 px-4 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-sm"
          >
            <FlaskConical className="w-4 h-4 text-purple-400" />
            <span>Quantum Lab</span>
          </button>

          <button
            onClick={onLearnHub}
            className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-gray-400" />
            <span>Learning Hub</span>
          </button>

        </div>

      </div>
    </div>
  );
}
