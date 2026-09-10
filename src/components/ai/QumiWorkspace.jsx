import React from 'react';

export default function QumiWorkspace({ mode = 'tutor', circuit, results, onCircuitAction }) {
  return (
    <div className="flex flex-col h-full w-full rounded-3xl border border-purple-500/20 shadow-2xl overflow-hidden relative max-w-5xl mx-auto bg-white">
      {/* Embedded Streamlit App */}
      <iframe 
        src="http://localhost:8501/?embed=true" 
        width="100%" 
        height="100%" 
        frameBorder="0"
        title="Qumi Tutor"
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
