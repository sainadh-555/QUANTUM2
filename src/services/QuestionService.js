/**
 * QuestionService.js
 * 
 * Adaptive educational question selector for Quantum Rush and Learning Hub.
 * Weights questions dynamically based on student mastery gaps.
 * 
 * Team Neural Nomads — Smart India Hackathon 2026
 */

import { QUANTUM_QUESTIONS } from '../data/quantumQuestions.js';
import { ProgressService } from './ProgressService.js';

export class QuestionService {
  /**
   * Retrieves all questions, optionally filtered by concept or difficulty
   */
  static getQuestions({ concept, difficulty } = {}) {
    return QUANTUM_QUESTIONS.filter(q => {
      if (concept && q.concept !== concept) return false;
      if (difficulty && q.difficulty.toLowerCase() !== difficulty.toLowerCase()) return false;
      return true;
    });
  }

  /**
   * Gets a question specifically tailored for a collected Quantum Token type
   * @param {string} tokenType 'qubit' | 'hadamard' | 'cnot' | 'xgate' | 'measurement' | 'algorithm'
   */
  static getQuestionForToken(tokenType) {
    let targetConcept = 'qubit';

    switch (tokenType) {
      case 'hadamard':
      case 'superposition':
        targetConcept = 'superposition';
        break;
      case 'cnot':
      case 'entanglement':
        targetConcept = 'entanglement';
        break;
      case 'xgate':
      case 'gates':
        targetConcept = 'gates';
        break;
      case 'measurement':
        targetConcept = 'measurement';
        break;
      case 'algorithm':
      case 'grover':
        targetConcept = 'algorithms';
        break;
      case 'qubit':
      default:
        targetConcept = 'qubit';
        break;
    }

    const matching = QUANTUM_QUESTIONS.filter(q => q.concept === targetConcept);
    if (matching.length === 0) {
      return QUANTUM_QUESTIONS[Math.floor(Math.random() * QUANTUM_QUESTIONS.length)];
    }

    // Pick random within target concept
    const randomIndex = Math.floor(Math.random() * matching.length);
    return matching[randomIndex];
  }

  /**
   * Adaptive Question Selector:
   * Selects a question inversely proportional to student mastery.
   * If the student struggles with entanglement (40% mastery), entanglement questions
   * have a higher chance of being drawn.
   */
  static getAdaptiveQuestion(preferredDifficulty = null) {
    const studentState = ProgressService.getState();
    const mastery = studentState.conceptMastery || {};

    // Calculate selection weights: lower mastery = higher weight
    const categories = ['qubits', 'superposition', 'gates', 'entanglement', 'algorithms'];
    const weights = {};
    let totalWeight = 0;

    for (const cat of categories) {
      const score = mastery[cat] !== undefined ? mastery[cat] : 50;
      // Invert score: 100% -> weight 10; 40% -> weight 70
      const weight = Math.max(10, 110 - score);
      weights[cat] = weight;
      totalWeight += weight;
    }

    // Roulette wheel selection for concept category
    let randomVal = Math.random() * totalWeight;
    let chosenCategory = 'qubits';

    for (const cat of categories) {
      if (randomVal <= weights[cat]) {
        chosenCategory = cat;
        break;
      }
      randomVal -= weights[cat];
    }

    // Map chosen category to concept identifier in question bank
    const conceptMap = {
      qubits: 'qubit',
      superposition: 'superposition',
      gates: 'gates',
      entanglement: 'entanglement',
      algorithms: 'algorithms'
    };
    const targetConcept = conceptMap[chosenCategory] || 'qubit';

    let pool = QUANTUM_QUESTIONS.filter(q => q.concept === targetConcept);
    if (preferredDifficulty) {
      const diffPool = pool.filter(q => q.difficulty.toLowerCase() === preferredDifficulty.toLowerCase());
      if (diffPool.length > 0) pool = diffPool;
    }

    if (pool.length === 0) {
      pool = QUANTUM_QUESTIONS;
    }

    const picked = pool[Math.floor(Math.random() * pool.length)];
    return {
      ...picked,
      isAdaptiveRecommendation: studentState.lastRecommendedConcept === chosenCategory
    };
  }

  /**
   * Evaluates user's answer and records progress
   */
  static submitAnswer(questionId, selectedOptionIndex) {
    const question = QUANTUM_QUESTIONS.find(q => q.id === questionId);
    if (!question) {
      return { isCorrect: false, explanation: 'Question not found.' };
    }

    const isCorrect = selectedOptionIndex === question.correctAnswer;
    ProgressService.recordAnswer(isCorrect, question.concept, question);

    return {
      isCorrect,
      correctAnswerIndex: question.correctAnswer,
      correctOptionText: question.options[question.correctAnswer],
      explanation: question.explanation,
      earnedXp: isCorrect ? (question.xp || 50) : 0,
      streak: ProgressService.getState().streak
    };
  }
}
