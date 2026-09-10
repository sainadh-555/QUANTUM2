/**
 * Converts a JSON circuit model into formatted Qiskit Python Code.
 * 
 * Circuit JSON Schema:
 * {
 *   "qubits": 2,
 *   "classicalBits": 2,
 *   "operations": [
 *     { "gate": "H", "qubit": 0, "column": 0 },
 *     { "gate": "CX", "control": 0, "target": 1, "column": 1 },
 *     { "gate": "MEASURE", "qubit": 0, "column": 2 }
 *   ]
 * }
 */

export function circuitToQiskit(circuit) {
  if (!circuit || typeof circuit.qubits !== 'number') {
    return '# Invalid circuit model';
  }

  const numQubits = circuit.qubits || 2;
  const numBits = circuit.classicalBits || numQubits;
  const ops = [...(circuit.operations || [])];

  // Sort operations by column then qubit
  ops.sort((a, b) => {
    if (a.column !== b.column) return a.column - b.column;
    const qA = a.qubit !== undefined ? a.qubit : (a.control !== undefined ? a.control : 0);
    const qB = b.qubit !== undefined ? b.qubit : (b.control !== undefined ? b.control : 0);
    return qA - qB;
  });

  const lines = [];
  lines.push('from qiskit import QuantumCircuit');
  lines.push('');
  lines.push(`# Initialize Quantum Circuit with ${numQubits} Qubit${numQubits > 1 ? 's' : ''} and ${numBits} Classical Bit${numBits > 1 ? 's' : ''}`);
  lines.push(`qc = QuantumCircuit(${numQubits}, ${numBits})`);
  lines.push('');

  const measureOps = [];

  ops.forEach((op) => {
    const gate = op.gate;

    switch (gate) {
      case 'H':
        lines.push(`qc.h(${op.qubit})`);
        break;
      case 'X':
        lines.push(`qc.x(${op.qubit})`);
        break;
      case 'Y':
        lines.push(`qc.y(${op.qubit})`);
        break;
      case 'Z':
        lines.push(`qc.z(${op.qubit})`);
        break;
      case 'S':
        lines.push(`qc.s(${op.qubit})`);
        break;
      case 'T':
        lines.push(`qc.t(${op.qubit})`);
        break;
      case 'I':
        lines.push(`qc.id(${op.qubit})`);
        break;
      case 'CX':
        lines.push(`qc.cx(${op.control}, ${op.target})`);
        break;
      case 'CZ':
        lines.push(`qc.cz(${op.control}, ${op.target})`);
        break;
      case 'RESET':
        lines.push(`qc.reset(${op.qubit})`);
        break;
      case 'MEASURE':
        measureOps.push(op);
        break;
      default:
        lines.push(`# Unsupported gate: ${gate}`);
        break;
    }
  });

  if (measureOps.length > 0) {
    lines.push('');
    lines.push('# Measurement');
    // Check if measurements cover consecutive indices
    const qTargets = measureOps.map(m => m.qubit);
    
    // Group all measurements neatly
    if (measureOps.length === numQubits && qTargets.every((val, i) => val === i)) {
      lines.push(`qc.measure(range(${numQubits}), range(${numBits}))`);
    } else {
      measureOps.forEach((m, idx) => {
        const cBit = m.cbit !== undefined ? m.cbit : m.qubit;
        lines.push(`qc.measure(${m.qubit}, ${cBit})`);
      });
    }
  }

  return lines.join('\n');
}
