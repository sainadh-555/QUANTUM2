import React from 'react';
import { X, Bot } from 'lucide-react';

export default function AITutorModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-6xl glass-panel rounded-2xl border border-pink-500/30 bg-[#0a0d24] shadow-2xl flex flex-col h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-4 bg-black/40 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
              <Bot className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-100 font-['Space_Grotesk']">
                Qumi
              </h3>
              <p className="text-xs text-pink-400 font-mono">Your Personal AI Quantum Assistant</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Embedded Streamlit App */}
        <div className="flex-1 w-full bg-white relative">
          <iframe 
            src="http://localhost:8501/?embed=true" 
            width="100%" 
            height="100%" 
            frameBorder="0"
            title="Qumi Tutor"
            className="absolute inset-0 w-full h-full"
          />
        </div>

      </div>
    </div>
  );
}
