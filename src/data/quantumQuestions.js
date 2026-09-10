export const QUANTUM_QUESTIONS = [
  // ==========================================
  // 1. QUBITS (10 Questions)
  // ==========================================
  {
    id: 'q-qubit-1',
    concept: 'qubit',
    conceptName: 'Qubits',
    difficulty: 'Beginner',
    question: 'What is the fundamental unit of quantum information called?',
    options: ['Classical bit', 'Qubit', 'Binary digit', 'Byte'],
    correctAnswer: 1,
    explanation: 'A qubit (quantum bit) is the basic unit of quantum information, analogous to the classical bit.',
    xp: 50
  },
  {
    id: 'q-qubit-2',
    concept: 'qubit',
    conceptName: 'Qubits',
    difficulty: 'Beginner',
    question: 'How many basis states define a single standard qubit?',
    options: ['One (|0⟩)', 'Two (|0⟩ and |1⟩)', 'Four', 'Infinite discrete states'],
    correctAnswer: 1,
    explanation: 'A qubit is represented in a 2D Hilbert space with standard orthonormal computational basis states |0⟩ and |1⟩.',
    xp: 50
  },
  {
    id: 'q-qubit-3',
    concept: 'qubit',
    conceptName: 'Qubits',
    difficulty: 'Beginner',
    question: 'In the state |ψ⟩ = α|0⟩ + β|1⟩, what must |α|² + |β|² equal?',
    options: ['0', '0.5', '1', '2'],
    correctAnswer: 2,
    explanation: 'Probability normalization requires that the sum of the squared magnitudes of amplitudes equals 1 (|α|² + |β|² = 1).',
    xp: 50
  },
  {
    id: 'q-qubit-4',
    concept: 'qubit',
    conceptName: 'Qubits',
    difficulty: 'Intermediate',
    question: 'What mathematical notation is standardly used to describe quantum state vectors?',
    options: ['Dirac Bra-Ket notation', 'Euler vector notation', 'Newton differential notation', 'Fourier transform notation'],
    correctAnswer: 0,
    explanation: 'Dirac notation uses ket vectors |ψ⟩ for column state vectors and bra vectors ⟨ψ| for conjugate transpose row vectors.',
    xp: 60
  },
  {
    id: 'q-qubit-5',
    concept: 'qubit',
    conceptName: 'Qubits',
    difficulty: 'Intermediate',
    question: 'How many complex amplitudes are required to describe an unentangled N-qubit quantum state?',
    options: ['N', '2N', '2^N', 'N²'],
    correctAnswer: 2,
    explanation: 'An N-qubit system exists in a Hilbert space of dimension 2^N, requiring 2^N complex probability amplitudes.',
    xp: 65
  },
  {
    id: 'q-qubit-6',
    concept: 'qubit',
    conceptName: 'Qubits',
    difficulty: 'Intermediate',
    question: 'Which physical system can serve as a physical qubit?',
    options: ['Superconducting Josephson junction', 'Trapped ion spin', 'Photon polarization', 'All of the above'],
    correctAnswer: 3,
    explanation: 'Superconducting circuits, trapped ions, and photonic polarizations are all leading physical quantum computing architectures.',
    xp: 60
  },
  {
    id: 'q-qubit-7',
    concept: 'qubit',
    conceptName: 'Qubits',
    difficulty: 'Advanced',
    question: 'What is the No-Cloning Theorem in quantum mechanics?',
    options: [
      'Identical classical bits cannot be copied',
      'An arbitrary unknown quantum state cannot be cloned exactly',
      'Quantum gates cannot be executed twice',
      'Qubits cannot be measured more than once'
    ],
    correctAnswer: 1,
    explanation: 'Because quantum operations are linear and unitary, creating an exact copy of an arbitrary unknown quantum state is mathematically impossible.',
    xp: 75
  },
  {
    id: 'q-qubit-8',
    concept: 'qubit',
    conceptName: 'Qubits',
    difficulty: 'Advanced',
    question: 'If a qubit state is |ψ⟩ = (1/2)|0⟩ + (√3/2)|1⟩, what is the probability of measuring |0⟩?',
    options: ['25% (1/4)', '50% (1/2)', '75% (3/4)', '100%'],
    correctAnswer: 0,
    explanation: 'By Born\'s rule, P(|0⟩) = |α|² = (1/2)² = 1/4 = 25%.',
    xp: 70
  },
  {
    id: 'q-qubit-9',
    concept: 'qubit',
    conceptName: 'Qubits',
    difficulty: 'Beginner',
    question: 'What is the typical default initialized state of a qubit in Qiskit?',
    options: ['|1⟩', '|0⟩', 'Equal superposition |+⟩', 'Random state'],
    correctAnswer: 1,
    explanation: 'In Qiskit and most quantum computing frameworks, all register qubits are initialized to the ground state |0⟩.',
    xp: 50
  },
  {
    id: 'q-qubit-10',
    concept: 'qubit',
    conceptName: 'Qubits',
    difficulty: 'Intermediate',
    question: 'What distinguishes a pure quantum state from a mixed quantum state?',
    options: [
      'Pure states have zero energy',
      'Pure states can be written as a single ket vector |ψ⟩; mixed states require a density matrix',
      'Mixed states contain only classical bits',
      'Pure states cannot be measured'
    ],
    correctAnswer: 1,
    explanation: 'A pure state is completely characterized by a state vector |ψ⟩ with purity Tr(ρ²) = 1, whereas mixed states represent statistical ensembles.',
    xp: 65
  },

  // ==========================================
  // 2. SUPERPOSITION (10 Questions)
  // ==========================================
  {
    id: 'q-sup-1',
    concept: 'superposition',
    conceptName: 'Superposition',
    difficulty: 'Beginner',
    question: 'What quantum gate is primarily used to create an equal superposition from |0⟩?',
    options: ['Pauli-X gate', 'Hadamard (H) gate', 'CNOT gate', 'Measurement gate'],
    correctAnswer: 1,
    explanation: 'The Hadamard (H) gate transforms the basis state |0⟩ into the symmetric superposition (|0⟩ + |1⟩)/√2.',
    xp: 50
  },
  {
    id: 'q-sup-2',
    concept: 'superposition',
    conceptName: 'Superposition',
    difficulty: 'Beginner',
    question: 'What is the standard symbol for the equal superposition state (|0⟩ + |1⟩)/√2?',
    options: ['|−⟩', '|+⟩', '|i⟩', '|00⟩'],
    correctAnswer: 1,
    explanation: 'The state (|0⟩ + |1⟩)/√2 is universally designated as the |+⟩ state (the +1 eigenstate of Pauli-X).',
    xp: 50
  },
  {
    id: 'q-sup-3',
    concept: 'superposition',
    conceptName: 'Superposition',
    difficulty: 'Beginner',
    question: 'When state |+⟩ is measured in the computational basis, what is the probability of obtaining |1⟩?',
    options: ['0%', '25%', '50%', '100%'],
    correctAnswer: 2,
    explanation: 'The amplitude of |1⟩ is 1/√2, so the probability is |1/√2|² = 1/2 = 50%.',
    xp: 50
  },
  {
    id: 'q-sup-4',
    concept: 'superposition',
    conceptName: 'Superposition',
    difficulty: 'Intermediate',
    question: 'What state is produced when a Hadamard gate is applied to |1⟩?',
    options: ['|0⟩', '|+⟩ = (|0⟩ + |1⟩)/√2', '|−⟩ = (|0⟩ − |1⟩)/√2', '|1⟩'],
    correctAnswer: 2,
    explanation: 'H|1⟩ = (|0⟩ − |1⟩)/√2 = |−⟩, which features a relative phase difference of π radians.',
    xp: 60
  },
  {
    id: 'q-sup-5',
    concept: 'superposition',
    conceptName: 'Superposition',
    difficulty: 'Intermediate',
    question: 'What happens if you apply a Hadamard gate twice consecutively to a qubit (H · H)?',
    options: [
      'The qubit collapses to 0',
      'The state flips to |1⟩',
      'The qubit returns to its original state (H is self-inverse)',
      'The qubit becomes maximally mixed'
    ],
    correctAnswer: 2,
    explanation: 'H is unitary and Hermitian, meaning H = H† = H⁻¹. Therefore H · H = I (the identity matrix).',
    xp: 60
  },
  {
    id: 'q-sup-6',
    concept: 'superposition',
    conceptName: 'Superposition',
    difficulty: 'Intermediate',
    question: 'Where do equal superposition states (like |+⟩, |−⟩, |+i⟩, |−i⟩) lie on the Bloch Sphere?',
    options: ['At the North Pole', 'At the South Pole', 'Along the Equator (XY plane)', 'At the origin center'],
    correctAnswer: 2,
    explanation: 'Equal superposition states have θ = π/2, placing their Bloch vectors precisely on the equatorial plane.',
    xp: 65
  },
  {
    id: 'q-sup-7',
    concept: 'superposition',
    conceptName: 'Superposition',
    difficulty: 'Advanced',
    question: 'If you apply H gates to all N qubits initialized to |0...0⟩, how many basis states are in superposition?',
    options: ['N states', '2N states', '2^N states with equal 1/2^N probability', 'N² states'],
    correctAnswer: 2,
    explanation: 'H^(⊗N)|0...0⟩ produces an equal superposition across all 2^N computational basis states with amplitude 1/√(2^N).',
    xp: 70
  },
  {
    id: 'q-sup-8',
    concept: 'superposition',
    conceptName: 'Superposition',
    difficulty: 'Advanced',
    question: 'In quantum interference, how do probability amplitudes differ from classical probabilities?',
    options: [
      'Quantum amplitudes can be negative or complex, allowing destructive cancellation',
      'Quantum probabilities can exceed 100%',
      'Amplitudes cannot be calculated mathematically',
      'Amplitudes are always purely real numbers'
    ],
    correctAnswer: 0,
    explanation: 'Because quantum amplitudes are complex numbers, they can cancel each other out destructively or reinforce constructively.',
    xp: 75
  },
  {
    id: 'q-sup-9',
    concept: 'superposition',
    conceptName: 'Superposition',
    difficulty: 'Beginner',
    question: 'Does placing a qubit into superposition mean it is secretly 0 or 1 before measurement?',
    options: [
      'Yes, it is always a hidden 0 or 1',
      'No, it genuinely exists in a linear combination of both states simultaneously',
      'It depends on the wire length',
      'Only if it is simulated on a classical computer'
    ],
    correctAnswer: 1,
    explanation: 'Quantum mechanics demonstrates (via Bell inequalities) that qubits do not possess predetermined values before measurement.',
    xp: 50
  },
  {
    id: 'q-sup-10',
    concept: 'superposition',
    conceptName: 'Superposition',
    difficulty: 'Intermediate',
    question: 'What is the matrix representation of the Hadamard gate?',
    options: [
      '[[0, 1], [1, 0]]',
      '(1/√2) [[1, 1], [1, -1]]',
      '[[1, 0], [0, -1]]',
      '[[1, 0], [0, i]]'
    ],
    correctAnswer: 1,
    explanation: 'The Hadamard matrix is (1/√2) [[1, 1], [1, -1]].',
    xp: 65
  },

  // ==========================================
  // 3. MEASUREMENT (10 Questions)
  // ==========================================
  {
    id: 'q-meas-1',
    concept: 'measurement',
    conceptName: 'Measurement',
    difficulty: 'Beginner',
    question: 'What happens to a qubit in superposition when it is measured in the computational basis?',
    options: [
      'It stays in superposition permanently',
      'It collapses into either |0⟩ or |1⟩ with associated probability',
      'It is automatically deleted',
      'It duplicates itself'
    ],
    correctAnswer: 1,
    explanation: 'Measurement triggers wavefunction collapse, projecting the superposition into a definite basis state |0⟩ or |1⟩.',
    xp: 50
  },
  {
    id: 'q-meas-2',
    concept: 'measurement',
    conceptName: 'Measurement',
    difficulty: 'Beginner',
    question: 'Which physical rule calculates outcome probabilities from quantum state amplitudes?',
    options: ['Newton\'s First Law', 'Born\'s Rule (P = |amplitude|²)', 'Ohm\'s Law', 'Coulomb\'s Law'],
    correctAnswer: 1,
    explanation: 'Born\'s rule states the probability of obtaining eigenvalue outcome λ is given by the squared magnitude of its amplitude.',
    xp: 50
  },
  {
    id: 'q-meas-3',
    concept: 'measurement',
    conceptName: 'Measurement',
    difficulty: 'Intermediate',
    question: 'Can you measure a quantum state without altering or disturbing it?',
    options: [
      'Yes, by using low-power classical sensors',
      'No, projective measurement inevitably disturbs superpositions not aligned with the measurement basis',
      'Yes, by measuring twice quickly',
      'Only on superconducting hardware'
    ],
    correctAnswer: 1,
    explanation: 'The act of measurement in quantum physics is inherently non-demolition only for eigenstates of the measurement observable.',
    xp: 60
  },
  {
    id: 'q-meas-4',
    concept: 'measurement',
    conceptName: 'Measurement',
    difficulty: 'Beginner',
    question: 'In Qiskit, where are quantum measurement outcomes stored?',
    options: ['In quantum registers', 'In classical register bits (cbits)', 'In the CPU cache', 'In Python global memory'],
    correctAnswer: 1,
    explanation: 'Quantum measurements convert quantum state projections into discrete classical bits stored in ClassicalRegister / cbit arrays.',
    xp: 50
  },
  {
    id: 'q-meas-5',
    concept: 'measurement',
    conceptName: 'Measurement',
    difficulty: 'Intermediate',
    question: 'Why do quantum simulators execute multiple "shots" (e.g., 1024 shots)?',
    options: [
      'To build a statistically significant histogram of probabilistic measurement outcomes',
      'Because quantum hardware is slow',
      'To verify CPU clock speed',
      'To re-cool the quantum processor'
    ],
    correctAnswer: 0,
    explanation: 'Because a single measurement returns only one collapsed bitstring, multiple shots are required to reconstruct empirical probability distributions.',
    xp: 60
  },
  {
    id: 'q-meas-6',
    concept: 'measurement',
    conceptName: 'Measurement',
    difficulty: 'Intermediate',
    question: 'If state |0⟩ is measured in the standard computational basis Z, what is the outcome probability?',
    options: ['100% chance of 0', '50% chance of 0, 50% chance of 1', '100% chance of 1', 'Undefined'],
    correctAnswer: 0,
    explanation: '|0⟩ is an exact eigenstate of the computational Z basis with eigenvalue +1, so measurement yields 0 with 100% certainty.',
    xp: 55
  },
  {
    id: 'q-meas-7',
    concept: 'measurement',
    conceptName: 'Measurement',
    difficulty: 'Advanced',
    question: 'How do you measure a qubit in the X basis (|+⟩ / |−⟩) using standard Z-basis measurement?',
    options: [
      'Apply an X gate before measurement',
      'Apply a Hadamard (H) gate immediately before Z-measurement',
      'Apply a Z gate before measurement',
      'Measurement in the X basis is impossible'
    ],
    correctAnswer: 1,
    explanation: 'Since H maps |+⟩ → |0⟩ and |−⟩ → |1⟩, applying H changes the basis so standard Z measurement measures in the X basis.',
    xp: 70
  },
  {
    id: 'q-meas-8',
    concept: 'measurement',
    conceptName: 'Measurement',
    difficulty: 'Advanced',
    question: 'What is the Quantum Zeno Effect?',
    options: [
      'Qubits teleport faster when measured',
      'Frequent, rapid measurements can freeze the dynamical evolution of a quantum system',
      'Measurement speeds up gate execution',
      'Phase angles flip during measurement'
    ],
    correctAnswer: 1,
    explanation: 'Repeatedly measuring a quantum system at very short time intervals continuously collapses it back to the initial state, inhibiting transitions.',
    xp: 75
  },
  {
    id: 'q-meas-9',
    concept: 'measurement',
    conceptName: 'Measurement',
    difficulty: 'Beginner',
    question: 'What is the measurement operator symbol typically shown on circuit wires?',
    options: ['H', 'X', 'A meter/gauge dial icon (M)', 'A spiral icon'],
    correctAnswer: 2,
    explanation: 'In quantum circuit diagrams, measurement is standardly depicted as a meter/dial symbol with an output wire connecting to classical bits.',
    xp: 50
  },
  {
    id: 'q-meas-10',
    concept: 'measurement',
    conceptName: 'Measurement',
    difficulty: 'Intermediate',
    question: 'Is quantum measurement a reversible unitary operation?',
    options: [
      'Yes, like all quantum operations',
      'No, measurement is non-unitary and non-reversible (projection)',
      'Yes, by applying an inverse measurement gate',
      'Only for two-qubit circuits'
    ],
    correctAnswer: 1,
    explanation: 'Unlike unitary gates (U†U = I), projective measurement collapses the wavefunction, destroying phase information irreversibly.',
    xp: 65
  },

  // ==========================================
  // 4. QUANTUM GATES (10 Questions)
  // ==========================================
  {
    id: 'q-gate-1',
    concept: 'gates',
    conceptName: 'Quantum Gates',
    difficulty: 'Beginner',
    question: 'What does the Pauli-X gate do to basis state |0⟩?',
    options: ['Leaves it unchanged', 'Flips it to |1⟩', 'Puts it into superposition', 'Destroys it'],
    correctAnswer: 1,
    explanation: 'The Pauli-X gate is the quantum analogue of the classical NOT gate, mapping |0⟩ → |1⟩ and |1⟩ → |0⟩.',
    xp: 50
  },
  {
    id: 'q-gate-2',
    concept: 'gates',
    conceptName: 'Quantum Gates',
    difficulty: 'Beginner',
    question: 'What operation does the Pauli-Z gate perform on state |1⟩?',
    options: ['Bit-flip to |0⟩', 'Phase-flip to −|1⟩', 'Rotates to |+⟩', 'No change'],
    correctAnswer: 1,
    explanation: 'Pauli-Z leaves |0⟩ unchanged (Z|0⟩ = |0⟩) and introduces a π phase flip to |1⟩ (Z|1⟩ = −|1⟩).',
    xp: 50
  },
  {
    id: 'q-gate-3',
    concept: 'gates',
    conceptName: 'Quantum Gates',
    difficulty: 'Intermediate',
    question: 'What is the phase angle applied to |1⟩ by the S gate?',
    options: ['π (180°)', 'π/2 (90°)', 'π/4 (45°)', '2π (360°)'],
    correctAnswer: 1,
    explanation: 'The S gate is the √Z gate, applying a phase factor of e^(iπ/2) = i to the |1⟩ state.',
    xp: 60
  },
  {
    id: 'q-gate-4',
    concept: 'gates',
    conceptName: 'Quantum Gates',
    difficulty: 'Intermediate',
    question: 'What phase angle does the T gate apply to |1⟩?',
    options: ['π/2 (90°)', 'π/4 (45°)', 'π/8 (22.5°)', 'π (180°)'],
    correctAnswer: 1,
    explanation: 'The T gate applies a π/4 rotation around the Z-axis, with matrix diag(1, e^(iπ/4)).',
    xp: 60
  },
  {
    id: 'q-gate-5',
    concept: 'gates',
    conceptName: 'Quantum Gates',
    difficulty: 'Beginner',
    question: 'What does the Identity gate (I) do?',
    options: ['Flips the qubit', 'Applies random phase', 'Leaves the qubit state unchanged (NOP)', 'Measures the qubit'],
    correctAnswer: 2,
    explanation: 'The Identity gate I is a no-operation (NOP) that performs no change on the quantum state vector.',
    xp: 50
  },
  {
    id: 'q-gate-6',
    concept: 'gates',
    conceptName: 'Quantum Gates',
    difficulty: 'Intermediate',
    question: 'Which condition must all valid quantum logic gates satisfy?',
    options: ['They must be symmetric', 'They must be unitary (U† · U = I)', 'They must be classical', 'They must have non-zero determinant = 0'],
    correctAnswer: 1,
    explanation: 'Quantum gates must be unitary to preserve the inner product and ensure total probability remains exactly 1.',
    xp: 65
  },
  {
    id: 'q-gate-7',
    concept: 'gates',
    conceptName: 'Quantum Gates',
    difficulty: 'Advanced',
    question: 'What single-qubit gate combination produces the Pauli-Z gate from X and H?',
    options: ['H · X · H', 'X · H · X', 'H · H · X', 'X · X · H'],
    correctAnswer: 0,
    explanation: 'Because H changes basis between computational (Z) and transversal (X), H · X · H = Z.',
    xp: 75
  },
  {
    id: 'q-gate-8',
    concept: 'gates',
    conceptName: 'Quantum Gates',
    difficulty: 'Intermediate',
    question: 'What is the SWAP gate used for in quantum circuits?',
    options: [
      'Exchanging the quantum states of two qubits',
      'Swapping classical bits with qubits',
      'Inverting phase',
      'Resetting all qubits'
    ],
    correctAnswer: 0,
    explanation: 'The SWAP gate exchanges the states of two qubits: SWAP|a, b⟩ = |b, a⟩. It can be built from 3 CNOT gates.',
    xp: 60
  },
  {
    id: 'q-gate-9',
    concept: 'gates',
    conceptName: 'Quantum Gates',
    difficulty: 'Advanced',
    question: 'What set of quantum gates constitutes a universal quantum gate set?',
    options: [
      'Only NOT and AND gates',
      '{H, T, CNOT}',
      'Only Pauli gates {X, Y, Z}',
      '{H, I, Measure}'
    ],
    correctAnswer: 1,
    explanation: 'The Clifford+T gate set {H, S, CNOT, T} (or {H, T, CNOT}) is proven universal for quantum computation by the Solovay-Kitaev theorem.',
    xp: 75
  },
  {
    id: 'q-gate-10',
    concept: 'gates',
    conceptName: 'Quantum Gates',
    difficulty: 'Beginner',
    question: 'On the Bloch sphere, what does applying the Pauli-X gate correspond to geometrically?',
    options: [
      'A 180° (π) rotation around the X-axis',
      'A 90° rotation around the Z-axis',
      'A shift of the sphere center',
      'Collapsing to the origin'
    ],
    correctAnswer: 0,
    explanation: 'Pauli-X corresponds to a π radian (180°) rotation about the X-axis of the Bloch sphere, flipping North (+Z) to South (-Z).',
    xp: 50
  },

  // ==========================================
  // 5. ENTANGLEMENT & MULTI-QUBIT (10 Questions)
  // ==========================================
  {
    id: 'q-ent-1',
    concept: 'entanglement',
    conceptName: 'Entanglement',
    difficulty: 'Beginner',
    question: 'What gate is primarily used as the two-qubit entangling gate in the Bell State circuit?',
    options: ['Controlled-NOT (CNOT / CX)', 'Pauli-Z gate', 'Identity gate', 'Reset gate'],
    correctAnswer: 0,
    explanation: 'CNOT (CX) flips the target qubit if the control qubit is |1⟩, generating entanglement when paired with a superposition.',
    xp: 50
  },
  {
    id: 'q-ent-2',
    concept: 'entanglement',
    conceptName: 'Entanglement',
    difficulty: 'Beginner',
    question: 'In the Bell State (|00⟩ + |11⟩)/√2, if the first qubit is measured as 0, what state is the second qubit in?',
    options: ['Definitely 0', 'Definitely 1', '50% 0 and 50% 1', 'Unknown'],
    correctAnswer: 0,
    explanation: 'Measuring the first qubit as 0 instantaneously collapses the entangled pair into the |00⟩ state, so the second qubit is guaranteed to be 0.',
    xp: 50
  },
  {
    id: 'q-ent-3',
    concept: 'entanglement',
    conceptName: 'Entanglement',
    difficulty: 'Beginner',
    question: 'What measurement outcomes are possible for the Bell state (|00⟩ + |11⟩)/√2?',
    options: ['|00⟩ (50%) and |11⟩ (50%)', '|01⟩ (50%) and |10⟩ (50%)', 'All four states equally (25% each)', 'Only |00⟩ (100%)'],
    correctAnswer: 0,
    explanation: 'The state has zero amplitude for |01⟩ and |10⟩, so only correlated outcomes |00⟩ and |11⟩ occur, each with 50% probability.',
    xp: 50
  },
  {
    id: 'q-ent-4',
    concept: 'entanglement',
    conceptName: 'Entanglement',
    difficulty: 'Intermediate',
    question: 'What famous phrase did Albert Einstein use to express his skepticism of quantum entanglement?',
    options: [
      '"Spooky action at a distance"',
      '"The uncertainty principle"',
      '"God does not play with circuits"',
      '"Relativistic paradox"'
    ],
    correctAnswer: 0,
    explanation: 'Einstein referred to quantum entanglement as "spooky action at a distance" (spukhafte Fernwirkung) in the 1935 EPR paper.',
    xp: 55
  },
  {
    id: 'q-ent-5',
    concept: 'entanglement',
    conceptName: 'Entanglement',
    difficulty: 'Intermediate',
    question: 'How many distinct orthogonal Bell states exist for two qubits?',
    options: ['Two', 'Four (|Φ⁺⟩, |Φ⁻⟩, |Ψ⁺⟩, |Ψ⁻⟩)', 'Eight', 'Sixteen'],
    correctAnswer: 1,
    explanation: 'The four maximally entangled Bell basis states are |Φ±⟩ = (|00⟩ ± |11⟩)/√2 and |Ψ±⟩ = (|01⟩ ± |10⟩)/√2.',
    xp: 60
  },
  {
    id: 'q-ent-6',
    concept: 'entanglement',
    conceptName: 'Entanglement',
    difficulty: 'Intermediate',
    question: 'What happens to the single-qubit Bloch vector of a qubit that is maximally entangled with another?',
    options: [
      'It points towards the North Pole',
      'Its length shrinks to zero (r = 0), collapsing to the center of the sphere',
      'It spins continuously at light speed',
      'It expands outside the unit sphere'
    ],
    correctAnswer: 1,
    explanation: 'An entangled qubit has a maximally mixed reduced density matrix (ρ = I/2), meaning its Bloch vector length is r = 0.',
    xp: 65
  },
  {
    id: 'q-ent-7',
    concept: 'entanglement',
    conceptName: 'Entanglement',
    difficulty: 'Advanced',
    question: 'What physical test definitively ruled out local hidden-variable theories in favor of quantum entanglement?',
    options: [
      'The Michelson-Morley Experiment',
      'Bell Inequality Violation experiments',
      'The Millikan Oil Drop Experiment',
      'Cavendish Experiment'
    ],
    correctAnswer: 1,
    explanation: 'Experimental violations of Bell\'s inequality (honored by the 2022 Nobel Prize) prove nature cannot be described by local realism.',
    xp: 75
  },
  {
    id: 'q-ent-8',
    concept: 'entanglement',
    conceptName: 'Entanglement',
    difficulty: 'Advanced',
    question: 'Can quantum entanglement be used to transmit classical information faster than the speed of light?',
    options: [
      'Yes, it enables instantaneous communication',
      'No, because individual measurement outcomes are strictly random (No-Communication Theorem)',
      'Only over distances less than 1 light-year',
      'Yes, by using cryogenic repeaters'
    ],
    correctAnswer: 1,
    explanation: 'By the No-Communication Theorem, local measurement statistics remain completely unaffected by distant operations without a classical channel.',
    xp: 75
  },
  {
    id: 'q-ent-9',
    concept: 'entanglement',
    conceptName: 'Entanglement',
    difficulty: 'Beginner',
    question: 'What is the minimal circuit to create the Bell State |Φ⁺⟩ from |00⟩?',
    options: [
      'H on q0, followed by CNOT(control=q0, target=q1)',
      'X on q0, followed by X on q1',
      'CNOT on q0 and q1 without Hadamard',
      'H on q0 and H on q1'
    ],
    correctAnswer: 0,
    explanation: '|00⟩ --(H on q0)--> (|0⟩+|1⟩)|0⟩/√2 = (|00⟩+|10⟩)/√2 --(CX)--> (|00⟩+|11⟩)/√2.',
    xp: 50
  },
  {
    id: 'q-ent-10',
    concept: 'entanglement',
    conceptName: 'Entanglement',
    difficulty: 'Intermediate',
    question: 'What is the 3-qubit maximally entangled state (|000⟩ + |111⟩)/√2 called?',
    options: ['W-State', 'GHZ State (Greenberger-Horne-Zeilinger)', 'Cluster State', 'Shor State'],
    correctAnswer: 1,
    explanation: 'The GHZ state is the canonical multi-qubit maximally entangled state showing non-local correlations across 3 or more qubits.',
    xp: 65
  },

  // ==========================================
  // 6. ALGORITHMS (Grover, Deutsch-Jozsa, Teleportation) (10 Questions)
  // ==========================================
  {
    id: 'q-alg-1',
    concept: 'algorithms',
    conceptName: 'Algorithms',
    difficulty: 'Intermediate',
    question: 'What speedup does Grover\'s search algorithm achieve over classical unsorted search?',
    options: ['Exponential speedup (O(log N))', 'Quadratic speedup (O(√N) vs O(N))', 'Polynomial O(N²)', 'Linear speedup (2x)'],
    correctAnswer: 1,
    explanation: 'Grover\'s algorithm finds a marked item in an unsorted database of N entries in O(√N) steps compared to classical O(N).',
    xp: 65
  },
  {
    id: 'q-alg-2',
    concept: 'algorithms',
    conceptName: 'Algorithms',
    difficulty: 'Intermediate',
    question: 'What are the two core alternating steps in Grover\'s algorithm?',
    options: [
      'Oracle (phase inversion) and Diffusion operator (inversion about the average)',
      'Measurement and Reset',
      'Bit flip and Phase flip',
      'Hadamard and CNOT'
    ],
    correctAnswer: 0,
    explanation: 'Grover repeats: (1) Oracle marks target by flipping its sign, and (2) Diffusion amplifies the marked amplitude above the mean.',
    xp: 70
  },
  {
    id: 'q-alg-3',
    concept: 'algorithms',
    conceptName: 'Algorithms',
    difficulty: 'Advanced',
    question: 'How many query evaluations does the Deutsch-Jozsa algorithm need to determine if a function is constant or balanced?',
    options: ['1 evaluation', '2^(n-1) evaluations', '2^n evaluations', 'n evaluations'],
    correctAnswer: 0,
    explanation: 'Deutsch-Jozsa evaluates the oracle just ONCE using quantum superposition and constructive/destructive interference.',
    xp: 75
  },
  {
    id: 'q-alg-4',
    concept: 'algorithms',
    conceptName: 'Algorithms',
    difficulty: 'Intermediate',
    question: 'How many classical bits must be transmitted to complete Quantum Teleportation of 1 qubit state?',
    options: ['0 bits', '1 bit', '2 classical bits', '4 classical bits'],
    correctAnswer: 2,
    explanation: 'Alice performs a Bell measurement yielding 2 classical bits, which she transmits to Bob so he can apply the proper Pauli correction (I, X, Z, or XZ).',
    xp: 65
  },
  {
    id: 'q-alg-5',
    concept: 'algorithms',
    conceptName: 'Algorithms',
    difficulty: 'Beginner',
    question: 'Does quantum teleportation transport physical matter or energy across space?',
    options: [
      'Yes, it teleports atoms physically',
      'No, it transfers only the quantum state information onto a recipient qubit',
      'Only over fiber optic cables',
      'Yes, like sci-fi transporters'
    ],
    correctAnswer: 1,
    explanation: 'Quantum teleportation transfers quantum state information (|ψ⟩) between qubits using entanglement and classical signaling, not physical matter.',
    xp: 50
  },
  {
    id: 'q-alg-6',
    concept: 'algorithms',
    conceptName: 'Algorithms',
    difficulty: 'Advanced',
    question: 'In 2-qubit Grover\'s search, how many iterations achieve 100% probability of measuring the target state?',
    options: ['Exactly 1 iteration', '2 iterations', '4 iterations', '√N iterations'],
    correctAnswer: 0,
    explanation: 'For N = 4 (2 qubits), π/4 · √4 = π/2 ≈ 1 iteration rotates the state vector exactly onto the target marked basis state.',
    xp: 75
  },
  {
    id: 'q-alg-7',
    concept: 'algorithms',
    conceptName: 'Algorithms',
    difficulty: 'Intermediate',
    question: 'What does Shor\'s Algorithm solve in polynomial time on a quantum computer?',
    options: [
      'Traveling Salesman Problem',
      'Prime integer factorization and discrete logarithms',
      'Chess move optimization',
      'Database indexing'
    ],
    correctAnswer: 1,
    explanation: 'Peter Shor\'s 1994 algorithm factors large integers in O((log N)³) time, threatening classical RSA public-key encryption.',
    xp: 70
  },
  {
    id: 'q-alg-8',
    concept: 'algorithms',
    conceptName: 'Algorithms',
    difficulty: 'Advanced',
    question: 'What quantum primitive forms the mathematical core of Shor\'s algorithm?',
    options: ['Quantum Fourier Transform (QFT) for period finding', 'Grover diffusion', 'Bell state analyzer', 'Teleportation channel'],
    correctAnswer: 0,
    explanation: 'The Quantum Fourier Transform efficiently finds the period r of modular exponentiation f(x) = a^x mod N.',
    xp: 80
  },
  {
    id: 'q-alg-9',
    concept: 'algorithms',
    conceptName: 'Algorithms',
    difficulty: 'Intermediate',
    question: 'In Deutsch-Jozsa, what does measuring |00...0⟩ at the output indicate?',
    options: ['The oracle function is Constant', 'The oracle function is Balanced', 'The circuit failed', 'The function is non-deterministic'],
    correctAnswer: 0,
    explanation: 'Constructive interference at |0...0⟩ occurs if and only if the oracle function f(x) is Constant (returns the same value for all inputs).',
    xp: 65
  },
  {
    id: 'q-alg-10',
    concept: 'algorithms',
    conceptName: 'Algorithms',
    difficulty: 'Advanced',
    question: 'What is the Phase Kickback mechanism in quantum algorithms?',
    options: [
      'A hardware error when gates run too fast',
      'An eigenvalue phase produced by target register operation being kicked back into the control qubit',
      'Loss of coherence to the ground state',
      'Resetting a phase register'
    ],
    correctAnswer: 1,
    explanation: 'Phase kickback occurs when an operator acting on an eigenstate transfers its phase factor onto the control qubit.',
    xp: 75
  }
];
