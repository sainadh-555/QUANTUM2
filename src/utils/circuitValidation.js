/**
 * Circuit Validator for Quantum Learn Simulator
 */

export function validateCircuit(circuit) {
  if (!circuit) {
    return {
      isValid: false,
      error: "No circuit model provided.",
      warning: null
    };
  }

  const { qubits, operations = [] } = circuit;

  if (qubits < 1 || qubits > 10) {
    return {
      isValid: false,
      error: "Qubit count must be between 1 and 10 for interactive simulation.",
      warning: null
    };
  }

  if (operations.length === 0) {
    return {
      isValid: false,
      error: "The circuit is empty! Drag gates onto the wires to build your quantum algorithm.",
      warning: null
    };
  }

  // Validate individual operations
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];

    if (op.gate === 'CX' || op.gate === 'CZ') {
      if (op.control === undefined || op.target === undefined) {
        return {
          isValid: false,
          error: `Controlled gate ${op.gate} at column ${op.column + 1} must specify control and target qubits.`,
          warning: null
        };
      }

      if (op.control === op.target) {
        return {
          isValid: false,
          error: `Invalid controlled-gate connection at column ${op.column + 1}: Control and target cannot be on the same qubit (q${op.control}).`,
          warning: null
        };
      }

      if (op.control >= qubits || op.target >= qubits) {
        return {
          isValid: false,
          error: `Controlled gate at column ${op.column + 1} targets qubit out of range.`,
          warning: null
        };
      }
    } else {
      if (op.qubit !== undefined && (op.qubit < 0 || op.qubit >= qubits)) {
        return {
          isValid: false,
          error: `Gate ${op.gate} is placed on an invalid qubit line (q${op.qubit}).`,
          warning: null
        };
      }
    }
  }

  // Check measurements warning
  const hasMeasurement = operations.some(op => op.gate === 'MEASURE');
  let warning = null;
  if (!hasMeasurement) {
    warning = "Note: No measurement gates found. Ideal statevector will be computed, but measurement histograms require measurement gates.";
  }

  return {
    isValid: true,
    error: null,
    warning
  };
}
