/**
 * CodeParser.js
 * 
 * Controlled Qiskit Python -> Circuit JSON Parser.
 * Enables Bi-directional Visual <-> Code synchronization in Quantum Lab.
 * 
 * Supports:
 * - qc = QuantumCircuit(numQubits, numBits)
 * - qc.h(q), qc.x(q), qc.y(q), qc.z(q), qc.s(q), qc.t(q), qc.id(q), qc.reset(q)
 * - qc.cx(control, target), qc.cnot(control, target), qc.cz(control, target)
 * - qc.measure(q, c), qc.measure_all()
 * 
 * Team Neural Nomads — Smart India Hackathon 2026
 */

export class CodeParser {
  /**
   * Parses supported Qiskit Python code into circuit JSON model
   * @param {string} code 
   * @returns {{ success: boolean, circuit?: Object, error?: string }}
   */
  static parseQiskit(code) {
    if (!code || typeof code !== 'string') {
      return { success: false, error: 'Empty code string provided.' };
    }

    const lines = code.split('\n');
    let qubits = 2;
    let classicalBits = 2;
    const rawOps = [];

    // Track active column per qubit to schedule moments neatly
    const qubitActiveCol = {};

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex].trim();

      // Skip comments or blank lines
      if (!line || line.startsWith('#') || line.startsWith('from ') || line.startsWith('import ')) {
        continue;
      }

      // Check QuantumCircuit initialization: qc = QuantumCircuit(2, 2) or QuantumCircuit(2)
      const initMatch = line.match(/QuantumCircuit\s*\(\s*(\d+)(?:\s*,\s*(\d+))?\s*\)/i);
      if (initMatch) {
        qubits = parseInt(initMatch[1], 10);
        classicalBits = initMatch[2] ? parseInt(initMatch[2], 10) : qubits;
        qubits = Math.max(1, Math.min(6, qubits));
        classicalBits = Math.max(1, Math.min(6, classicalBits));
        continue;
      }

      // Single-qubit gates: qc.h(0), qc.x(1), qc.y(0), qc.z(0), qc.s(0), qc.t(0), qc.id(0), qc.reset(0)
      const singleGateMatch = line.match(/qc\.(h|x|y|z|s|t|id|reset)\s*\(\s*(\d+)\s*\)/i);
      if (singleGateMatch) {
        const gateType = singleGateMatch[1].toUpperCase() === 'ID' ? 'I' : singleGateMatch[1].toUpperCase();
        const q = parseInt(singleGateMatch[2], 10);
        if (q < qubits) {
          const col = qubitActiveCol[q] || 0;
          qubitActiveCol[q] = col + 1;
          rawOps.push({
            id: `parsed-op-${rawOps.length + 1}`,
            gate: gateType,
            qubit: q,
            column: col
          });
        }
        continue;
      }

      // Two-qubit controlled gates: qc.cx(0, 1), qc.cnot(0, 1), qc.cz(0, 1)
      const twoGateMatch = line.match(/qc\.(cx|cnot|cz)\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)/i);
      if (twoGateMatch) {
        const gateType = twoGateMatch[1].toUpperCase() === 'CNOT' ? 'CX' : twoGateMatch[1].toUpperCase();
        const control = parseInt(twoGateMatch[2], 10);
        const target = parseInt(twoGateMatch[3], 10);
        if (control < qubits && target < qubits && control !== target) {
          const maxCol = Math.max(qubitActiveCol[control] || 0, qubitActiveCol[target] || 0);
          qubitActiveCol[control] = maxCol + 1;
          qubitActiveCol[target] = maxCol + 1;
          rawOps.push({
            id: `parsed-op-${rawOps.length + 1}`,
            gate: gateType,
            control,
            target,
            column: maxCol
          });
        }
        continue;
      }

      // Individual measurement: qc.measure(0, 0)
      const measureMatch = line.match(/qc\.measure\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)/i);
      if (measureMatch) {
        const q = parseInt(measureMatch[1], 10);
        const c = parseInt(measureMatch[2], 10);
        if (q < qubits) {
          const col = qubitActiveCol[q] || 0;
          qubitActiveCol[q] = col + 1;
          rawOps.push({
            id: `parsed-op-${rawOps.length + 1}`,
            gate: 'MEASURE',
            qubit: q,
            cbit: c,
            column: col
          });
        }
        continue;
      }

      // Bulk measurement: qc.measure_all() or qc.measure(range(...), range(...))
      if (line.includes('measure_all') || line.includes('measure(range(')) {
        let maxGlobalCol = 0;
        for (let q = 0; q < qubits; q++) {
          if ((qubitActiveCol[q] || 0) > maxGlobalCol) {
            maxGlobalCol = qubitActiveCol[q] || 0;
          }
        }
        for (let q = 0; q < qubits; q++) {
          rawOps.push({
            id: `parsed-op-${rawOps.length + 1}`,
            gate: 'MEASURE',
            qubit: q,
            cbit: q,
            column: maxGlobalCol
          });
          qubitActiveCol[q] = maxGlobalCol + 1;
        }
        continue;
      }
    }

    // Determine total columns needed (minimum 4)
    let maxColIndex = 0;
    for (const op of rawOps) {
      if (op.column > maxColIndex) maxColIndex = op.column;
    }
    const totalColumns = Math.max(4, maxColIndex + 2);

    return {
      success: true,
      circuit: {
        qubits,
        classicalBits,
        columns: totalColumns,
        operations: rawOps
      }
    };
  }
}
