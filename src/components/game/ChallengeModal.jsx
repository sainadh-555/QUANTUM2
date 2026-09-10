import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  FlaskConical,
  RotateCcw,
  Zap,
  Bot
} from 'lucide-react';
import { AIService } from '../../services/AIService';

export default function ChallengeModal({
  token,
  question,
  onAnswer,
  onResumeRun,
  onExploreInLab,
  lives
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  if (!question) return null;

  const isCorrect = submitted && selectedOption === question.correctAnswer;
  const isWrong = submitted && selectedOption !== question.correctAnswer;

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setSubmitted(true);
    onAnswer(selectedOption === question.correctAnswer, question);
  };

  const handleTryAgain = () => {
    setSelectedOption(null);
    setSubmitted(false);
  };

  const conceptLabels = {
    qubit: { title: 'Qubit Challenge', color: 'from-purple-500 to-indigo-600', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
    superposition: { title: 'Hadamard Challenge', color: 'from-cyan-500 to-blue-600', badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
    entanglement: { title: 'Bell State Challenge', color: 'from-emerald-500 to-teal-600', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
    gates: { title: 'Quantum Gate Challenge', color: 'from-amber-500 to-orange-600', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
    measurement: { title: 'Measurement Challenge', color: 'from-rose-500 to-red-600', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
    algorithms: { title: 'Algorithm Challenge', color: 'from-blue-500 to-purple-600', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
  };

  const tokenInfo = conceptLabels[question.concept] || conceptLabels.qubit;

  // Mistake-to-Learning explanation from Qumi
  const mistakeInfo = isWrong ? AIService.explainQuestion(question, selectedOption) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-lg bg-[#070a1a] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-500/20 overflow-hidden flex flex-col">
        
        {/* Glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-gradient-to-b from-cyan-500/20 to-transparent blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${tokenInfo.color} flex items-center justify-center text-white shadow-md`}>
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base sm:text-lg text-white font-['Space_Grotesk']">
                  {tokenInfo.title}
                </h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${tokenInfo.badge}`}>
                  {question.difficulty}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Topic: {question.conceptName || 'Quantum Physics'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 font-mono text-xs text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>+{question.xp || 50} XP</span>
          </div>
        </div>

        {/* Question Text */}
        <div className="mb-6">
          <p className="text-sm sm:text-base font-medium text-gray-100 leading-relaxed font-sans">
            {question.question}
          </p>
        </div>

        {/* Choices */}
        <div className="space-y-2.5 mb-6">
          {question.options.map((option, idx) => {
            let optionStyles = 'border-white/10 bg-white/[0.03] text-gray-200 hover:bg-white/[0.08] hover:border-cyan-500/40';

            if (selectedOption === idx && !submitted) {
              optionStyles = 'border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow-md shadow-cyan-500/10';
            } else if (submitted) {
              if (idx === question.correctAnswer) {
                optionStyles = 'border-emerald-400 bg-emerald-500/20 text-emerald-200 shadow-md shadow-emerald-500/20';
              } else if (selectedOption === idx && isWrong) {
                optionStyles = 'border-rose-400 bg-rose-500/20 text-rose-200';
              } else {
                optionStyles = 'border-white/5 bg-white/[0.01] text-gray-500 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={submitted}
                onClick={() => setSelectedOption(idx)}
                className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-between group ${optionStyles}`}
              >
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono text-gray-400 group-hover:text-white">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>

                {submitted && idx === question.correctAnswer && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                )}
                {submitted && selectedOption === idx && isWrong && (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Qumi Feedback Box on Submission */}
        {submitted && (
          <div className={`p-4 rounded-2xl mb-6 border transition-all ${
            isCorrect
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-100'
          }`}>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className={`w-4 h-4 ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`} />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-xs sm:text-sm flex items-center gap-1.5 font-['Space_Grotesk']">
                  {isCorrect ? (
                    <>
                      <span className="text-emerald-400">🎉 Correct! +{question.xp || 50} XP</span>
                      <span className="text-gray-400 font-normal text-xs">• Concept unlocked</span>
                    </>
                  ) : (
                    <>
                      <span className="text-rose-400">Not quite!</span>
                      <span className="text-gray-400 font-normal text-xs">(-1 Life &bull; Qumi's Guidance)</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-300 leading-relaxed font-sans">
                  {isCorrect ? question.explanation : (mistakeInfo?.text || question.explanation)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hint drawer toggle from Qumi (if not submitted) */}
        {!submitted && (
          <div className="mb-4">
            {!showHint ? (
              <button
                onClick={() => setShowHint(true)}
                className="text-xs text-cyan-400/80 hover:text-cyan-300 flex items-center gap-1 font-mono transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Ask Qumi for a hint</span>
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-xs flex items-start gap-2">
                <Bot className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="font-sans leading-relaxed">
                  {AIService.generateHint(question)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase font-['Space_Grotesk'] flex items-center space-x-2 transition-all ${
                selectedOption !== null
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-95'
                  : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
              }`}
            >
              <span>Submit Answer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : isCorrect ? (
            <div className="flex items-center space-x-3 w-full justify-between">
              <button
                onClick={() => onExploreInLab(question.concept)}
                className="px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md shadow-purple-500/10"
              >
                <FlaskConical className="w-4 h-4 text-purple-400" />
                <span>EXPLORE IN QUANTUM LAB</span>
              </button>

              <button
                onClick={onResumeRun}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-xs tracking-wider uppercase font-['Space_Grotesk'] flex items-center space-x-1.5 shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-95"
              >
                <span>Continue Run</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            // MISTAKE -> LEARNING FLOW: Gives option to try it directly in Quantum Lab!
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 w-full">
              <button
                onClick={() => onExploreInLab(mistakeInfo?.starterCircuitConcept || question.concept)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500/30 to-pink-500/30 hover:from-purple-500/40 hover:to-pink-500/40 text-purple-200 border border-purple-500/50 text-xs font-bold font-['Space_Grotesk'] flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-purple-500/20 active:scale-95"
              >
                <FlaskConical className="w-4 h-4 text-pink-400" />
                <span>TRY IT IN QUANTUM LAB</span>
              </button>

              <div className="flex items-center space-x-2 justify-end">
                <button
                  onClick={handleTryAgain}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold flex items-center space-x-1.5 border border-white/10 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>

                <button
                  onClick={onResumeRun}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-white/10"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
