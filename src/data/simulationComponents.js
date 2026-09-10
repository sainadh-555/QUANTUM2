// Simulation Component Catalog for SIH Interactive Platform
// Categories: Basic, Input, Output, Logic, Electronics, Sensors, Advanced

export const COMPONENT_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'basic', label: 'Basic' },
  { id: 'input', label: 'Input' },
  { id: 'output', label: 'Output' },
  { id: 'logic', label: 'Logic' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'sensors', label: 'Sensors' },
  { id: 'advanced', label: 'Advanced' }
];

export const COMPONENT_DEFINITIONS = {
  // --- BASIC ---
  battery: {
    type: 'battery',
    category: 'basic',
    name: 'Battery (DC Source)',
    shortName: 'Battery',
    description: 'Provides DC electrical energy to power the circuit.',
    icon: 'BatteryCharging',
    defaultProps: {
      voltage: 5, // Volts
      name: 'BAT1'
    },
    ports: [
      { id: 'pos', name: '+ (VCC)', type: 'power', x: 70, y: 15, polarity: 'positive' },
      { id: 'neg', name: '- (GND)', type: 'ground', x: 70, y: 55, polarity: 'negative' }
    ],
    width: 80,
    height: 70
  },

  gnd: {
    type: 'gnd',
    category: 'basic',
    name: 'Ground (GND)',
    shortName: 'GND',
    description: 'Reference point in an electrical circuit (0V).',
    icon: 'CornerDownRight',
    defaultProps: {
      name: 'GND1'
    },
    ports: [
      { id: 'gnd', name: 'GND', type: 'ground', x: 35, y: 10, polarity: 'negative' }
    ],
    width: 70,
    height: 50
  },

  resistor: {
    type: 'resistor',
    category: 'basic',
    name: 'Resistor',
    shortName: 'Resistor',
    description: 'Limits the flow of electric current according to Ohm\'s law (V = I * R).',
    icon: 'Activity',
    defaultProps: {
      resistance: 220, // Ohms
      name: 'R1'
    },
    ports: [
      { id: 'p1', name: 'Pin 1', type: 'passive', x: 10, y: 25 },
      { id: 'p2', name: 'Pin 2', type: 'passive', x: 80, y: 25 }
    ],
    width: 90,
    height: 50
  },

  // --- INPUT ---
  switch: {
    type: 'switch',
    category: 'input',
    name: 'Toggle Switch',
    shortName: 'Switch',
    description: 'Controls circuit state by opening or closing an electrical pathway.',
    icon: 'ToggleLeft',
    defaultProps: {
      closed: true,
      name: 'SW1'
    },
    ports: [
      { id: 'in', name: 'In', type: 'passive', x: 10, y: 25 },
      { id: 'out', name: 'Out', type: 'passive', x: 80, y: 25 }
    ],
    width: 90,
    height: 50
  },

  button: {
    type: 'button',
    category: 'input',
    name: 'Push Button',
    shortName: 'Button',
    description: 'Momentary contact switch activated when pressed.',
    icon: 'MousePointerClick',
    defaultProps: {
      pressed: false,
      name: 'BTN1'
    },
    ports: [
      { id: 'p1', name: 'Pin 1', type: 'passive', x: 10, y: 25 },
      { id: 'p2', name: 'Pin 2', type: 'passive', x: 70, y: 25 }
    ],
    width: 80,
    height: 50
  },

  potentiometer: {
    type: 'potentiometer',
    category: 'input',
    name: 'Potentiometer',
    shortName: 'Potentiometer',
    description: 'Variable resistor used as an adjustable voltage divider.',
    icon: 'Sliders',
    defaultProps: {
      value: 50, // 0-100%
      resistance: 10000, // 10k Ohms
      name: 'POT1'
    },
    ports: [
      { id: 'vcc', name: 'VCC', type: 'power', x: 10, y: 15 },
      { id: 'wiper', name: 'Wiper', type: 'signal', x: 45, y: 60 },
      { id: 'gnd', name: 'GND', type: 'ground', x: 80, y: 15 }
    ],
    width: 90,
    height: 70
  },

  // --- OUTPUT ---
  led: {
    type: 'led',
    category: 'output',
    name: 'LED (Light Emitting Diode)',
    shortName: 'LED',
    description: 'Semiconductor light source that illuminates when current flows forward.',
    icon: 'SunMedium',
    defaultProps: {
      color: '#ef4444', // Red default
      colorName: 'Red',
      forwardVoltage: 2.0, // V
      name: 'LED1'
    },
    ports: [
      { id: 'anode', name: 'Anode (+)', type: 'anode', x: 15, y: 55, polarity: 'positive' },
      { id: 'cathode', name: 'Cathode (-)', type: 'cathode', x: 65, y: 55, polarity: 'negative' }
    ],
    width: 80,
    height: 65
  },

  motor: {
    type: 'motor',
    category: 'output',
    name: 'DC Motor',
    shortName: 'Motor',
    description: 'Converts electrical energy into mechanical rotational motion.',
    icon: 'RotateCw',
    defaultProps: {
      ratedVoltage: 5,
      name: 'MTR1'
    },
    ports: [
      { id: 'pos', name: '+ (VCC)', type: 'power', x: 20, y: 65, polarity: 'positive' },
      { id: 'neg', name: '- (GND)', type: 'ground', x: 60, y: 65, polarity: 'negative' }
    ],
    width: 80,
    height: 75
  },

  buzzer: {
    type: 'buzzer',
    category: 'output',
    name: 'Piezo Buzzer',
    shortName: 'Buzzer',
    description: 'Audio signaling device producing an audible tone when energized.',
    icon: 'Volume2',
    defaultProps: {
      frequency: 2000, // Hz
      name: 'BUZZ1'
    },
    ports: [
      { id: 'pos', name: '+ (VCC)', type: 'power', x: 15, y: 55, polarity: 'positive' },
      { id: 'neg', name: '- (GND)', type: 'ground', x: 65, y: 55, polarity: 'negative' }
    ],
    width: 80,
    height: 65
  },

  display7seg: {
    type: 'display7seg',
    category: 'output',
    name: '7-Segment Display',
    shortName: '7-Segment',
    description: 'Displays decimal numerals (0-9) using seven distinct LED segments.',
    icon: 'Hash',
    defaultProps: {
      value: 7,
      color: '#06b6d4',
      name: 'SEG1'
    },
    ports: [
      { id: 'vcc', name: 'VCC', type: 'power', x: 20, y: 10 },
      { id: 'data', name: 'Data', type: 'signal', x: 45, y: 10 },
      { id: 'gnd', name: 'GND', type: 'ground', x: 70, y: 10 }
    ],
    width: 90,
    height: 80
  },

  // --- LOGIC ---
  and_gate: {
    type: 'and_gate',
    category: 'logic',
    name: 'AND Gate',
    shortName: 'AND Gate',
    description: 'Digital logic gate: output is HIGH (1) only if both inputs are HIGH (1).',
    icon: 'GitCommit',
    defaultProps: {
      name: 'AND1'
    },
    ports: [
      { id: 'in1', name: 'In A', type: 'signal', x: 10, y: 20 },
      { id: 'in2', name: 'In B', type: 'signal', x: 10, y: 45 },
      { id: 'out', name: 'Out', type: 'signal', x: 80, y: 32 }
    ],
    width: 90,
    height: 65
  },

  or_gate: {
    type: 'or_gate',
    category: 'logic',
    name: 'OR Gate',
    shortName: 'OR Gate',
    description: 'Digital logic gate: output is HIGH (1) if at least one input is HIGH (1).',
    icon: 'GitBranch',
    defaultProps: {
      name: 'OR1'
    },
    ports: [
      { id: 'in1', name: 'In A', type: 'signal', x: 10, y: 20 },
      { id: 'in2', name: 'In B', type: 'signal', x: 10, y: 45 },
      { id: 'out', name: 'Out', type: 'signal', x: 80, y: 32 }
    ],
    width: 90,
    height: 65
  },

  not_gate: {
    type: 'not_gate',
    category: 'logic',
    name: 'NOT Gate (Inverter)',
    shortName: 'NOT Gate',
    description: 'Digital logic inverter: output is the inverse of the single input.',
    icon: 'ChevronsRight',
    defaultProps: {
      name: 'NOT1'
    },
    ports: [
      { id: 'in', name: 'In', type: 'signal', x: 10, y: 30 },
      { id: 'out', name: 'Out', type: 'signal', x: 75, y: 30 }
    ],
    width: 85,
    height: 60
  },

  xor_gate: {
    type: 'xor_gate',
    category: 'logic',
    name: 'XOR Gate',
    shortName: 'XOR Gate',
    description: 'Exclusive OR gate: output is HIGH (1) when inputs are different.',
    icon: 'GitMerge',
    defaultProps: {
      name: 'XOR1'
    },
    ports: [
      { id: 'in1', name: 'In A', type: 'signal', x: 10, y: 20 },
      { id: 'in2', name: 'In B', type: 'signal', x: 10, y: 45 },
      { id: 'out', name: 'Out', type: 'signal', x: 80, y: 32 }
    ],
    width: 90,
    height: 65
  },

  // --- ELECTRONICS ---
  diode: {
    type: 'diode',
    category: 'electronics',
    name: 'Diode',
    shortName: 'Diode',
    description: 'Allows electric current to flow primarily in one forward direction.',
    icon: 'Play',
    defaultProps: {
      forwardDrop: 0.7,
      name: 'D1'
    },
    ports: [
      { id: 'anode', name: 'Anode (+)', type: 'anode', x: 10, y: 25 },
      { id: 'cathode', name: 'Cathode (-)', type: 'cathode', x: 75, y: 25 }
    ],
    width: 85,
    height: 50
  },

  transistor_npn: {
    type: 'transistor_npn',
    category: 'electronics',
    name: 'NPN Transistor (BJT)',
    shortName: 'NPN Transistor',
    description: 'Current-controlled switch or amplifier with Collector, Base, and Emitter.',
    icon: 'Cpu',
    defaultProps: {
      beta: 100,
      name: 'Q1'
    },
    ports: [
      { id: 'collector', name: 'Collector', type: 'passive', x: 55, y: 10 },
      { id: 'base', name: 'Base', type: 'signal', x: 10, y: 35 },
      { id: 'emitter', name: 'Emitter', type: 'ground', x: 55, y: 60 }
    ],
    width: 75,
    height: 70
  },

  // --- SENSORS ---
  ldr: {
    type: 'ldr',
    category: 'sensors',
    name: 'LDR (Light Sensor)',
    shortName: 'Light Sensor',
    description: 'Photoresistor whose electrical resistance decreases with increasing light.',
    icon: 'Sparkles',
    defaultProps: {
      luxLevel: 50, // 0 (Dark) to 100 (Bright Sun)
      darkResistance: 100000,
      lightResistance: 500,
      name: 'LDR1'
    },
    ports: [
      { id: 'p1', name: 'Pin 1', type: 'passive', x: 10, y: 25 },
      { id: 'p2', name: 'Pin 2', type: 'passive', x: 80, y: 25 }
    ],
    width: 90,
    height: 50
  },

  temp_sensor: {
    type: 'temp_sensor',
    category: 'sensors',
    name: 'TMP36 (Temp Sensor)',
    shortName: 'Temp Sensor',
    description: 'Analog temperature sensor providing a voltage proportional to Celsius.',
    icon: 'Thermometer',
    defaultProps: {
      temperature: 25, // Celsius
      name: 'TMP1'
    },
    ports: [
      { id: 'vcc', name: 'VCC (+5V)', type: 'power', x: 15, y: 15 },
      { id: 'v_out', name: 'Vout', type: 'signal', x: 45, y: 60 },
      { id: 'gnd', name: 'GND', type: 'ground', x: 75, y: 15 }
    ],
    width: 90,
    height: 70
  },

  // --- ADVANCED ---
  arduino: {
    type: 'arduino',
    category: 'advanced',
    name: 'Arduino Uno Microcontroller',
    shortName: 'Arduino Uno',
    description: 'Open-source ATmega328P microcontroller development board with digital & analog I/O.',
    icon: 'Cpu',
    defaultProps: {
      board: 'Uno R3',
      name: 'MCU1'
    },
    ports: [
      { id: 'pin13', name: 'D13 (LED)', type: 'signal', x: 15, y: 15 },
      { id: 'pin12', name: 'D12', type: 'signal', x: 15, y: 40 },
      { id: 'pin11', name: 'D11 (PWM)', type: 'signal', x: 15, y: 65 },
      { id: 'a0', name: 'A0 (Analog)', type: 'signal', x: 15, y: 90 },
      { id: 'vcc5', name: '5V Power', type: 'power', x: 135, y: 25 },
      { id: 'gnd', name: 'GND', type: 'ground', x: 135, y: 70 }
    ],
    width: 150,
    height: 110
  }
};
