import React, { useState, useEffect, useRef } from 'react';
import {
  Code2,
  Copy,
  Check,
  Download,
  RefreshCw,
  FileCode,
  Bot,
  AlertCircle,
  X
} from 'lucide-react';
import { circuitToQiskit } from '../utils/circuitToQiskit';
import { CodeParser } from '../services/CodeParser';

export default function CodeEditor({
  isOpen,
  onClose,
  circuit,
  onResetCircuit,
  onCircuitUpdate,
  onOpenQumi
}) {
  const [copied, setCopied] = useState(false);
  const [editableCode, setEditableCode] = useState('');
  const [parseError, setParseError] = useState(null);
  
  const isTyping = useRef(false);
  const generatedCode = circuitToQiskit(circuit);

  // Sync external visual changes to the editor, ONLY if user is not currently typing
  useEffect(() => {
    if (!isTyping.current) {
      setEditableCode(generatedCode);
      setParseError(null);
    }
  }, [generatedCode]);

  // Debounced parsing when user types
  useEffect(() => {
    if (!isTyping.current) return;

    const timer = setTimeout(() => {
      const parseResult = CodeParser.parseQiskit(editableCode);
      if (parseResult.success && parseResult.circuit) {
        setParseError(null);
        // Only trigger update if the circuit actually changed to prevent loops
        onCircuitUpdate?.(parseResult.circuit);
      } else {
        setParseError(parseResult.error || 'Syntax warning');
      }
      // After processing the user's intent, release the typing lock 
      // so visual changes can update the code again.
      isTyping.current = false;
    }, 400);

    return () => clearTimeout(timer);
  }, [editableCode, onCircuitUpdate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(editableCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([editableCode], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quantum_circuit.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCodeChange = (e) => {
    isTyping.current = true;
    setEditableCode(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 right-0 h-full w-full sm:w-96 z-40 flex flex-col bg-[#070918]/95 shadow-2xl border-l border-white/10 animate-in slide-in-from-right duration-300">
      
      {/* Editor Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-black/40">
        <div className="flex items-center space-x-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <h3 className="font-semibold text-sm tracking-wide text-gray-100 font-['Space_Grotesk'] uppercase">
            Qiskit Code
          </h3>
          <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-mono border border-cyan-500/20">
            Python
          </span>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors flex items-center space-x-1 text-xs"
            title="Copy Qiskit Code"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
            title="Download .py Script"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              isTyping.current = false;
              onResetCircuit();
            }}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
            title="Reset Code"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-white/10 mx-1"></div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition-colors"
            title="Close Editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 p-3 font-mono text-xs overflow-y-auto flex flex-col selection:bg-cyan-500/30">
        
        <div className="flex-1 flex flex-col h-full relative">
          <textarea
            value={editableCode}
            onChange={handleCodeChange}
            spellCheck="false"
            className="w-full h-full min-h-[300px] flex-1 bg-transparent text-gray-100 font-mono text-xs leading-relaxed resize-none outline-none p-2 rounded-lg border border-white/5 focus:border-cyan-500/30 transition-colors"
            placeholder="# Type Qiskit code here e.g.:&#10;qc.h(0)&#10;qc.cx(0, 1)&#10;qc.measure_all()"
          />
          
          {/* Validation Indicator overlay */}
          <div className="absolute bottom-4 right-4 pointer-events-none flex flex-col items-end gap-2">
             {parseError ? (
                <div className="text-[10px] font-mono text-amber-400 flex items-center gap-1.5 bg-amber-500/10 p-2 rounded border border-amber-500/20 shadow-lg backdrop-blur-md animate-in fade-in zoom-in duration-200">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span className="max-w-[200px] truncate">Incomplete instruction</span>
                </div>
             ) : (
               <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1.5 rounded border border-emerald-500/20 shadow-lg backdrop-blur-md animate-in fade-in duration-500 opacity-70">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Circuit Synced</span>
                </div>
             )}
          </div>
        </div>

      </div>

      {/* Editor Footer */}
      <div className="px-4 py-2 border-t border-white/10 bg-black/40 flex items-center justify-between text-[10px] font-mono text-gray-500">
        <div className="flex items-center space-x-1 text-cyan-400/80">
          <FileCode className="w-3 h-3" />
          <span>Bi-directional Sync Active</span>
        </div>

        {onOpenQumi && (
          <button
            onClick={onOpenQumi}
            className="text-purple-300 hover:text-purple-200 flex items-center gap-1 font-sans font-medium transition-colors"
          >
            <Bot className="w-3 h-3 text-purple-400" />
            <span>Explain with Qumi</span>
          </button>
        )}
      </div>

    </div>
  );
}
