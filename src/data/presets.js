export const PRESET_CIRCUITS = [
  {
    id: 'bell-state',
    name: 'Bell State (|Φ⁺⟩)',
    description: 'Creates maximum 2-qubit entanglement: (|00⟩ + |11⟩)/√2 via Hadamard and CNOT',
    qubits: 2,
    classicalBits: 2,
    columns: 4,
    operations: [
      { id: 'op-1', gate: 'H', qubit: 0, column: 0 },
      { id: 'op-2', gate: 'CX', control: 0, target: 1, column: 1 },
      { id: 'op-3', gate: 'MEASURE', qubit: 0, column: 2 },
      { id: 'op-4', gate: 'MEASURE', qubit: 1, column: 2 },
    ]
  },
  {
    id: 'ghz-state',
    name: 'GHZ State (3-Qubit)',
    description: 'Greenberger-Horne-Zeilinger 3-qubit maximally entangled state: (|000⟩ + |111⟩)/√2',
    qubits: 3,
    classicalBits: 3,
    columns: 5,
    operations: [
      { id: 'op-1', gate: 'H', qubit: 0, column: 0 },
      { id: 'op-2', gate: 'CX', control: 0, target: 1, column: 1 },
      { id: 'op-3', gate: 'CX', control: 1, target: 2, column: 2 },
      { id: 'op-4', gate: 'MEASURE', qubit: 0, column: 3 },
      { id: 'op-5', gate: 'MEASURE', qubit: 1, column: 3 },
      { id: 'op-6', gate: 'MEASURE', qubit: 2, column: 3 },
    ]
  },
  {
    id: 'superposition',
    name: 'Hadamard Superposition',
    description: 'Applies Hadamard gates across 2 qubits to create an equal 4-state superposition',
    qubits: 2,
    classicalBits: 2,
    columns: 3,
    operations: [
      { id: 'op-1', gate: 'H', qubit: 0, column: 0 },
      { id: 'op-2', gate: 'H', qubit: 1, column: 0 },
      { id: 'op-3', gate: 'MEASURE', qubit: 0, column: 1 },
      { id: 'op-4', gate: 'MEASURE', qubit: 1, column: 1 },
    ]
  },
  {
    id: 'teleportation',
    name: 'Quantum Teleportation (Protocol)',
    description: 'Transfers unknown quantum state of q0 to q2 using EPR entanglement pair (q1-q2)',
    qubits: 3,
    classicalBits: 3,
    columns: 6,
    operations: [
      // 1. Prepare arbitrary state on q0 (H + S = |i+>)
      { id: 'tel-1', gate: 'H', qubit: 0, column: 0 },
      // 2. Create entangled pair between q1 and q2
      { id: 'tel-2', gate: 'H', qubit: 1, column: 0 },
      { id: 'tel-3', gate: 'CX', control: 1, target: 2, column: 1 },
      // 3. Bell basis measurement between q0 and q1
      { id: 'tel-4', gate: 'CX', control: 0, target: 1, column: 2 },
      { id: 'tel-5', gate: 'H', qubit: 0, column: 3 },
      { id: 'tel-6', gate: 'MEASURE', qubit: 0, column: 4 },
      { id: 'tel-7', gate: 'MEASURE', qubit: 1, column: 4 },
      // 4. Verification measure on Bob's qubit q2
      { id: 'tel-8', gate: 'MEASURE', qubit: 2, column: 5 },
    ]
  },
  {
    id: 'grover-2qubit',
    name: "Grover's Search (2 Qubits)",
    description: "Quantum search algorithm amplifying the target state |11⟩ to 100% probability in 1 iteration",
    qubits: 2,
    classicalBits: 2,
    columns: 8,
    operations: [
      { id: 'g1', gate: 'H', qubit: 0, column: 0 },
      { id: 'g2', gate: 'H', qubit: 1, column: 0 },
      { id: 'g3', gate: 'CZ', control: 0, target: 1, column: 1 }, // Oracle for |11⟩
      { id: 'g4', gate: 'H', qubit: 0, column: 2 },
      { id: 'g5', gate: 'H', qubit: 1, column: 2 },
      { id: 'g6', gate: 'X', qubit: 0, column: 3 },
      { id: 'g7', gate: 'X', qubit: 1, column: 3 },
      { id: 'g8', gate: 'CZ', control: 0, target: 1, column: 4 }, // Diffusion operator
      { id: 'g9', gate: 'X', qubit: 0, column: 5 },
      { id: 'g10', gate: 'X', qubit: 1, column: 5 },
      { id: 'g11', gate: 'H', qubit: 0, column: 6 },
      { id: 'g12', gate: 'H', qubit: 1, column: 6 },
      { id: 'g13', gate: 'MEASURE', qubit: 0, column: 7 },
      { id: 'g14', gate: 'MEASURE', qubit: 1, column: 7 }
    ]
  }
];
