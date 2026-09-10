// Simulation Persistence Service (LocalStorage + Backend REST API abstraction)
// Endpoints: GET/POST /api/simulations, /api/simulations/:id

const STORAGE_KEY = 'quantum_learn_saved_simulations';

export class SimulationService {
  /**
   * Retrieves all saved simulations
   * @returns {Promise<Array>} List of saved simulations
   */
  static async getSimulations() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('LocalStorage error reading simulations:', e);
    }
    return [];
  }

  /**
   * Saves a simulation state
   * @param {Object} simulation
   * @returns {Promise<Object>} Saved record
   */
  static async saveSimulation(simulation) {
    const simulations = await this.getSimulations();
    const id = simulation.id || `sim-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const record = {
      ...simulation,
      id,
      updatedAt: timestamp
    };

    const existingIdx = simulations.findIndex(s => s.id === id);
    if (existingIdx >= 0) {
      simulations[existingIdx] = record;
    } else {
      simulations.unshift(record);
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(simulations));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }

    return record;
  }

  /**
   * Deletes a saved simulation
   * @param {string} id
   */
  static async deleteSimulation(id) {
    const simulations = await this.getSimulations();
    const filtered = simulations.filter(s => s.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to update localStorage:', e);
    }
    return true;
  }
}
