// Example Simulations for SIH Demonstration
// Pre-configured working circuits with verified connections, properties, and positions

export const EXAMPLE_SIMULATIONS = [
  {
    id: 'led-blink',
    name: 'LED Blink Circuit',
    category: 'Electronics Basics',
    description: 'A classic beginner circuit. Current flows from a 5V DC power source through a 220Ω current-limiting resistor into an LED, illuminating it safely.',
    difficulty: 'Beginner',
    tags: ['Battery', 'Resistor', 'LED', 'Basic Circuit'],
    components: [
      {
        id: 'comp-battery-1',
        type: 'battery',
        x: 80,
        y: 160,
        properties: { name: 'BAT1', voltage: 5 }
      },
      {
        id: 'comp-resistor-1',
        type: 'resistor',
        x: 280,
        y: 110,
        properties: { name: 'R1', resistance: 220 }
      },
      {
        id: 'comp-led-1',
        type: 'led',
        x: 480,
        y: 150,
        properties: { name: 'LED1', color: '#ef4444', colorName: 'Red', forwardVoltage: 2.0 }
      },
      {
        id: 'comp-gnd-1',
        type: 'gnd',
        x: 280,
        y: 280,
        properties: { name: 'GND1' }
      }
    ],
    connections: [
      {
        id: 'wire-1',
        sourceComponent: 'comp-battery-1',
        sourcePort: 'pos',
        targetComponent: 'comp-resistor-1',
        targetPort: 'p1'
      },
      {
        id: 'wire-2',
        sourceComponent: 'comp-resistor-1',
        sourcePort: 'p2',
        targetComponent: 'comp-led-1',
        targetPort: 'anode'
      },
      {
        id: 'wire-3',
        sourceComponent: 'comp-led-1',
        sourcePort: 'cathode',
        targetComponent: 'comp-gnd-1',
        targetPort: 'gnd'
      },
      {
        id: 'wire-4',
        sourceComponent: 'comp-battery-1',
        sourcePort: 'neg',
        targetComponent: 'comp-gnd-1',
        targetPort: 'gnd'
      }
    ]
  },

  {
    id: 'traffic-light',
    name: 'Traffic Light Controller',
    category: 'Microcontroller Projects',
    description: 'Simulates a municipal intersection sequence controlling Red, Yellow, and Green LEDs through current-limiting resistors driven by microcontroller digital pins.',
    difficulty: 'Intermediate',
    tags: ['Arduino', 'Multi-LED', 'State Machine'],
    components: [
      {
        id: 'comp-mcu-1',
        type: 'arduino',
        x: 60,
        y: 100,
        properties: { name: 'MCU1', board: 'Uno R3' }
      },
      {
        id: 'comp-res-red',
        type: 'resistor',
        x: 300,
        y: 80,
        properties: { name: 'R_RED', resistance: 220 }
      },
      {
        id: 'comp-led-red',
        type: 'led',
        x: 470,
        y: 80,
        properties: { name: 'LED_RED', color: '#ef4444', colorName: 'Red' }
      },
      {
        id: 'comp-res-yel',
        type: 'resistor',
        x: 300,
        y: 170,
        properties: { name: 'R_YEL', resistance: 220 }
      },
      {
        id: 'comp-led-yel',
        type: 'led',
        x: 470,
        y: 170,
        properties: { name: 'LED_YEL', color: '#eab308', colorName: 'Yellow' }
      },
      {
        id: 'comp-res-grn',
        type: 'resistor',
        x: 300,
        y: 260,
        properties: { name: 'R_GRN', resistance: 220 }
      },
      {
        id: 'comp-led-grn',
        type: 'led',
        x: 470,
        y: 260,
        properties: { name: 'LED_GRN', color: '#22c55e', colorName: 'Green' }
      },
      {
        id: 'comp-gnd-traffic',
        type: 'gnd',
        x: 630,
        y: 170,
        properties: { name: 'GND1' }
      }
    ],
    connections: [
      {
        id: 'wire-t1',
        sourceComponent: 'comp-mcu-1',
        sourcePort: 'pin13',
        targetComponent: 'comp-res-red',
        targetPort: 'p1'
      },
      {
        id: 'wire-t2',
        sourceComponent: 'comp-res-red',
        sourcePort: 'p2',
        targetComponent: 'comp-led-red',
        targetPort: 'anode'
      },
      {
        id: 'wire-t3',
        sourceComponent: 'comp-mcu-1',
        sourcePort: 'pin12',
        targetComponent: 'comp-res-yel',
        targetPort: 'p1'
      },
      {
        id: 'wire-t4',
        sourceComponent: 'comp-res-yel',
        sourcePort: 'p2',
        targetComponent: 'comp-led-yel',
        targetPort: 'anode'
      },
      {
        id: 'wire-t5',
        sourceComponent: 'comp-mcu-1',
        sourcePort: 'pin11',
        targetComponent: 'comp-res-grn',
        targetPort: 'p1'
      },
      {
        id: 'wire-t6',
        sourceComponent: 'comp-res-grn',
        sourcePort: 'p2',
        targetComponent: 'comp-led-grn',
        targetPort: 'anode'
      },
      {
        id: 'wire-t7',
        sourceComponent: 'comp-led-red',
        sourcePort: 'cathode',
        targetComponent: 'comp-gnd-traffic',
        targetPort: 'gnd'
      },
      {
        id: 'wire-t8',
        sourceComponent: 'comp-led-yel',
        sourcePort: 'cathode',
        targetComponent: 'comp-gnd-traffic',
        targetPort: 'gnd'
      },
      {
        id: 'wire-t9',
        sourceComponent: 'comp-led-grn',
        sourcePort: 'cathode',
        targetComponent: 'comp-gnd-traffic',
        targetPort: 'gnd'
      },
      {
        id: 'wire-t10',
        sourceComponent: 'comp-mcu-1',
        sourcePort: 'gnd',
        targetComponent: 'comp-gnd-traffic',
        targetPort: 'gnd'
      }
    ]
  },

  {
    id: 'street-light',
    name: 'Automatic Street Light',
    category: 'Sensors & Automation',
    description: 'An energy-saving dusk-to-dawn street light system. An LDR (Light Dependent Resistor) detects ambient darkness to switch an LED lamp automatically.',
    difficulty: 'Intermediate',
    tags: ['LDR', 'Sensor', 'Transistor', 'Smart Energy'],
    components: [
      {
        id: 'comp-bat-sl',
        type: 'battery',
        x: 70,
        y: 150,
        properties: { name: 'BAT1', voltage: 5 }
      },
      {
        id: 'comp-ldr-sl',
        type: 'ldr',
        x: 240,
        y: 90,
        properties: { name: 'LDR1', luxLevel: 25 }
      },
      {
        id: 'comp-res-sl',
        type: 'resistor',
        x: 240,
        y: 220,
        properties: { name: 'R_DIV', resistance: 10000 }
      },
      {
        id: 'comp-trans-sl',
        type: 'transistor_npn',
        x: 410,
        y: 150,
        properties: { name: 'Q1', beta: 100 }
      },
      {
        id: 'comp-led-sl',
        type: 'led',
        x: 550,
        y: 100,
        properties: { name: 'LAMP1', color: '#eab308', colorName: 'Warm White' }
      },
      {
        id: 'comp-gnd-sl',
        type: 'gnd',
        x: 350,
        y: 310,
        properties: { name: 'GND1' }
      }
    ],
    connections: [
      {
        id: 'wire-sl1',
        sourceComponent: 'comp-bat-sl',
        sourcePort: 'pos',
        targetComponent: 'comp-ldr-sl',
        targetPort: 'p1'
      },
      {
        id: 'wire-sl2',
        sourceComponent: 'comp-ldr-sl',
        sourcePort: 'p2',
        targetComponent: 'comp-trans-sl',
        targetPort: 'base'
      },
      {
        id: 'wire-sl3',
        sourceComponent: 'comp-ldr-sl',
        sourcePort: 'p2',
        targetComponent: 'comp-res-sl',
        targetPort: 'p1'
      },
      {
        id: 'wire-sl4',
        sourceComponent: 'comp-bat-sl',
        sourcePort: 'pos',
        targetComponent: 'comp-led-sl',
        targetPort: 'anode'
      },
      {
        id: 'wire-sl5',
        sourceComponent: 'comp-led-sl',
        sourcePort: 'cathode',
        targetComponent: 'comp-trans-sl',
        targetPort: 'collector'
      },
      {
        id: 'wire-sl6',
        sourceComponent: 'comp-trans-sl',
        sourcePort: 'emitter',
        targetComponent: 'comp-gnd-sl',
        targetPort: 'gnd'
      },
      {
        id: 'wire-sl7',
        sourceComponent: 'comp-res-sl',
        sourcePort: 'p2',
        targetComponent: 'comp-gnd-sl',
        targetPort: 'gnd'
      },
      {
        id: 'wire-sl8',
        sourceComponent: 'comp-bat-sl',
        sourcePort: 'neg',
        targetComponent: 'comp-gnd-sl',
        targetPort: 'gnd'
      }
    ]
  },

  {
    id: 'temp-sensor',
    name: 'Temperature Alert Monitor',
    category: 'IoT & Sensors',
    description: 'An environmental protection circuit with a TMP36 temperature sensor. When temperature exceeds safe thresholds, a buzzer alert triggers.',
    difficulty: 'Intermediate',
    tags: ['TMP36', 'Buzzer', 'Arduino', 'Safety'],
    components: [
      {
        id: 'comp-mcu-tmp',
        type: 'arduino',
        x: 60,
        y: 120,
        properties: { name: 'MCU1', board: 'Uno R3' }
      },
      {
        id: 'comp-sensor-tmp',
        type: 'temp_sensor',
        x: 290,
        y: 90,
        properties: { name: 'TMP1', temperature: 38 }
      },
      {
        id: 'comp-buzz-tmp',
        type: 'buzzer',
        x: 480,
        y: 150,
        properties: { name: 'ALARM1', frequency: 2400 }
      },
      {
        id: 'comp-gnd-tmp',
        type: 'gnd',
        x: 350,
        y: 280,
        properties: { name: 'GND1' }
      }
    ],
    connections: [
      {
        id: 'wire-ts1',
        sourceComponent: 'comp-mcu-tmp',
        sourcePort: 'vcc5',
        targetComponent: 'comp-sensor-tmp',
        targetPort: 'vcc'
      },
      {
        id: 'wire-ts2',
        sourceComponent: 'comp-sensor-tmp',
        sourcePort: 'v_out',
        targetComponent: 'comp-mcu-tmp',
        targetPort: 'a0'
      },
      {
        id: 'wire-ts3',
        sourceComponent: 'comp-mcu-tmp',
        sourcePort: 'pin13',
        targetComponent: 'comp-buzz-tmp',
        targetPort: 'pos'
      },
      {
        id: 'wire-ts4',
        sourceComponent: 'comp-buzz-tmp',
        sourcePort: 'neg',
        targetComponent: 'comp-gnd-tmp',
        targetPort: 'gnd'
      },
      {
        id: 'wire-ts5',
        sourceComponent: 'comp-sensor-tmp',
        sourcePort: 'gnd',
        targetComponent: 'comp-gnd-tmp',
        targetPort: 'gnd'
      },
      {
        id: 'wire-ts6',
        sourceComponent: 'comp-mcu-tmp',
        sourcePort: 'gnd',
        targetComponent: 'comp-gnd-tmp',
        targetPort: 'gnd'
      }
    ]
  },

  {
    id: 'logic-gates',
    name: 'Digital Logic Combinational Circuit',
    category: 'Digital Electronics',
    description: 'Implements Boolean logic functions using physical toggle switches as inputs, passing through an AND Gate and a NOT gate inverter to an output indicator.',
    difficulty: 'Beginner',
    tags: ['AND Gate', 'NOT Gate', 'Boolean Logic', 'Switches'],
    components: [
      {
        id: 'comp-sw-a',
        type: 'switch',
        x: 70,
        y: 80,
        properties: { name: 'SW_A', closed: true }
      },
      {
        id: 'comp-sw-b',
        type: 'switch',
        x: 70,
        y: 190,
        properties: { name: 'SW_B', closed: true }
      },
      {
        id: 'comp-and-1',
        type: 'and_gate',
        x: 250,
        y: 120,
        properties: { name: 'AND1' }
      },
      {
        id: 'comp-not-1',
        type: 'not_gate',
        x: 410,
        y: 120,
        properties: { name: 'NOT1' }
      },
      {
        id: 'comp-led-logic',
        type: 'led',
        x: 560,
        y: 120,
        properties: { name: 'OUT_LED', color: '#06b6d4', colorName: 'Cyan' }
      },
      {
        id: 'comp-gnd-logic',
        type: 'gnd',
        x: 560,
        y: 250,
        properties: { name: 'GND1' }
      }
    ],
    connections: [
      {
        id: 'wire-lg1',
        sourceComponent: 'comp-sw-a',
        sourcePort: 'out',
        targetComponent: 'comp-and-1',
        targetPort: 'in1'
      },
      {
        id: 'wire-lg2',
        sourceComponent: 'comp-sw-b',
        sourcePort: 'out',
        targetComponent: 'comp-and-1',
        targetPort: 'in2'
      },
      {
        id: 'wire-lg3',
        sourceComponent: 'comp-and-1',
        sourcePort: 'out',
        targetComponent: 'comp-not-1',
        targetPort: 'in'
      },
      {
        id: 'wire-lg4',
        sourceComponent: 'comp-not-1',
        sourcePort: 'out',
        targetComponent: 'comp-led-logic',
        targetPort: 'anode'
      },
      {
        id: 'wire-lg5',
        sourceComponent: 'comp-led-logic',
        sourcePort: 'cathode',
        targetComponent: 'comp-gnd-logic',
        targetPort: 'gnd'
      }
    ]
  },

  {
    id: 'motor-control',
    name: 'DC Motor Speed & Direction Drive',
    category: 'Power & Actuators',
    description: 'Controls an electric DC motor with a toggle switch, flyback diode for reverse EMF protection, and power voltage modulation.',
    difficulty: 'Intermediate',
    tags: ['DC Motor', 'Diode', 'Switch', 'Actuator'],
    components: [
      {
        id: 'comp-bat-mtr',
        type: 'battery',
        x: 70,
        y: 140,
        properties: { name: 'BAT1', voltage: 9 }
      },
      {
        id: 'comp-sw-mtr',
        type: 'switch',
        x: 230,
        y: 90,
        properties: { name: 'SW1', closed: true }
      },
      {
        id: 'comp-mtr-1',
        type: 'motor',
        x: 400,
        y: 130,
        properties: { name: 'MTR1', ratedVoltage: 9 }
      },
      {
        id: 'comp-diode-mtr',
        type: 'diode',
        x: 400,
        y: 250,
        properties: { name: 'D_FLYBACK' }
      },
      {
        id: 'comp-gnd-mtr',
        type: 'gnd',
        x: 230,
        y: 270,
        properties: { name: 'GND1' }
      }
    ],
    connections: [
      {
        id: 'wire-m1',
        sourceComponent: 'comp-bat-mtr',
        sourcePort: 'pos',
        targetComponent: 'comp-sw-mtr',
        targetPort: 'in'
      },
      {
        id: 'wire-m2',
        sourceComponent: 'comp-sw-mtr',
        sourcePort: 'out',
        targetComponent: 'comp-mtr-1',
        targetPort: 'pos'
      },
      {
        id: 'wire-m3',
        sourceComponent: 'comp-mtr-1',
        sourcePort: 'neg',
        targetComponent: 'comp-gnd-mtr',
        targetPort: 'gnd'
      },
      {
        id: 'wire-m4',
        sourceComponent: 'comp-bat-mtr',
        sourcePort: 'neg',
        targetComponent: 'comp-gnd-mtr',
        targetPort: 'gnd'
      }
    ]
  },

  {
    id: 'digital-counter',
    name: 'Digital 7-Segment Counter',
    category: 'Digital Systems',
    description: 'Displays counting sequence on a 7-segment display controlled by a microcontroller with momentary tactile button input.',
    difficulty: 'Advanced',
    tags: ['7-Segment', 'Arduino', 'Button', 'Display'],
    components: [
      {
        id: 'comp-mcu-cnt',
        type: 'arduino',
        x: 60,
        y: 120,
        properties: { name: 'MCU1', board: 'Uno R3' }
      },
      {
        id: 'comp-btn-cnt',
        type: 'button',
        x: 260,
        y: 80,
        properties: { name: 'BTN_STEP', pressed: false }
      },
      {
        id: 'comp-seg-cnt',
        type: 'display7seg',
        x: 450,
        y: 110,
        properties: { name: 'SEG1', value: 3, color: '#06b6d4' }
      },
      {
        id: 'comp-gnd-cnt',
        type: 'gnd',
        x: 340,
        y: 260,
        properties: { name: 'GND1' }
      }
    ],
    connections: [
      {
        id: 'wire-dc1',
        sourceComponent: 'comp-mcu-cnt',
        sourcePort: 'pin13',
        targetComponent: 'comp-seg-cnt',
        targetPort: 'data'
      },
      {
        id: 'wire-dc2',
        sourceComponent: 'comp-mcu-cnt',
        sourcePort: 'pin12',
        targetComponent: 'comp-btn-cnt',
        targetPort: 'p1'
      },
      {
        id: 'wire-dc3',
        sourceComponent: 'comp-btn-cnt',
        sourcePort: 'p2',
        targetComponent: 'comp-gnd-cnt',
        targetPort: 'gnd'
      },
      {
        id: 'wire-dc4',
        sourceComponent: 'comp-seg-cnt',
        sourcePort: 'gnd',
        targetComponent: 'comp-gnd-cnt',
        targetPort: 'gnd'
      },
      {
        id: 'wire-dc5',
        sourceComponent: 'comp-mcu-cnt',
        sourcePort: 'gnd',
        targetComponent: 'comp-gnd-cnt',
        targetPort: 'gnd'
      }
    ]
  }
];
