export const QUANTUM_CONCEPTS = [
  {
    id: 'qubit',
    name: 'Qubits & Basis States',
    category: 'Foundations',
    difficulty: 'Beginner',
    estimatedTime: '5 mins',
    xp: 100,
    icon: 'Atom',
    description: 'The fundamental unit of quantum information, capable of existing in state |0⟩, |1⟩, or any linear combination.',
    details: 'Unlike a classical bit which is strictly 0 or 1, a qubit exists in a two-dimensional Hilbert space represented by a state vector |ψ⟩ = α|0⟩ + β|1⟩, where |α|² + |β|² = 1.',
    initialCircuit: {
      qubits: 1,
      classicalBits: 1,
      columns: 2,
      operations: [
        { id: 'c-1', gate: 'MEASURE', qubit: 0, column: 0 }
      ]
    }
  },
  {
    id: 'superposition',
    name: 'Superposition & Hadamard',
    category: 'Foundations',
    difficulty: 'Beginner',
    estimatedTime: '8 mins',
    xp: 100,
    icon: 'Sparkles',
    description: 'A quantum state can exist as a simultaneous combination of basis states until measurement occurs.',
    details: 'Applying the Hadamard (H) gate to ground state |0⟩ maps it to (|0⟩ + |1⟩)/√2 (state |+⟩). Upon measurement, it yields |0⟩ with 50% probability and |1⟩ with 50% probability.',
    initialCircuit: {
      qubits: 1,
      classicalBits: 1,
      columns: 3,
      operations: [
        { id: 'c-1', gate: 'H', qubit: 0, column: 0 },
        { id: 'c-2', gate: 'MEASURE', qubit: 0, column: 1 }
      ]
    }
  },
  {
    id: 'measurement',
    name: 'Quantum Measurement',
    category: 'Foundations',
    difficulty: 'Beginner',
    estimatedTime: '6 mins',
    xp: 100,
    icon: 'Radio',
    description: 'Observation forces a quantum superposition to collapse irreversibly into a definite classical outcome.',
    details: 'Born\'s rule states the probability of measuring basis state |x⟩ is P(x) = |⟨x|ψ⟩|². The quantum wavefunction collapses instantaneously upon projective measurement.',
    initialCircuit: {
      qubits: 2,
      classicalBits: 2,
      columns: 3,
      operations: [
        { id: 'c-1', gate: 'H', qubit: 0, column: 0 },
        { id: 'c-2', gate: 'MEASURE', qubit: 0, column: 1 },
        { id: 'c-3', gate: 'MEASURE', qubit: 1, column: 1 }
      ]
    }
  },
  {
    id: 'quantum-gates',
    name: 'Single Qubit Gates (Pauli X, Y, Z, S, T)',
    category: 'Gates & Operations',
    difficulty: 'Intermediate',
    estimatedTime: '10 mins',
    xp: 150,
    icon: 'Cpu',
    description: 'Unitary operations that rotate the state vector around the axes of the Bloch sphere.',
    details: 'Pauli-X acts as a bit-flip (NOT), Pauli-Z as a phase-flip, while S and T apply π/2 and π/4 phase rotations, preserving quantum state normalization.',
    initialCircuit: {
      qubits: 1,
      classicalBits: 1,
      columns: 4,
      operations: [
        { id: 'c-1', gate: 'X', qubit: 0, column: 0 },
        { id: 'c-2', gate: 'H', qubit: 0, column: 1 },
        { id: 'c-3', gate: 'Z', qubit: 0, column: 2 }
      ]
    }
  },
  {
    id: 'entanglement',
    name: 'Quantum Entanglement & Bell States',
    category: 'Multi-Qubit',
    difficulty: 'Intermediate',
    estimatedTime: '12 mins',
    xp: 200,
    icon: 'Link',
    description: 'Non-classical correlation where measuring one qubit instantaneously determines the state of its entangled partner.',
    details: 'The Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2 is created by applying H on q0 followed by a CNOT gate with q0 as control and q1 as target. Neither qubit has a separable state.',
    initialCircuit: {
      qubits: 2,
      classicalBits: 2,
      columns: 4,
      operations: [
        { id: 'c-1', gate: 'H', qubit: 0, column: 0 },
        { id: 'c-2', gate: 'CX', control: 0, target: 1, column: 1 },
        { id: 'c-3', gate: 'MEASURE', qubit: 0, column: 2 },
        { id: 'c-4', gate: 'MEASURE', qubit: 1, column: 2 }
      ]
    }
  },
  {
    id: 'circuits',
    name: 'Quantum Circuits & Reversibility',
    category: 'Gates & Operations',
    difficulty: 'Intermediate',
    estimatedTime: '10 mins',
    xp: 150,
    icon: 'Activity',
    description: 'Sequences of unitary quantum gates connected on qubit wires, executing reversible quantum logic.',
    details: 'Because all quantum gates (except measurement) are unitary (U†U = I), all quantum computations are strictly reversible and preserve quantum probability information.',
    initialCircuit: {
      qubits: 2,
      classicalBits: 2,
      columns: 4,
      operations: [
        { id: 'c-1', gate: 'H', qubit: 0, column: 0 },
        { id: 'c-2', gate: 'CX', control: 0, target: 1, column: 1 },
        { id: 'c-3', gate: 'H', qubit: 0, column: 2 }
      ]
    }
  },
  {
    id: 'grover',
    name: "Grover's Search Algorithm",
    category: 'Algorithms',
    difficulty: 'Advanced',
    estimatedTime: '15 mins',
    xp: 250,
    icon: 'Search',
    description: 'Provides a quadratic speedup for searching unsorted databases in O(√N) time compared to classical O(N).',
    details: 'Alternates between an Oracle (which inverts the phase of the target marked state) and a Diffusion operator (inversion about the average), amplifying the target amplitude.',
    initialCircuit: {
      qubits: 2,
      classicalBits: 2,
      columns: 7,
      operations: [
        { id: 'g1', gate: 'H', qubit: 0, column: 0 },
        { id: 'g2', gate: 'H', qubit: 1, column: 0 },
        { id: 'g3', gate: 'CZ', control: 0, target: 1, column: 1 },
        { id: 'g4', gate: 'H', qubit: 0, column: 2 },
        { id: 'g5', gate: 'H', qubit: 1, column: 2 },
        { id: 'g6', gate: 'X', qubit: 0, column: 3 },
        { id: 'g7', gate: 'X', qubit: 1, column: 3 },
        { id: 'g8', gate: 'CZ', control: 0, target: 1, column: 4 },
        { id: 'g9', gate: 'H', qubit: 0, column: 5 },
        { id: 'g10', gate: 'H', qubit: 1, column: 5 }
      ]
    }
  },
  {
    id: 'deutsch-jozsa',
    name: 'Deutsch-Jozsa Algorithm',
    category: 'Algorithms',
    difficulty: 'Advanced',
    estimatedTime: '12 mins',
    xp: 200,
    icon: 'Scale',
    description: 'Determines whether a boolean black-box oracle is constant or balanced in a single quantum query.',
    details: 'Classically requires 2^(n-1) + 1 evaluations in the worst case. Quantum interference enables determining the global property with 100% certainty in 1 evaluation.',
    initialCircuit: {
      qubits: 2,
      classicalBits: 2,
      columns: 5,
      operations: [
        { id: 'dj1', gate: 'X', qubit: 1, column: 0 },
        { id: 'dj2', gate: 'H', qubit: 0, column: 1 },
        { id: 'dj3', gate: 'H', qubit: 1, column: 1 },
        { id: 'dj4', gate: 'CX', control: 0, target: 1, column: 2 },
        { id: 'dj5', gate: 'H', qubit: 0, column: 3 },
        { id: 'dj6', gate: 'MEASURE', qubit: 0, column: 4 }
      ]
    }
  },
  {
    id: 'teleportation',
    name: 'Quantum Teleportation',
    category: 'Protocols',
    difficulty: 'Advanced',
    estimatedTime: '15 mins',
    xp: 250,
    icon: 'Send',
    description: 'Transfers an unknown quantum state between distant qubits using shared entanglement and 2 classical bits.',
    details: 'Does not violate the no-cloning theorem or relativity: the original state on Alice is destroyed by Bell measurement, and Bob reconstructs it using classical communication.',
    initialCircuit: {
      qubits: 3,
      classicalBits: 3,
      columns: 5,
      operations: [
        { id: 'tel-1', gate: 'H', qubit: 1, column: 0 },
        { id: 'tel-2', gate: 'CX', control: 1, target: 2, column: 1 },
        { id: 'tel-3', gate: 'CX', control: 0, target: 1, column: 2 },
        { id: 'tel-4', gate: 'H', qubit: 0, column: 3 }
      ]
    }
  },
  {
    id: 'cryptography',
    name: 'Quantum Key Distribution (BB84)',
    category: 'Protocols',
    difficulty: 'Intermediate',
    estimatedTime: '10 mins',
    xp: 150,
    icon: 'Shield',
    description: 'Provably secure cryptographic key generation guaranteed by the laws of quantum physics.',
    details: 'Based on transmitting polarized single photons in conjugate bases (rectilinear and diagonal). Any eavesdropper unavoidably induces detectable disturbance.',
    initialCircuit: {
      qubits: 2,
      classicalBits: 2,
      columns: 3,
      operations: [
        { id: 'bb1', gate: 'H', qubit: 0, column: 0 },
        { id: 'bb2', gate: 'MEASURE', qubit: 0, column: 1 }
      ]
    }
  },
  {
    id: 'error-correction',
    name: 'Quantum Error Correction',
    category: 'Advanced',
    difficulty: 'Advanced',
    estimatedTime: '14 mins',
    xp: 250,
    icon: 'ShieldAlert',
    description: 'Protects fragile quantum information against decoherence and environmental noise using stabilizer codes.',
    details: 'Encodes 1 logical qubit across multiple physical qubits (e.g. 3-qubit bit-flip code, Shor 9-qubit code, surface codes) to detect and correct errors without measuring the logical state.',
    initialCircuit: {
      qubits: 3,
      classicalBits: 3,
      columns: 4,
      operations: [
        { id: 'qec1', gate: 'CX', control: 0, target: 1, column: 0 },
        { id: 'qec2', gate: 'CX', control: 0, target: 2, column: 1 }
      ]
    }
  },
  {
    id: 'bloch-geometry',
    name: 'Bloch Sphere & Phase Geometry',
    category: 'Foundations',
    difficulty: 'Intermediate',
    estimatedTime: '8 mins',
    xp: 120,
    icon: 'Compass',
    description: 'Geometrical representation of pure 2-level quantum state space on the surface of a unit sphere.',
    details: 'Points on the unit sphere correspond to pure states: North Pole is |0⟩, South Pole is |1⟩, Equator holds superpositions |+⟩, |-⟩, |+i⟩, |-i⟩. Mixed entangled states lie inside the sphere (r < 1).',
    initialCircuit: {
      qubits: 1,
      classicalBits: 1,
      columns: 3,
      operations: [
        { id: 'b1', gate: 'H', qubit: 0, column: 0 },
        { id: 'b2', gate: 'S', qubit: 0, column: 1 }
      ]
    }
  }
];
