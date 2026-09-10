/**
 * ProgressService.js
 * 
 * Centralized, reactive state manager for student gamification, XP progression,
 * levels, streaks, adaptive concept mastery, badges, and localStorage persistence.
 * 
 * Team Neural Nomads — Smart India Hackathon 2026
 */

const STORAGE_KEY = 'quantum_learn_student_progress_v2';

export const LEVEL_DEFINITIONS = [
  { level: 1, title: 'Quantum Beginner', minXp: 0, maxXp: 300 },
  { level: 2, title: 'Superposition Explorer', minXp: 300, maxXp: 700 },
  { level: 3, title: 'Quantum Gate Apprentice', minXp: 700, maxXp: 1200 },
  { level: 4, title: 'Entanglement Engineer', minXp: 1200, maxXp: 2000 },
  { level: 5, title: 'Quantum Algorithm Explorer', minXp: 2000, maxXp: 3200 },
  { level: 6, title: 'Quantum Master', minXp: 3200, maxXp: 5000 }
];

export const BADGE_DEFINITIONS = [
  {
    id: 'first_qubit',
    title: 'First Qubit',
    icon: '🟣',
    description: 'Collected your first quantum token in Quantum Rush'
  },
  {
    id: 'superposition_master',
    title: 'Superposition Master',
    icon: '🔵',
    description: 'Answered superposition challenges and unlocked state superposition'
  },
  {
    id: 'entangled',
    title: 'Entangled',
    icon: '🟢',
    description: 'Mastered two-qubit entanglement and created a Bell state'
  },
  {
    id: 'gatekeeper',
    title: 'Gatekeeper',
    icon: '⚡',
    description: 'Experimented with Pauli and Phase gates in Quantum Lab'
  },
  {
    id: 'quantum_explorer',
    title: 'Quantum Explorer',
    icon: '🏆',
    description: 'Completed runs across all 3 Quantum Rush worlds'
  },
  {
    id: 'circuit_builder',
    title: 'Circuit Builder',
    icon: '🛠️',
    description: 'Built, edited, and simulated your first custom quantum circuit'
  }
];

const DEFAULT_STATE = {
  xp: 350,
  level: 2,
  streak: 0,
  bestStreak: 5,
  highScore: 1850,
  totalTokensCollected: 14,
  totalQuestionsAnswered: 8,
  totalQuestionsCorrect: 7,
  unlockedConcepts: ['qubit', 'superposition', 'measurement'],
  unlockedWorlds: [1, 2],
  conceptMastery: {
    qubits: 85,
    superposition: 70,
    gates: 65,
    entanglement: 40,
    algorithms: 25
  },
  badges: ['first_qubit'],
  recentMistakes: [],
  lastRecommendedConcept: 'entanglement'
};

class ProgressManager {
  constructor() {
    this.listeners = new Set();
    this.state = this.loadState();
  }

