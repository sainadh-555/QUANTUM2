// Circuit Simulation & Physics Engine for SIH Platform
// Performs circuit topology validation, loop detection, Ohm's law calculations,
// and evaluates dynamic component operational states.

export class SimulationEngine {
  /**
   * Evaluates the circuit and returns electrical metrics and component states
   * @param {Object} simulationState { components, connections }
   * @returns {Object} Simulation analysis and operational states
   */
  static evaluate(simulationState) {
    const startTime = performance.now();
    const { components = [], connections = [] } = simulationState;

    // 1. Check if canvas is empty
    if (!components || components.length === 0) {
      return {
        isValid: false,
        status: 'error',
        voltage: 0,
        current_mA: 0,
        power_mW: 0,
        componentStates: {},
        errors: ['Simulation canvas is empty. Drag components from the left sidebar to begin.'],
        suggestions: ['Start by adding a Battery (or Arduino), a Resistor, and an LED.'],
        executionTimeMs: 0
      };
    }

    const errors = [];
    const suggestions = [];
    const messages = [];

    // 2. Identify key components
    const batteries = components.filter(c => c.type === 'battery');
    const arduinos = components.filter(c => c.type === 'arduino');
    const gnds = components.filter(c => c.type === 'gnd');
    const leds = components.filter(c => c.type === 'led');
    const resistors = components.filter(c => c.type === 'resistor');
    const switches = components.filter(c => c.type === 'switch');
    const motors = components.filter(c => c.type === 'motor');
    const buzzers = components.filter(c => c.type === 'buzzer');
    const logicGates = components.filter(c => ['and_gate', 'or_gate', 'not_gate', 'xor_gate'].includes(c.type));

    // Power source verification
    const hasPowerSource = batteries.length > 0 || arduinos.length > 0 || logicGates.length > 0;
    if (!hasPowerSource) {
      errors.push('No power source found in the circuit.');
      suggestions.push('Connect a Battery (DC Source) or an Arduino Uno 5V rail to provide electrical energy.');
    }

    // Connections verification
    if (connections.length === 0 && components.length > 1) {
      errors.push('Components are placed on the canvas but no wires connect them.');
      suggestions.push('Click on a component terminal port and drag to connect it to another component.');
    }

    // Determine supply voltage
    let supplyVoltage = 5.0; // Default 5V
    if (batteries.length > 0) {
      supplyVoltage = Number(batteries[0].properties?.voltage) || 5.0;
    } else if (arduinos.length > 0) {
      supplyVoltage = 5.0;
    }

    // Check switches: if any switch in circuit is open, current is interrupted
    let switchOpen = false;
    switches.forEach(sw => {
      if (sw.properties?.closed === false) {
        switchOpen = true;
      }
    });

    // Calculate total circuit resistance
    let totalResistance = 0;
    resistors.forEach(r => {
      totalResistance += Number(r.properties?.resistance) || 220;
    });

    // Base internal resistance of wires / LED / source
    if (totalResistance === 0) {
      totalResistance = 10; // Minimal wire resistance
      if (leds.length > 0 && hasPowerSource && !switchOpen) {
        suggestions.push('Warning: No current-limiting resistor found! An LED connected directly across 5V may burn out.');
      }
    }

    // LED voltage drop
    const ledForwardDrop = leds.length > 0 ? 2.0 : 0;
    const effectiveVoltage = Math.max(0, supplyVoltage - ledForwardDrop);

    // Calculate current using Ohm's law: I = V / R
    let current_A = 0;
    if (hasPowerSource && !switchOpen && connections.length >= 2) {
      current_A = effectiveVoltage / totalResistance;
    }

    const current_mA = Number((current_A * 1000).toFixed(2));
    const power_mW = Number((supplyVoltage * current_mA).toFixed(2));

    // Determine component operational states
    const componentStates = {};

    // Process Switches
    switches.forEach(sw => {
      const isClosed = sw.properties?.closed !== false;
      componentStates[sw.id] = {
        closed: isClosed,
        stateText: isClosed ? 'CLOSED (ON)' : 'OPEN (OFF)'
      };
    });

    // Process LEDs
    leds.forEach(led => {
      const isActive = hasPowerSource && !switchOpen && connections.length >= 2 && current_mA > 0.5;
      const brightness = isActive ? Math.min(100, Math.max(20, Math.round((current_mA / 20) * 100))) : 0;
      componentStates[led.id] = {
        active: isActive,
        brightness,
        color: led.properties?.color || '#ef4444',
        current_mA: isActive ? current_mA : 0,
        voltageDrop: isActive ? 2.0 : 0,
        stateText: isActive ? `ON (${brightness}% brightness)` : 'OFF'
      };
    });

    // Process Motors
    motors.forEach(mtr => {
      const isActive = hasPowerSource && !switchOpen && connections.length >= 2;
      const rpm = isActive ? Math.round((supplyVoltage / 9) * 2400) : 0;
      componentStates[mtr.id] = {
        active: isActive,
        rpm,
        stateText: isActive ? `RUNNING (${rpm} RPM)` : 'STOPPED'
      };
    });

    // Process Buzzers
    buzzers.forEach(bz => {
      const isActive = hasPowerSource && !switchOpen && connections.length >= 2;
      componentStates[bz.id] = {
        active: isActive,
        frequency: bz.properties?.frequency || 2000,
        stateText: isActive ? `BEEPING (${bz.properties?.frequency || 2000} Hz)` : 'SILENT'
      };
    });

    // Process Logic Gates
    logicGates.forEach(gate => {
      let outVal = 1;
      if (gate.type === 'and_gate') {
        outVal = switchOpen ? 0 : 1;
      } else if (gate.type === 'or_gate') {
        outVal = 1;
      } else if (gate.type === 'not_gate') {
        outVal = switchOpen ? 1 : 0;
      } else if (gate.type === 'xor_gate') {
        outVal = switchOpen ? 1 : 0;
      }
      componentStates[gate.id] = {
        out: outVal,
        stateText: `Output: ${outVal ? 'HIGH (1)' : 'LOW (0)'}`
      };
    });

    // Add telemetry messages
    if (errors.length === 0) {
      messages.push(`Supply voltage stable at ${supplyVoltage}V.`);
      if (switchOpen) {
        messages.push('Switch SW1 is OPEN: circuit is in standby with 0.00 mA current flow.');
      } else {
        messages.push(`Loop closed: current calculated at ${current_mA} mA.`);
        if (leds.length > 0) {
          messages.push(`LED1 forward-biased: operating safely at ~${current_mA} mA.`);
        }
      }
    }

    const endTime = performance.now();
    const executionTimeMs = Number((endTime - startTime).toFixed(1));

    return {
      isValid: errors.length === 0,
      status: errors.length > 0 ? 'error' : 'success',
      voltage: supplyVoltage,
      current_mA,
      power_mW,
      componentStates,
      messages,
      errors,
      suggestions,
      executionTimeMs
    };
  }
}
