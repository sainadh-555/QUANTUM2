import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  X,
  RotateCcw,
  Zap,
  HelpCircle,
  FlaskConical,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { AIService } from '../../services/AIService';

export default function QumiDrawer({
  isOpen,
  onClose,
  circuit,
  results,
  onExploreInLab,
  onCircuitAction
}) {
  const [messages, setMessages] = useState([
    {
      id: 'msg-init',
      sender: 'qumi',
      text: "Hello! I'm **Qumi**, your Quantum Learning Companion. ⚛️\n\nI understand the concepts you're learning, the mistakes you make in Quantum Rush, and the exact circuit currently in Quantum Lab. Ask me anything or choose a quick prompt below!",
      suggestedActions: []
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = async (textToSend = inputVal) => {
    const query = (textToSend || '').trim();
    if (!query) return;

    const userMsg = { id: `msg-${Date.now()}`, sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    const q = query.toLowerCase();
    let responseText = '';
    let actions = [];

    try {
      if (q.includes('entangle') && (!circuit || circuit.qubits < 2)) {
        responseText = `### 🔗 Entanglement Analysis\n\nYour current circuit only has **${circuit?.qubits || 1} qubit**. Entanglement is a non-local correlation between *multiple* quantum particles.\n\nTo create entanglement:\n1. Add a second qubit ($q_1$).\n2. Put $q_0$ into superposition with a **Hadamard (H)** gate.\n3. Entangle them with a **CNOT** gate ($q_0 \\to q_1$).`;
        actions = [
          { type: 'ADD_QUBIT', label: '+ Add Qubit q1' },
          { type: 'ADD_CNOT', label: '+ Add CNOT Gate' },
          { type: 'LOAD_BELL', label: 'Load Bell State Circuit' }
        ];
      } else if (q.includes('circuit') || q.includes('what does this circuit do')) {
        const res = await AIService.explainCircuit(circuit);
        responseText = res.text;
        actions = res.suggestedActions || [];
      } else if (q.includes('result') || q.includes('why') || q.includes('50%') || q.includes('outcome') || q.includes('50/50')) {
        responseText = await AIService.explainSimulationResult(circuit, results);
      } else if (q.includes('debug') || q.includes('error') || q.includes('wrong') || q.includes('fix')) {
        responseText = await AIService.debugCircuit(circuit);
      } else if (q.includes('hadamard') || q.includes('superposition')) {
        responseText = await AIService.explainConcept('superposition');
        actions = [{ type: 'LOAD_SUPERPOSITION', label: 'Explore Superposition in Lab' }];
      } else if (q.includes('bell') || q.includes('entangle')) {
        responseText = await AIService.explainConcept('entanglement');
        actions = [{ type: 'LOAD_BELL', label: 'Load Bell State Circuit' }];
      } else if (q.includes('grover')) {
        responseText = await AIService.explainConcept('grover');
        actions = [{ type: 'LOAD_GROVER', label: 'Load Grover Algorithm' }];
      } else {
        responseText = `### ⚛️ Qumi's Response\n\nRegarding: *"${query}"*\n\nIn quantum computation, information is represented as complex probability amplitudes in a Hilbert space. Every operation must be unitary (preserving total probability = 1).\n\nIf you are experimenting in Quantum Lab, try building a superposition with **H** or an entangled state with **CNOT**!`;
      }
    } catch (e) {
      responseText = "I encountered a minor issue processing that question. Feel free to ask about your circuit or quantum concepts!";
    }

    setIsTyping(false);
    setMessages(prev => [
      ...prev,
      {
        id: `msg-qumi-${Date.now()}`,
        sender: 'qumi',
        text: responseText,
        suggestedActions: actions
      }
    ]);
  };

  const samplePrompts = [
    "Explain this circuit",
    "Why 50% 00 and 50% 11?",
    "Why isn't this creating entanglement?",
    "What does the Hadamard gate do?",
    "Check my circuit for errors"
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-md bg-[#080b22] border-l border-cyan-500/30 flex flex-col h-full shadow-2xl shadow-cyan-500/20 overflow-hidden">
        
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-purple-600 p-0.5 shadow-md shadow-cyan-500/20">
              <div className="w-full h-full bg-[#070a1a] rounded-[14px] flex items-center justify-center text-cyan-400">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#080b22]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-white font-['Space_Grotesk']">
                  Qumi
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  AI COMPANION
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-sans">
                "Your Quantum Learning Companion"
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 border-b border-white/5 flex items-center space-x-1.5 overflow-x-auto bg-black/20">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-300 border border-white/10 text-[11px] whitespace-nowrap shrink-0 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs sm:text-sm selection:bg-cyan-500/30">
          {messages.map(msg => {
            const isQumi = msg.sender === 'qumi';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-2.5 ${isQumi ? 'justify-start' : 'justify-end'}`}
              >
                {isQumi && (
                  <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className="flex flex-col space-y-2 max-w-[85%]">
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      isQumi
                        ? 'bg-white/[0.04] border border-white/10 text-gray-200 shadow-sm'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-medium shadow-md shadow-cyan-500/20'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Interactive Action Pills from Qumi */}
                  {isQumi && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestedActions.map((action, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => {
                            onCircuitAction?.(action.type);
                            if (action.type.startsWith('LOAD_')) {
                              const concept = action.type === 'LOAD_BELL' ? 'entanglement' : 'superposition';
                              onExploreInLab?.(concept);
                            }
                          }}
                          className="px-3 py-1 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 text-[11px] font-mono flex items-center space-x-1 transition-all shadow-sm active:scale-95"
                        >
                          <Zap className="w-3 h-3 text-purple-400" />
                          <span>{action.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 pl-9">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0.15s' }} />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0.3s' }} />
              <span className="text-[11px] text-gray-400 ml-1">Qumi is analyzing quantum state...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-white/10 bg-[#06081a]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2 bg-white/[0.03] border border-white/10 rounded-2xl px-3 py-1.5 focus-within:border-cyan-500/50"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask Qumi about circuits, gates, or concepts..."
              className="flex-1 bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none py-1"
            />

            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="p-2 rounded-xl bg-cyan-500 disabled:opacity-30 disabled:cursor-not-allowed text-black hover:bg-cyan-400 transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