  loadState() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return { ...DEFAULT_STATE, ...JSON.parse(saved) };
        }
      }
    } catch (e) {
      console.warn('ProgressService: Could not read localStorage', e);
    }
    return { ...DEFAULT_STATE };
  }

  saveState() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (e) {
      console.warn('ProgressService: Could not save to localStorage', e);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    // Initial call
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.state);
      } catch (e) {
        console.error('Error in ProgressService listener', e);
      }
    }
  }

  getState() {
    return { ...this.state };
  }

  getLevelInfo() {
    const currentXp = this.state.xp;
    const currentLevelObj = LEVEL_DEFINITIONS.find(
      l => currentXp >= l.minXp && currentXp < l.maxXp
    ) || LEVEL_DEFINITIONS[LEVEL_DEFINITIONS.length - 1];

    const prevThreshold = currentLevelObj.minXp;
    const nextThreshold = currentLevelObj.maxXp;
    const progressPercent = Math.min(
      100,
      Math.max(0, Math.round(((currentXp - prevThreshold) / (nextThreshold - prevThreshold)) * 100))
    );

    return {
      level: currentLevelObj.level,
      title: currentLevelObj.title,
      currentXp,
      minXp: prevThreshold,
      maxXp: nextThreshold,
      progressPercent
    };
  }

  addXP(amount, reason = '') {
    const oldLevel = this.getLevelInfo().level;
    this.state.xp += amount;
    const newLevelInfo = this.getLevelInfo();

    let leveledUp = false;
    if (newLevelInfo.level > oldLevel) {
      this.state.level = newLevelInfo.level;
      leveledUp = true;
    }

    this.saveState();
    return { newXp: this.state.xp, leveledUp, levelInfo: newLevelInfo, reason };
  }

  recordAnswer(isCorrect, conceptId, question) {
    this.state.totalQuestionsAnswered += 1;

    if (isCorrect) {
      this.state.totalQuestionsCorrect += 1;
      this.state.streak += 1;
      if (this.state.streak > this.state.bestStreak) {
        this.state.bestStreak = this.state.streak;
      }

      // Boost mastery
      const categoryKey = this.mapConceptToCategory(conceptId);
      if (this.state.conceptMastery[categoryKey] !== undefined) {
        this.state.conceptMastery[categoryKey] = Math.min(
          100,
          this.state.conceptMastery[categoryKey] + 5
        );
      }

      // Unlock concept if not yet unlocked
      if (!this.state.unlockedConcepts.includes(conceptId)) {
        this.state.unlockedConcepts.push(conceptId);
      }

      // Check badge unlocks
      if (conceptId === 'superposition' && !this.state.badges.includes('superposition_master')) {
        this.awardBadge('superposition_master');
      }
      if (conceptId === 'entanglement' && !this.state.badges.includes('entangled')) {
        this.awardBadge('entangled');
      }
    } else {
      // Wrong answer
      this.state.streak = 0;
      const categoryKey = this.mapConceptToCategory(conceptId);
      if (this.state.conceptMastery[categoryKey] !== undefined) {
        this.state.conceptMastery[categoryKey] = Math.max(
          10,
          this.state.conceptMastery[categoryKey] - 5
        );
      }

      // Log mistake for adaptive review
      if (question) {
        const exists = this.state.recentMistakes.some(m => m.id === question.id);
        if (!exists) {
          this.state.recentMistakes.unshift({
            id: question.id,
            question: question.question,
            concept: conceptId,
            explanation: question.explanation,
            timestamp: Date.now()
          });
          if (this.state.recentMistakes.length > 10) {
            this.state.recentMistakes.pop();
          }
        }
      }

      // Update recommendation to focus on this weak concept
      this.state.lastRecommendedConcept = categoryKey;
    }

    this.saveState();
  }

  recordTokenCollected(tokenType) {
    this.state.totalTokensCollected += 1;
    if (!this.state.badges.includes('first_qubit')) {
      this.awardBadge('first_qubit');
    }
    this.addXP(10, 'Collected Quantum Token');
    this.saveState();
  }

  recordRunEnd(score, runXp, accuracy) {
    if (score > this.state.highScore) {
      this.state.highScore = score;
    }
    this.saveState();
  }

  awardBadge(badgeId) {
    if (!this.state.badges.includes(badgeId)) {
      this.state.badges.push(badgeId);
      this.saveState();
      return true;
    }
    return false;
  }

  unlockConcept(conceptId) {
    if (!this.state.unlockedConcepts.includes(conceptId)) {
      this.state.unlockedConcepts.push(conceptId);
      this.saveState();
    }
  }

  unlockWorld(worldNumber) {
    if (!this.state.unlockedWorlds.includes(worldNumber)) {
      this.state.unlockedWorlds.push(worldNumber);
      this.saveState();
    }
  }

  mapConceptToCategory(conceptId = '') {
    const c = conceptId.toLowerCase();
    if (c.includes('qubit')) return 'qubits';
    if (c.includes('superposition') || c.includes('hadamard')) return 'superposition';
    if (c.includes('gate') || c.includes('pauli')) return 'gates';
    if (c.includes('entangle') || c.includes('bell') || c.includes('cnot')) return 'entanglement';
    if (c.includes('algorithm') || c.includes('grover') || c.includes('deutsch')) return 'algorithms';
    return 'qubits';
  }

  getSmartRecommendation() {
    const mastery = this.state.conceptMastery;
    let lowestCategory = 'entanglement';
    let lowestScore = 101;

    for (const [cat, score] of Object.entries(mastery)) {
      if (score < lowestScore) {
        lowestScore = score;
        lowestCategory = cat;
      }
    }

    const messages = {
      qubits: {
        concept: 'Qubits & Measurement',
        text: "You have room to improve on Qubit fundamentals and Born's rule. Spend a few minutes reviewing basis states.",
        target: 'qubit'
      },
      superposition: {
        concept: 'Superposition',
        text: "Qumi noticed your answers on Hadamard gates and superposition need a refresher. Explore |+⟩ and |−⟩ states in Quantum Lab.",
        target: 'superposition'
      },
      gates: {
        concept: 'Quantum Gates',
        text: "Let's reinforce your knowledge of Pauli X, Y, Z and phase rotations.",
        target: 'quantum-gates'
      },
      entanglement: {
        concept: 'Entanglement & Bell States',
        text: "Qumi noticed you're struggling with Entanglement. Let's practice Bell states and CNOT correlation before the next level.",
        target: 'entanglement'
      },
      algorithms: {
        concept: 'Quantum Algorithms',
        text: "Deepen your understanding of Grover's search and quantum interference.",
        target: 'grover'
      }
    };

    return messages[lowestCategory] || messages['entanglement'];
  }

  resetProgress() {
    this.state = { ...DEFAULT_STATE };
    this.saveState();
  }
}

export const ProgressService = new ProgressManager();
