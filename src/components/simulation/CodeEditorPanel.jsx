import React, { useState, useEffect } from 'react';
import {
  Code,
  Copy,
  Check,
  Download,
  RotateCcw,
  Sparkles,
  FileCode,
  CheckCircle2
} from 'lucide-react';

export default function CodeEditorPanel({
  code,
  language,
  onChangeLanguage,
  onResetCode
}) {
  const [copied, setCopied] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);

  // Subtle "Code Updated" indicator pulse whenever code text changes
  useEffect(() => {
    setJustUpdated(true);
    const timer = setTimeout(() => setJustUpdated(false), 1200);
    return () => clearTimeout(timer);
  }, [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = language === 'python' ? 'py' : language === 'javascript' ? 'js' : 'ino';
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sih_simulation_circuit.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Format code lines with simple syntax highlighting tokens
  const renderHighlightedCode = () => {
    const lines = code.split('\n');
    return lines.map((line, idx) => {
      let lineClass = 'text-gray-300';
      if (line.trim().startsWith('//') || line.trim().startsWith('#')) {
        lineClass = 'text-gray-500 italic';
      } else if (line.includes('void setup()') || line.includes('void loop()') || line.includes('def setup()') || line.includes('board.on')) {
        lineClass = 'text-cyan-400 font-semibold';
      } else if (line.includes('const ') || line.includes('int ') || line.includes('float ') || line.includes('bool ') || line.includes('import ') || line.includes('require')) {
        lineClass = 'text-purple-300';
      } else if (line.includes('digitalWrite') || line.includes('analogRead') || line.includes('GPIO.') || line.includes('.blink')) {
        lineClass = 'text-amber-300';
      }

      return (
        <div key={idx} className="table-row font-mono text-[11px] leading-5 hover:bg-white/[0.02]">
          <span className="table-cell select-none text-right pr-4 text-gray-600 w-8">
            {idx + 1}
          </span>
          <span className={`table-cell whitespace-pre font-mono ${lineClass}`}>
            {line}
          </span>
        </div>
      );
    });
  };

  return (
    <aside className="w-full lg:w-96 h-full flex flex-col bg-[#060919] border-l border-white/10 select-none text-gray-200">
      
      {/* Header Bar */}
      <div className="p-3 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-semibold text-gray-100 tracking-wide font-['Space_Grotesk'] uppercase">
            Generated Code
          </h3>
        </div>

        {/* Live Code Updated Indicator */}
        <div className="flex items-center gap-2">
          {justUpdated && (
            <span className="flex items-center gap-1 text-[10px] text-cyan-400 font-mono animate-pulse">
              <CheckCircle2 className="w-3 h-3" />
              Live Synced
            </span>
          )}
        </div>
      </div>

      {/* Language Switcher Tabs & Actions */}
      <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between gap-1 bg-[#050713]">
        {/* Language Tabs */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/5 border border-white/10">
          <button
            onClick={() => onChangeLanguage('arduino')}
            className={`px-2 py-1 text-[10px] font-mono font-medium rounded-md transition-all ${
              language === 'arduino'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Arduino/C++
          </button>
          <button
            onClick={() => onChangeLanguage('python')}
            className={`px-2 py-1 text-[10px] font-mono font-medium rounded-md transition-all ${
              language === 'python'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Python
          </button>
          <button
            onClick={() => onChangeLanguage('javascript')}
            className={`px-2 py-1 text-[10px] font-mono font-medium rounded-md transition-all ${
              language === 'javascript'
                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            JS (Node)
          </button>
        </div>

        {/* Action Buttons: Copy, Download, Reset */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            title={copied ? 'Copied to clipboard' : 'Copy code'}
            className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-300 hover:bg-white/5 border border-white/5 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleDownload}
            title="Download code file"
            className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-300 hover:bg-white/5 border border-white/5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onResetCode}
            title="Reset code template"
            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-300 hover:bg-white/5 border border-white/5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="flex-1 overflow-auto p-3 font-mono text-xs bg-[#040612] select-text">
        <div className="table w-full">
          {renderHighlightedCode()}
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-3 py-2 border-t border-white/10 bg-white/[0.01] flex items-center justify-between text-[10px] text-gray-500 font-mono">
        <div className="flex items-center gap-1.5">
          <FileCode className="w-3 h-3 text-cyan-400" />
          <span>UTF-8</span>
        </div>
        <span>Auto-reactive Compiler</span>
      </div>

    </aside>
  );
}
