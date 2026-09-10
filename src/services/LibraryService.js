// Library Service Abstraction for E-Library Module
// Manages documents, study modules, research papers, and textbook references.
// Structured for seamless integration with FastAPI / Supabase / PostgreSQL backends.

export const SAMPLE_DOCUMENTS = [
  {
    id: 'doc-quantum-basics',
    title: 'Quantum Computing: From Bits to Qubits',
    subject: 'Quantum Basics',
    category: 'Quantum Basics',
    difficulty: 'Beginner',
    description: 'Foundational textbook on 2-level Hilbert spaces, superposition, Dirac bra-ket notation, and Born\'s measurement rule.',
    author: 'Quantum Learn Academic Board',
    pages: 48,
    readTime: '20 min',
    tags: ['Qubits', 'Superposition', 'Bloch Sphere', 'Dirac Notation'],
    thumbnailBg: 'from-cyan-500/20 to-blue-600/20',
    iconColor: 'text-cyan-400',
    rating: 4.9,
    content: `# Quantum Computing: From Bits to Qubits

## 1. The Classical Bit vs. The Quantum Qubit
In classical computing, a bit is deterministic and binary: $b \\in \\{0, 1\\}$. In quantum information, a qubit exists as a state vector $|\\psi\\rangle$ in a two-dimensional complex Hilbert space $\\mathcal{H}_2$:
$$|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$$
where $\\alpha, \\beta \\in \\mathbb{C}$ and the total probability normalization satisfies:
$$|\\alpha|^2 + |\\beta|^2 = 1$$

## 2. The Bloch Sphere
Any pure single-qubit state can be represented as a point on the surface of a three-dimensional unit sphere called the **Bloch Sphere**:
$$|\\psi\\rangle = \\cos\\left(\\frac{\\theta}{2}\\right)|0\\rangle + e^{i\\phi}\\sin\\left(\\frac{\\theta}{2}\\right)|1\\rangle$$
where:
- $\\theta \\in [0, \\pi]$ denotes the polar angle.
- $\\phi \\in [0, 2\\pi)$ denotes the azimuthal relative phase angle.`
  },
  {
    id: 'doc-quantum-algorithms',
    title: 'Grover\'s Algorithm & Amplitude Amplification',
    subject: 'Quantum Algorithms',
    category: 'Quantum Algorithms',
    difficulty: 'Advanced',
    description: 'Detailed mathematical treatment of Grover\'s quadratic database search algorithm and quantum phase kickback.',
    author: 'Lov K. Grover / Bell Labs & SIH',
    pages: 34,
    readTime: '25 min',
    tags: ['Grover', 'Amplitude Amplification', 'Oracle', 'Diffusion'],
    thumbnailBg: 'from-purple-500/20 to-indigo-600/20',
    iconColor: 'text-purple-400',
    rating: 5.0,
    content: `# Grover's Algorithm & Amplitude Amplification

## 1. Problem Formulation
Given an unsorted search space of $N = 2^n$ elements and an unknown target $x^*$, a classical algorithm must check on average $N/2$ elements and in the worst case $N$ elements ($O(N)$). Grover's algorithm finds $x^*$ in:
$$O(\\sqrt{N})$$
steps with probability approaching 100%.

## 2. The Two Operators
1. **The Phase Oracle ($U_f$)**: Marks the target state by flipping its sign:
$$U_f|x\\rangle = (-1)^{f(x)}|x\\rangle$$
2. **The Diffusion Operator ($D$)**: Inverts amplitudes around their mean:
$$D = 2|s\\rangle\\langle s| - I = H^{\\otimes n}(2|0\\rangle\\langle 0| - I)H^{\\otimes n}$$`
  },
  {
    id: 'doc-qiskit-programming',
    title: 'Qiskit Quantum Circuit SDK Handbook',
    subject: 'Qiskit',
    category: 'Qiskit',
    difficulty: 'Intermediate',
    description: 'Complete hands-on programmer guide for building circuits, transpiling, and executing on Qiskit Aer simulators.',
    author: 'IBM Quantum Community & Neural Nomads',
    pages: 52,
    readTime: '30 min',
    tags: ['Qiskit', 'Python', 'Transpiler', 'QuantumCircuit'],
    thumbnailBg: 'from-indigo-500/20 to-cyan-600/20',
    iconColor: 'text-indigo-400',
    rating: 4.8,
    content: `# Qiskit Quantum Circuit SDK Handbook

## 1. Initializing Quantum Circuits
\`\`\`python
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

# Create a circuit with 2 qubits and 2 classical bits
qc = QuantumCircuit(2, 2)

# Apply Hadamard on q0 and CNOT from q0 to q1 (Bell State)
qc.h(0)
qc.cx(0, 1)

# Measure all qubits into classical bits
qc.measure([0, 1], [0, 1])
\`\`\`

## 2. Simulating with Qiskit Aer
\`\`\`python
simulator = AerSimulator()
job = simulator.run(qc, shots=1024)
result = job.result()
counts = result.get_counts(qc)
print(counts)  # Expect approx {'00': 512, '11': 512}
\`\`\``
  },
  {
    id: 'doc-quantum-physics',
    title: 'EPR Paradox, Bell Inequalities & Entanglement',
    subject: 'Quantum Physics',
    category: 'Quantum Physics',
    difficulty: 'Intermediate',
    description: 'Historical and mathematical analysis of Einstein-Podolsky-Rosen (EPR) thought experiment and John Bell\'s seminal theorem.',
    author: 'John S. Bell & Alain Aspect',
    pages: 40,
    readTime: '22 min',
    tags: ['EPR', 'Bell State', 'CHSH', 'Entanglement'],
    thumbnailBg: 'from-pink-500/20 to-rose-600/20',
    iconColor: 'text-pink-400',
    rating: 4.9,
    content: `# EPR Paradox & Bell Inequalities

## 1. The EPR Dilemma (1935)
Einstein, Podolsky, and Rosen argued that if quantum mechanics cannot assign simultaneous definite values to non-commuting observables, it must be an "incomplete" theory described by hidden variables.

## 2. Bell's Theorem (1964)
John Stewart Bell proved mathematically that **no physical theory of local hidden variables can ever reproduce all the statistical predictions of quantum mechanics**.
The CHSH inequality:
$$|S| \\le 2 \\quad \\text{(Classical Bound)}$$
Quantum mechanics violates this bound up to the Tsirelson limit:
$$S = 2\\sqrt{2} \\approx 2.828 > 2$$`
  },
  {
    id: 'doc-quantum-programming',
    title: 'Quantum Algorithms & Complexity Theory',
    subject: 'Quantum Programming',
    category: 'Quantum Programming',
    difficulty: 'Advanced',
    description: 'Exploration of BQP (Bounded-Error Quantum Polynomial-Time), Shor\'s factoring, and quantum advantage benchmarks.',
    author: 'Scott Aaronson / MIT & UT Austin',
    pages: 64,
    readTime: '35 min',
    tags: ['BQP', 'Complexity', 'Shor', 'Quantum Supremacy'],
    thumbnailBg: 'from-emerald-500/20 to-teal-600/20',
    iconColor: 'text-emerald-400',
    rating: 5.0,
    content: `# Quantum Algorithms & Complexity Theory

## 1. The BQP Complexity Class
**BQP** denotes the class of decision problems solvable by a polynomial-time quantum algorithm with an error probability at most $1/3$:
$$P \\subseteq BPP \\subseteq BQP \\subseteq PSPACE$$

## 2. Shor's Factoring Algorithm
Classically, the best known general integer factoring algorithm is the General Number Field Sieve (GNFS), which runs in sub-exponential time:
$$O\\left(\\exp\\left(\\sqrt[3]{\\frac{64}{9} n (\\log n)^2}\\right)\\right)$$
Peter Shor's algorithm solves factoring in polynomial time:
$$O(n^3)$$
utilizing the Quantum Fourier Transform (QFT) to compute the modular order $r$ of $a^r \\equiv 1 \\pmod N$.`
  },
  {
    id: 'doc-research-teleportation',
    title: 'Experimental Quantum Teleportation (Bennett et al.)',
    subject: 'Research Papers',
    category: 'Research Papers',
    difficulty: 'Advanced',
    description: 'Foundational research paper outlining the exact 3-qubit protocol for transferring unknown states via EPR channels.',
    author: 'C. H. Bennett, G. Brassard, et al. (Physical Review Letters)',
    pages: 28,
    readTime: '18 min',
    tags: ['Teleportation', 'EPR', 'No-Cloning', 'Protocol'],
    thumbnailBg: 'from-blue-500/20 to-cyan-600/20',
    iconColor: 'text-blue-400',
    rating: 4.9,
    content: `# Experimental Quantum Teleportation

## 1. Protocol Architecture
Alice wishes to transmit an unknown quantum state $|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$ on qubit 0 to Bob.
1. Alice and Bob share an entangled Bell pair on qubits 1 and 2:
$$|\\Phi^+\\rangle_{12} = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$$
2. Alice applies a CNOT on qubits 0 and 1, followed by a Hadamard on qubit 0.
3. Alice measures qubits 0 and 1 in the computational basis, obtaining 2 classical bits: $b_0, b_1$.
4. Alice transmits $b_0, b_1$ to Bob over a classical channel.
5. Bob applies conditional unitary corrections:
   - \`00\`: $I$ (no change)
   - \`01\`: $X$ (bit flip)
   - \`10\`: $Z$ (phase flip)
   - \`11\`: $XZ$ (bit and phase flip)
Bob's qubit 2 is now in the exact state $|\\psi\\rangle$!`
  },
  {
    id: 'doc-textbook-nielsen-chuang',
    title: 'Quantum Computation and Quantum Information',
    subject: 'Textbooks',
    category: 'Textbooks',
    difficulty: 'Advanced',
    description: 'Standard university textbook (Mike & Ike) covering universal quantum gates, density matrices, and error correction.',
    author: 'Michael A. Nielsen & Isaac L. Chuang (Cambridge University Press)',
    pages: 90,
    readTime: '45 min',
    tags: ['Textbook', 'Universal Gates', 'Density Matrix', 'QEC'],
    thumbnailBg: 'from-amber-500/20 to-purple-600/20',
    iconColor: 'text-amber-400',
    rating: 5.0,
    content: `# Quantum Computation and Quantum Information

## 1. The Postulates of Quantum Mechanics
1. **Postulate 1 (State Space)**: Any isolated physical system is associated with a complex Hilbert space $\\mathcal{H}$.
2. **Postulate 2 (Evolution)**: The evolution of a closed quantum system is described by a unitary transformation $U$: $|\\psi'\\rangle = U|\\psi\\rangle$.
3. **Postulate 3 (Quantum Measurement)**: Quantum measurements are described by a collection $\\{M_m\\}$ of measurement operators acting on state space $\\mathcal{H}$:
$$p(m) = \\langle\\psi|M_m^\\dagger M_m|\\psi\\rangle$$
4. **Postulate 4 (Composite Systems)**: The state space of a composite system is the tensor product $\\mathcal{H}_1 \\otimes \\mathcal{H}_2 \\otimes \\cdots \\otimes \\mathcal{H}_n$.`
  }
];

export class LibraryService {
  static async getDocuments(category = 'All') {
    if (!category || category === 'All') {
      return [...SAMPLE_DOCUMENTS];
    }
    return SAMPLE_DOCUMENTS.filter(d => d.category.toLowerCase() === category.toLowerCase());
  }

  static async getDocumentById(id) {
    return SAMPLE_DOCUMENTS.find(d => d.id === id) || null;
  }

  static async searchDocuments(query) {
    if (!query) return [...SAMPLE_DOCUMENTS];
    const q = query.toLowerCase();
    return SAMPLE_DOCUMENTS.filter(d =>
      d.title.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      (d.tags && d.tags.some(t => t.toLowerCase().includes(q)))
    );
  }
}
