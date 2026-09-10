export const GATE_CATEGORIES = {
  SINGLE_QUBIT: 'Single Qubit',
  CONTROLLED: 'Controlled',
  OTHER: 'Other',
};

export const QUANTUM_GATES = [
  // Single Qubit Gates
  {
    id: 'H',
    name: 'Hadamard',
    symbol: 'H',
    category: GATE_CATEGORIES.SINGLE_QUBIT,
    color: 'bg-cyan-500/20 border-cyan-400 text-cyan-300 hover:bg-cyan-500/30',
    badgeColor: 'bg-cyan-500 text-black',
    description: 'Creates a superposition state of |0⟩ and |1⟩.',
    matrix: '1/√2 [[1, 1], [1, -1]]',
    detail: 'The Hadamard gate maps the basis states |0⟩ to (|0⟩ + |1⟩)/√2 and |1⟩ to (|0⟩ - |1⟩)/√2, creating an equal superposition.'
  },
  {
    id: 'X',
    name: 'Pauli-X',
    symbol: 'X',
    category: GATE_CATEGORIES.SINGLE_QUBIT,
    color: 'bg-indigo-500/20 border-indigo-400 text-indigo-300 hover:bg-indigo-500/30',
    badgeColor: 'bg-indigo-500 text-white',
    description: 'Quantum NOT gate. Flips |0⟩ ↔ |1⟩.',
    matrix: '[[0, 1], [1, 0]]',
    detail: 'Acts like a classical bit-flip NOT gate. Rotates state vector by π radians around the X-axis of the Bloch sphere.'
  },
  {
    id: 'Y',
    name: 'Pauli-Y',
    symbol: 'Y',
    category: GATE_CATEGORIES.SINGLE_QUBIT,
    color: 'bg-purple-500/20 border-purple-400 text-purple-300 hover:bg-purple-500/30',
    badgeColor: 'bg-purple-500 text-white',
    description: 'Flips bit and phase state.',
    matrix: '[[0, -i], [i, 0]]',
    detail: 'Combines bit-flip and phase-flip. Rotates state vector by π radians around the Y-axis of the Bloch sphere.'
  },
  {
    id: 'Z',
    name: 'Pauli-Z',
    symbol: 'Z',
    category: GATE_CATEGORIES.SINGLE_QUBIT,
    color: 'bg-violet-500/20 border-violet-400 text-violet-300 hover:bg-violet-500/30',
    badgeColor: 'bg-violet-500 text-white',
    description: 'Phase-flip gate. Flips phase of |1⟩ to -|1⟩.',
    matrix: '[[1, 0], [0, -1]]',
    detail: 'Leaves state |0⟩ unchanged and flips phase of |1⟩ to -|1⟩. Rotates state vector by π radians around Z-axis.'
  },
  {
    id: 'S',
    name: 'Phase S',
    symbol: 'S',
    category: GATE_CATEGORIES.SINGLE_QUBIT,
    color: 'bg-blue-500/20 border-blue-400 text-blue-300 hover:bg-blue-500/30',
    badgeColor: 'bg-blue-500 text-white',
    description: 'π/2 phase rotation around Z-axis.',
    matrix: '[[1, 0], [0, i]]',
    detail: 'Also known as the √Z gate. Adds a phase of π/2 (90 degrees) to the |1⟩ state.'
  },
  {
    id: 'T',
    name: 'Phase T',
    symbol: 'T',
    category: GATE_CATEGORIES.SINGLE_QUBIT,
    color: 'bg-teal-500/20 border-teal-400 text-teal-300 hover:bg-teal-500/30',
    badgeColor: 'bg-teal-500 text-black',
    description: 'π/4 phase rotation around Z-axis.',
    matrix: '[[1, 0], [0, e^(iπ/4)]]',
    detail: 'Also known as the ∜Z gate. Crucial for universal quantum computing.'
  },
  {
    id: 'I',
    name: 'Identity',
    symbol: 'I',
    category: GATE_CATEGORIES.SINGLE_QUBIT,
    color: 'bg-slate-500/20 border-slate-400 text-slate-300 hover:bg-slate-500/30',
    badgeColor: 'bg-slate-600 text-white',
    description: 'No-operation (NOP) gate.',
    matrix: '[[1, 0], [0, 1]]',
    detail: 'Leaves the qubit state completely unchanged.'
  },

  // Controlled Gates
  {
    id: 'CX',
    name: 'Controlled-NOT',
    symbol: 'CX',
    category: GATE_CATEGORIES.CONTROLLED,
    isMultiQubit: true,
    color: 'bg-pink-500/20 border-pink-400 text-pink-300 hover:bg-pink-500/30',
    badgeColor: 'bg-pink-500 text-white',
    description: 'Flips target qubit if control qubit is |1⟩.',
    matrix: '4x4 Controlled Matrix',
    detail: 'Fundamental 2-qubit entangling gate. Flips the target qubit state if and only if the control qubit is in state |1⟩.'
  },
  {
    id: 'CZ',
    name: 'Controlled-Z',
    symbol: 'CZ',
    category: GATE_CATEGORIES.CONTROLLED,
    isMultiQubit: true,
    color: 'bg-fuchsia-500/20 border-fuchsia-400 text-fuchsia-300 hover:bg-fuchsia-500/30',
    badgeColor: 'bg-fuchsia-500 text-white',
    description: 'Flips phase if both qubits are |1⟩.',
    matrix: '4x4 Controlled Phase Matrix',
    detail: 'Applies a Z gate (phase flip) to the target qubit if the control qubit is |1⟩.'
  },

  // Other Gates
  {
    id: 'MEASURE',
    name: 'Measurement',
    symbol: 'M',
    category: GATE_CATEGORIES.OTHER,
    color: 'bg-emerald-500/20 border-emerald-400 text-emerald-300 hover:bg-emerald-500/30',
    badgeColor: 'bg-emerald-500 text-black',
    description: 'Measures quantum state into classical bit.',
    matrix: 'Collapse Operator',
    detail: 'Projects quantum state into classical basis state (|0⟩ or |1⟩) and records result to a classical register bit.'
  },
  {
    id: 'RESET',
    name: 'Reset Qubit',
    symbol: '|0⟩',
    category: GATE_CATEGORIES.OTHER,
    color: 'bg-amber-500/20 border-amber-400 text-amber-300 hover:bg-amber-500/30',
    badgeColor: 'bg-amber-500 text-black',
    description: 'Resets qubit back to state |0⟩.',
    matrix: 'Reset Operation',
    detail: 'Resets the target qubit back to ground state |0⟩ regardless of its previous state.'
  }
];
