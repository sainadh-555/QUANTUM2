import React, { useState } from 'react';
import { AIService } from '../../services/AIService';
import {
  Sparkles,
  X,
  Send,
  HelpCircle,
  Bug,
  Code2,
  Lightbulb,
  Bot,
  User,
  Check,
  Copy
} from 'lucide-react';

export default function AITutorDrawer({
  isOpen,
  onClose,
  simulationState,
  generatedCode,
  language
}) {
  const [messages, setMessages] = useState([
    {
      id: 'init-msg',
      sender: 'ai',
      text: `### 👋 Hello! I'm your AI Simulation Tutor.\n\nI analyze your circuit wiring, calculate electrical properties in real-time, and help you master electronics and hardware coding!\n\nTry clicking one of the quick question pills below or ask me anything!`
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendPrompt = async (queryText) => {
    if (!queryText || !queryText.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      let aiResponseText = '';
      const q = queryText.toLowerCase();

      if (q.includes('explain this circuit') || q.includes('how does this work')) {
        aiResponseText = await AIService.explainSimulation(simulationState);
      } else if (q.includes('why') && (q.includes('led') || q.includes('working') || q.includes('error'))) {
        aiResponseText = await AIService.debugSimulation(simulationState);
      } else if (q.includes('code') || q.includes('program')) {
        aiResponseText = await AIService.generateCodeExplanation(generatedCode, language);
      } else if (q.includes('suggest') || q.includes('what should i add')) {
        aiResponseText = await AIService.suggestComponents(simulationState);
      } else {
        aiResponseText = await AIService.answerQuestion(queryText, simulationState);
      }

      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiResponseText
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: 'I encountered an issue processing your query. Please check your circuit and try again!'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-[#070b1f] border-l border-cyan-500/30 shadow-2xl flex flex-col backdrop-blur-xl animate-in slide-in-from-right duration-300 select-none text-gray-200">
      
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-cyan-500/10 to-purple-600/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-500 p-0.5 shadow-md shadow-cyan-500/20">
            <div className="w-full h-full bg-[#070b1f] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-100 font-['Space_Grotesk'] flex items-center gap-2">
              AI Simulation Tutor
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                SIH EdTech
              </span>
            </h3>
            <p className="text-[11px] text-gray-400">Context-aware circuit & code learning</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Action Prompt Pills */}
      <div className="p-3 border-b border-white/5 bg-white/[0.01] flex flex-wrap gap-1.5">
        <button
          onClick={() => handleSendPrompt('Explain this circuit.')}
          className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 transition-all shadow-sm"
        >
          <HelpCircle className="w-3 h-3 text-cyan-400" />
          Explain this circuit
        </button>
        <button
          onClick={() => handleSendPrompt("Why isn't my LED working?")}
          className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Bug className="w-3 h-3 text-rose-400" />
          Why isn't my LED working?
        </button>
        <button
          onClick={() => handleSendPrompt('Explain the generated code.')}
          className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Code2 className="w-3 h-3 text-purple-400" />
          Walk me through the code
        </button>
        <button
          onClick={() => handleSendPrompt('What components should I add next?')}
          className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Lightbulb className="w-3 h-3 text-amber-400" />
          What should I add next?
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 select-text">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 text-cyan-400 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none'
                  : 'bg-white/[0.04] border border-white/10 text-gray-200 rounded-tl-none prose prose-invert'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">
                {msg.text}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 text-blue-400 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 items-center text-xs text-cyan-400 font-mono">
            <Bot className="w-4 h-4 animate-spin" />
            <span>AI Tutor inspecting circuit topology...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-white/10 bg-[#050816]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendPrompt(inputQuery);
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            placeholder="Ask AI Tutor about your circuit, components, or code..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isLoading}
            className="w-full pl-4 pr-12 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-sans"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="absolute right-1.5 p-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black disabled:opacity-30 disabled:hover:bg-cyan-500 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
}
