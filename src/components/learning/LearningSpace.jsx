import React from 'react';
import {
  Cpu,
  BookOpen,
  Box,
  Binary,
  Bot,
  Atom,
  Zap,
  Code,
  Compass,
  ArrowRight,
  Sparkles,
  BookMarked
} from 'lucide-react';

const TOPIC_CARDS = [
  {
    id: 'electronics',
    title: 'Electronics & Circuit Design',
    category: 'Hardware & Circuits',
    description: 'Learn Ohm\'s law, series/parallel networks, semiconductor diodes, transistors, and sensor conditioning circuits.',
    icon: Cpu,
    color: 'from-cyan-500/20 to-blue-600/20',
    borderColor: 'border-cyan-500/30 hover:border-cyan-400',
    badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    iconColor: 'text-cyan-400',
    target: 'simulation',
    buttonText: 'Open Simulation Lab',
    modulesCount: '8 Interactive Labs'
  },
  {
    id: '3d-learning',
    title: '3D Spatial Geometry & Coordinates',
    category: 'Spatial Mathematics',
    description: 'Master 3D Cartesian coordinates (X, Y, Z), vector projections, 3D object manipulation, and Euclidean spatial transformations.',
    icon: Box,
    color: 'from-blue-500/20 to-indigo-600/20',
    borderColor: 'border-blue-500/30 hover:border-blue-400',
    badgeColor: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    iconColor: 'text-blue-400',
    target: '3d',
    buttonText: 'Launch 3D Lab',
    modulesCount: 'Interactive Black Sphere'
  },
  {
    id: 'algorithms',
    title: 'Algorithms & Data Structures',
    category: 'Computer Science',
    description: 'Visualize Bubble Sort, Selection Sort, Binary Search, and Graph Traversals with real-time asymptotic complexity telemetry.',
    icon: Binary,
    color: 'from-amber-500/20 to-orange-600/20',
    borderColor: 'border-amber-500/30 hover:border-amber-400',
    badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    iconColor: 'text-amber-400',
    target: 'algorithms',
    buttonText: 'Explore Algorithms',
    modulesCount: '7 Step-by-Step Simulators'
  },
  {
    id: 'elibrary',
    title: 'E-Library & RAG Knowledge Hub',
    category: 'Reference & RAG',
    description: 'Access academic papers, circuit reference guides, and connect with RAG semantic document question-answering.',
    icon: BookOpen,
    color: 'from-emerald-500/20 to-teal-600/20',
    borderColor: 'border-emerald-500/30 hover:border-emerald-400',
    badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    iconColor: 'text-emerald-400',
    target: 'library',
    buttonText: 'Browse E-Library',
    modulesCount: '6 Curated PDF Modules'
  },
  {
    id: 'quantum',
    title: 'Quantum Computing & Bloch Sphere',
    category: 'Advanced Physics',
    description: 'Explore state vectors, superposition, entanglement, Pauli quantum logic gates, and Qiskit circuit simulation.',
    icon: Atom,
    color: 'from-purple-500/20 to-pink-600/20',
    borderColor: 'border-purple-500/30 hover:border-purple-400',
    badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    iconColor: 'text-purple-400',
    target: 'quantum',
    buttonText: 'Open Quantum Studio',
    modulesCount: 'Bloch Sphere & Qiskit Aer'
  },
  {
    id: 'ai-tutor',
    title: 'AI Pedagogical Learning Assistant',
    category: 'Artificial Intelligence',
    description: 'Get tailored circuit explanations, line-by-line firmware code reviews, and automatic electrical fault debugging.',
    icon: Bot,
    color: 'from-pink-500/20 to-rose-600/20',
    borderColor: 'border-pink-500/30 hover:border-pink-400',
    badgeColor: 'bg-pink-500/10 text-pink-300 border-pink-500/30',
    iconColor: 'text-pink-400',
    target: 'ai',
    buttonText: 'Consult AI Tutor',
    modulesCount: 'Context-Aware Assistant'
  }
];

export default function LearningSpace({ onNavigate }) {
  return (
    <div className="flex-1 w-full bg-[#040612] text-gray-100 flex flex-col items-center justify-start overflow-y-auto select-none p-4 sm:p-8">
      
      {/* Header Banner */}
      <div className="max-w-6xl w-full mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono mb-3">
          <BookMarked className="w-3.5 h-3.5 text-purple-400" />
          <span>Interactive STEM Curriculum</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk']">
          Learning Space
        </h2>
        <p className="mt-2 text-sm text-gray-400 max-w-xl mx-auto font-sans">
          Select any learning domain below to engage with interactive simulators, visual coding, and AI-assisted educational modules.
        </p>
      </div>

      {/* Topics Grid */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOPIC_CARDS.map(card => {
          const IconComp = card.icon;
          return (
            <div
              key={card.id}
              className={`p-6 rounded-2xl bg-gradient-to-br ${card.color} border ${card.borderColor} backdrop-blur-md flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/40`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center ${card.iconColor}`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${card.badgeColor}`}>
                    {card.modulesCount}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white font-['Space_Grotesk'] mb-2">
                  {card.title}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed font-sans mb-6">
                  {card.description}
                </p>
              </div>

              <button
                onClick={() => onNavigate(card.target)}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-between border border-white/10 transition-all group"
              >
                <span>{card.buttonText}</span>
                <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
