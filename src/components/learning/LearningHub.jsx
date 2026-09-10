import React, { useState } from 'react';
import { QUANTUM_CONCEPTS } from '../../data/quantumConcepts';
import { ProgressService } from '../../services/ProgressService';
import { QuestionService } from '../../services/QuestionService';
import {
  BookOpen,
  Sparkles,
  Zap,
  Clock,
  CheckCircle2,
  ArrowRight,
  Play,
  FlaskConical,
  HelpCircle,
  X,
  Bot
} from 'lucide-react';

export default function LearningHub({
  onPlayConcept,
  onExploreInLab,
  onOpenQumi
}) {
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [activeLearnModal, setActiveLearnModal] = useState(null);
  const [activePracticeModal, setActivePracticeModal] = useState(null);
  const [practiceAnswer, setPracticeAnswer] = useState(null);

  const studentState = ProgressService.getState();
  const unlockedConcepts = studentState.unlockedConcepts || [];

  const filteredConcepts = QUANTUM_CONCEPTS.filter(c => {
    if (selectedDifficulty === 'All') return true;
    return c.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
  });

  const handleStartPractice = (conceptId) => {
    const questions = QuestionService.getQuestions({ concept: conceptId });
    const q = questions.length > 0
      ? questions[Math.floor(Math.random() * questions.length)]
      : QuestionService.getAdaptiveQuestion();
    setActivePracticeModal(q);
    setPracticeAnswer(null);
  };

  return (
    <div className="flex-1 max-w-[1720px] w-full mx-auto p-4 sm:p-8 flex flex-col space-y-8 overflow-y-auto select-none">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive Quantum Curriculum &bull; 12 Core Concepts</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-['Space_Grotesk'] tracking-tight">
          Quantum Learning Hub
        </h1>
        <p className="text-sm text-gray-400 font-sans leading-relaxed">
          Master the quantum computing paradigm through progressive theoretical foundations, interactive simulation challenges, and adaptive gamified practice.
        </p>

        {/* Difficulty Filter Tabs */}
        <div className="inline-flex items-center p-1 rounded-2xl bg-white/[0.04] border border-white/10 mt-2">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map(diff => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedDifficulty === diff
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Concept Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConcepts.map((concept) => {
          const isUnlocked = unlockedConcepts.includes(concept.id);

          const diffColors = {
            Beginner: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
            Intermediate: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
            Advanced: 'bg-purple-500/10 text-purple-300 border-purple-500/30'
          };

          return (
            <div
              key={concept.id}
              className="p-6 rounded-3xl bg-[#080b20]/90 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl shadow-black/40 hover:-translate-y-1 group"
            >
              <div>
                {/* Card Top Pill & Category */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${diffColors[concept.difficulty] || diffColors.Beginner}`}>
                      {concept.difficulty}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">
                      {concept.category}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 font-mono text-xs text-amber-300">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>+{concept.xp} XP</span>
                  </div>
                </div>

                {/* Concept Title */}
                <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] group-hover:text-cyan-300 transition-colors mb-2">
                  {concept.name}
                </h3>

                {/* Simple Explanation */}
                <p className="text-xs text-gray-300 leading-relaxed font-sans mb-5">
                  {concept.description}
                </p>

                {/* Meta: Time & Unlock Status */}
                <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 mb-6 pb-4 border-b border-white/5">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                    <span>Est. {concept.estimatedTime}</span>
                  </div>
                  {isUnlocked && (
                    <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>UNLOCKED</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons: [Learn Concept] [Practice] [Play] */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setActiveLearnModal(concept)}
                  className="py-2 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-semibold flex items-center justify-center space-x-1 border border-white/10 transition-colors"
                  title="Read in-depth theoretical concept"
                >
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[11px]">Learn</span>
                </button>

                <button
                  onClick={() => handleStartPractice(concept.id)}
                  className="py-2 px-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-semibold flex items-center justify-center space-x-1 border border-purple-500/30 transition-colors"
                  title="Test knowledge with an interactive question"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-[11px]">Practice</span>
                </button>

                <button
                  onClick={() => onPlayConcept(concept.id)}
                  className="py-2 px-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black text-xs font-bold flex items-center justify-center space-x-1 transition-all shadow-md shadow-cyan-500/20"
                  title="Encounter this concept inside Quantum Rush runner"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span className="text-[11px]">Play</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Learn Concept Details Modal */}
      {activeLearnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-[#080b20] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
                    {activeLearnModal.name}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {activeLearnModal.difficulty}
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  Category: {activeLearnModal.category}
                </p>
              </div>

              <button
                onClick={() => setActiveLearnModal(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-gray-300 font-sans leading-relaxed mb-6">
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200">
                <strong className="text-white block mb-1 font-['Space_Grotesk']">Core Principle:</strong>
                {activeLearnModal.description}
              </div>

              <h4 className="font-bold text-white text-sm font-['Space_Grotesk']">
                Detailed Mechanics:
              </h4>
              <p>{activeLearnModal.details}</p>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-start space-x-3">
                <Bot className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-purple-300 block mb-1">Tip from Qumi:</strong>
                  Experiment with this concept directly in Quantum Lab to see how measurement probabilities and 3D Bloch sphere vectors update in real time!
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  const target = activeLearnModal.id;
                  setActiveLearnModal(null);
                  onExploreInLab(target);
                }}
                className="py-2.5 px-5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-semibold flex items-center space-x-2"
              >
                <FlaskConical className="w-4 h-4 text-purple-400" />
                <span>Simulate in Quantum Lab</span>
              </button>

              <button
                onClick={() => {
                  const target = activeLearnModal.id;
                  setActiveLearnModal(null);
                  onPlayConcept(target);
                }}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-xs uppercase font-['Space_Grotesk'] flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20"
              >
                <span>Play in Rush</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Quick Practice Modal */}
      {activePracticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#080b20] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center space-x-2.5">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-base text-white font-['Space_Grotesk']">
                  Practice: {activePracticeModal.conceptName}
                </h3>
              </div>
              <button
                onClick={() => setActivePracticeModal(null)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm font-medium text-gray-100 mb-5 leading-relaxed">
              {activePracticeModal.question}
            </p>

            <div className="space-y-2 mb-6">
              {activePracticeModal.options.map((opt, idx) => {
                let btnStyle = 'border-white/10 bg-white/[0.03] text-gray-200 hover:bg-white/[0.08]';
                if (practiceAnswer !== null) {
                  if (idx === activePracticeModal.correctAnswer) {
                    btnStyle = 'border-emerald-400 bg-emerald-500/20 text-emerald-200';
                  } else if (practiceAnswer === idx) {
                    btnStyle = 'border-rose-400 bg-rose-500/20 text-rose-200';
                  } else {
                    btnStyle = 'border-white/5 text-gray-600 opacity-50';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={practiceAnswer !== null}
                    onClick={() => {
                      setPracticeAnswer(idx);
                      QuestionService.submitAnswer(activePracticeModal.id, idx);
                    }}
                    className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all ${btnStyle}`}
                  >
                    {String.fromCharCode(65 + idx)}. {opt}
                  </button>
                );
              })}
            </div>

            {practiceAnswer !== null && (
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-gray-300 leading-relaxed mb-4">
                <strong className={practiceAnswer === activePracticeModal.correctAnswer ? 'text-emerald-400' : 'text-rose-400'}>
                  {practiceAnswer === activePracticeModal.correctAnswer ? '🎉 Correct!' : 'Not quite.'}
                </strong>{' '}
                {activePracticeModal.explanation}
              </div>
            )}

            {practiceAnswer !== null && (
              <button
                onClick={() => setActivePracticeModal(null)}
                className="w-full py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs uppercase font-['Space_Grotesk']"
              >
                Close Practice
              </button>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
