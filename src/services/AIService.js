/**
 * AIService.js
 * 
 * QUMI: "Your Quantum Learning Companion"
 * AI Pedagogical & Quantum State Analysis Engine.
 * 
 * Connects to the real FastAPI backend for intelligent analysis.
 */

const API_BASE_URL = 'http://localhost:8000';

export class AIService {
  /**
   * Sends the full context to the AI backend and retrieves a structured response.
   * @param {Object} context
   * @param {Array} context.messages - Chat history
   * @param {Object} context.circuit - Current circuit state
   * @param {Object} context.results - Current simulation results
   * @param {String} context.code - Current code
   * @returns {Promise<Object>} { type: "TEXT" | "ACTION", content: string, action: Object }
   */
  static async askQumi(context) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/qumi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(context)
      });

      if (!response.ok) {
        throw new Error('AI Backend is unreachable or returned an error.');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Qumi Connection Error:", error);
      return {
        type: 'TEXT',
        content: `I encountered a quantum interference error while connecting to my brain. Please make sure the FastAPI backend is running! (${error.message})`,
        action: null
      };
    }
  }

  // The following methods are kept strictly for backward compatibility with the Learning Space Quiz hints.
  // They do not need to call the LLM because they are simple hardcoded hints.
  
  static generateHint(question) {
    if (!question) return "Think about the fundamental definitions of quantum states and gates.";
    const c = (question.concept || '').toLowerCase();
    if (c === 'qubit') return "💡 **Qumi's Hint:** Remember that a qubit is governed by complex probability amplitudes whose squared magnitudes must always sum to 1.";
    if (c === 'superposition') return "💡 **Qumi's Hint:** Think about which gate acts like a quantum 'coin flipper'.";
    if (c === 'entanglement') return "💡 **Qumi's Hint:** Look for operations that conditionally entangle a target qubit (like CNOT).";
    if (c === 'measurement') return "💡 **Qumi's Hint:** Recall Born's rule and what observation physically does to a delicate superposition.";
    return "💡 **Qumi's Hint:** Review the basis states and recall how unitary gates rotate states on the Bloch sphere.";
  }

  static explainQuestion(question, selectedOptionIndex) {
    if (!question) return { text: "Keep exploring the quantum concepts!", starterCircuitConcept: 'superposition' };
    const selectedText = question.options[selectedOptionIndex] || 'your choice';
    const correctText = question.options[question.correctAnswer];
    const c = (question.concept || '').toLowerCase();

    let text = `You selected "${selectedText}". The correct answer is **"${correctText}"**.\n\n${question.explanation}`;
    return {
      text,
      starterCircuitConcept: c || 'superposition',
      labButtonText: 'TRY IT IN QUANTUM LAB'
    };
  }
}
