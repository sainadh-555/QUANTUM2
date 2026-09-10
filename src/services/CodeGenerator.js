// Automatic Multi-Language Code Generation Engine for Simulation Lab
// Supports Arduino/C++, Python (CircuitPython/RPi.GPIO), and JavaScript (Johnny-Five/Node)

export class CodeGenerator {
  /**
   * Generates code based on the current simulation state and target language
   * @param {Object} simulationState { components, connections }
   * @param {string} language 'arduino' | 'python' | 'javascript'
   * @returns {string} Formatted code
   */
  static generate(simulationState, language = 'arduino') {
    const { components = [], connections = [] } = simulationState;

    if (!components || components.length === 0) {
      return this.getEmptyTemplate(language);
    }

    switch (language) {
      case 'python':
        return this.generatePython(components, connections);
      case 'javascript':
        return this.generateJavaScript(components, connections);
      case 'arduino':
      default:
        return this.generateArduino(components, connections);
    }
  }

  // --- ARDUINO / C++ GENERATOR ---
  static generateArduino(components, connections) {
    const lines = [];
    lines.push('// =================================================');
    lines.push('// Smart India Hackathon - Auto-Generated Arduino Code');
    lines.push('// Target: Arduino Uno / Nano (ATmega328P)');
    lines.push('// Generated automatically based on circuit topology');
    lines.push('// =================================================\n');

    // Categorize components
    const leds = components.filter(c => c.type === 'led');
    const resistors = components.filter(c => c.type === 'resistor');
    const switches = components.filter(c => c.type === 'switch');
    const buttons = components.filter(c => c.type === 'button');
    const buzzers = components.filter(c => c.type === 'buzzer');
    const motors = components.filter(c => c.type === 'motor');
    const ldrs = components.filter(c => c.type === 'ldr');
    const tempSensors = components.filter(c => c.type === 'temp_sensor');
    const logicGates = components.filter(c => ['and_gate', 'or_gate', 'not_gate', 'xor_gate'].includes(c.type));
    const displays = components.filter(c => c.type === 'display7seg');
    const battery = components.find(c => c.type === 'battery');

    // Pin definitions
    lines.push('// --- Pin Declarations & Component Parameters ---');
    if (battery) {
      lines.push(`const float supplyVoltage = ${battery.properties?.voltage || 5}.0; // Volts DC`);
    }

    resistors.forEach((r, idx) => {
      const resVal = r.properties?.resistance || 220;
      const resName = (r.properties?.name || `R${idx + 1}`).replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`const long ${resName}_val = ${resVal}; // Resistance in Ohms (Ω)`);
    });

    leds.forEach((led, idx) => {
      const pin = 13 - (idx % 4);
      const name = (led.properties?.name || `LED_${idx + 1}`).toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`const int ${name}Pin = ${pin}; // Color: ${led.properties?.colorName || 'Red'}`);
    });

    switches.forEach((sw, idx) => {
      const pin = 2 + idx;
      const name = (sw.properties?.name || `SW_${idx + 1}`).toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`const int ${name}Pin = ${pin}; // Toggle switch input`);
    });

    buttons.forEach((btn, idx) => {
      const pin = 4 + idx;
      const name = (btn.properties?.name || `BTN_${idx + 1}`).toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`const int ${name}Pin = ${pin}; // Push button input`);
    });

    buzzers.forEach((buzzer, idx) => {
      const pin = 8 + idx;
      const name = (buzzer.properties?.name || `BUZZ_${idx + 1}`).toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`const int ${name}Pin = ${pin}; // Piezo buzzer output`);
      lines.push(`const int ${name}Freq = ${buzzer.properties?.frequency || 2000}; // Frequency in Hz`);
    });

    motors.forEach((mtr, idx) => {
      const pin = 9; // PWM pin
      const name = (mtr.properties?.name || `MTR_${idx + 1}`).toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`const int ${name}Pin = ${pin}; // PWM speed control`);
    });

    ldrs.forEach((ldr, idx) => {
      lines.push(`const int ldrAnalogPin = A${idx}; // LDR Voltage Divider input`);
    });

    tempSensors.forEach((tmp, idx) => {
      lines.push(`const int tempSensorPin = A${idx + 1}; // TMP36 Analog input`);
    });

    // Setup Function
    lines.push('\nvoid setup() {');
    lines.push('  // Initialize Serial Monitor for telemetry diagnostics');
    lines.push('  Serial.begin(9600);');
    lines.push('  Serial.println(F("[SIH SIMULATOR] System initialized successfully."));');

    leds.forEach((led, idx) => {
      const name = (led.properties?.name || `LED_${idx + 1}`).toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`  pinMode(${name}Pin, OUTPUT);`);
    });

    switches.forEach((sw, idx) => {
      const name = (sw.properties?.name || `SW_${idx + 1}`).toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`  pinMode(${name}Pin, INPUT_PULLUP);`);
    });

    buttons.forEach((btn, idx) => {
      const name = (btn.properties?.name || `BTN_${idx + 1}`).toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`  pinMode(${name}Pin, INPUT_PULLUP);`);
    });

    buzzers.forEach((buzzer, idx) => {
      const name = (buzzer.properties?.name || `BUZZ_${idx + 1}`).toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`  pinMode(${name}Pin, OUTPUT);`);
    });

    motors.forEach((mtr, idx) => {
      const name = (mtr.properties?.name || `MTR_${idx + 1}`).toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`  pinMode(${name}Pin, OUTPUT);`);
    });

    lines.push('}\n');

    // Loop Function
    lines.push('void loop() {');

    if (switches.length > 0 && leds.length > 0) {
      const swName = (switches[0].properties?.name || 'SW_1').toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      const ledName = (leds[0].properties?.name || 'LED_1').toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`  // Read switch state (Active LOW with pull-up)`);
      lines.push(`  int switchState = digitalRead(${swName}Pin);`);
      lines.push(`  if (switchState == LOW) {`);
      lines.push(`    digitalWrite(${ledName}Pin, HIGH); // Turn LED ON`);
      lines.push(`  } else {`);
      lines.push(`    digitalWrite(${ledName}Pin, LOW);  // Turn LED OFF`);
      lines.push(`  }`);
    } else if (ldrs.length > 0 && leds.length > 0) {
      const ledName = (leds[0].properties?.name || 'LED_1').toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`  // Automatic street light: read ambient light`);
      lines.push(`  int lightRaw = analogRead(ldrAnalogPin);`);
      lines.push(`  Serial.print(F("Light Level: ")); Serial.println(lightRaw);`);
      lines.push(`  if (lightRaw < 400) { // Darkness threshold`);
      lines.push(`    digitalWrite(${ledName}Pin, HIGH); // Street light activated`);
      lines.push(`  } else {`);
      lines.push(`    digitalWrite(${ledName}Pin, LOW);`);
      lines.push(`  }`);
    } else if (tempSensors.length > 0) {
      lines.push(`  // Read analog temperature from TMP36`);
      lines.push(`  int rawTemp = analogRead(tempSensorPin);`);
      lines.push(`  float voltage = (rawTemp * 5.0) / 1024.0;`);
      lines.push(`  float temperatureC = (voltage - 0.5) * 100.0;`);
      lines.push(`  Serial.print(F("Temperature: ")); Serial.print(temperatureC); Serial.println(F(" C"));`);
      if (buzzers.length > 0) {
        const buzzName = (buzzers[0].properties?.name || 'BUZZ_1').toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
        lines.push(`  if (temperatureC > 35.0) {`);
        lines.push(`    tone(${buzzName}Pin, ${buzzName}Freq); // High temp alarm`);
        lines.push(`  } else {`);
        lines.push(`    noTone(${buzzName}Pin);`);
        lines.push(`  }`);
      }
    } else if (logicGates.length > 0) {
      lines.push('  // Digital combinational logic evaluation');
      lines.push('  bool inputA = HIGH;');
      lines.push('  bool inputB = HIGH;');
      const gateType = logicGates[0].type;
      if (gateType === 'and_gate') {
        lines.push('  bool result = inputA && inputB;');
      } else if (gateType === 'or_gate') {
        lines.push('  bool result = inputA || inputB;');
      } else if (gateType === 'not_gate') {
        lines.push('  bool result = !inputA;');
      } else if (gateType === 'xor_gate') {
        lines.push('  bool result = inputA ^ inputB;');
      }
      if (leds.length > 0) {
        const ledName = (leds[0].properties?.name || 'LED_1').toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
        lines.push(`  digitalWrite(${ledName}Pin, result ? HIGH : LOW);`);
      }
    } else if (leds.length > 0) {
      // Classic LED pulse / blink
      leds.forEach((led, idx) => {
        const name = (led.properties?.name || `LED_${idx + 1}`).toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
        lines.push(`  digitalWrite(${name}Pin, HIGH); // Turn ${led.properties?.colorName || 'LED'} ON`);
      });
      lines.push('  delay(500); // 500ms delay');
      leds.forEach((led, idx) => {
        const name = (led.properties?.name || `LED_${idx + 1}`).toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
        lines.push(`  digitalWrite(${name}Pin, LOW);  // Turn ${led.properties?.colorName || 'LED'} OFF`);
      });
      lines.push('  delay(500); // 500ms delay');
    } else if (motors.length > 0) {
      const mtrName = (motors[0].properties?.name || 'MTR_1').toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`  // Drive DC motor at regulated PWM duty cycle (0-255)`);
      lines.push(`  analogWrite(${mtrName}Pin, 200);`);
      lines.push('  delay(100);');
    } else {
      lines.push('  // Circuit active. Awaiting component triggers.');
      lines.push('  delay(100);');
    }

    lines.push('}');
    return lines.join('\n');
  }

  // --- PYTHON GENERATOR ---
  static generatePython(components, connections) {
    const lines = [];
    lines.push('# =================================================');
    lines.push('# Smart India Hackathon - Auto-Generated Python Code');
    lines.push('# Environment: Raspberry Pi (RPi.GPIO / CircuitPython)');
    lines.push('# =================================================\n');
    lines.push('import time');
    lines.push('import RPi.GPIO as GPIO\n');
    lines.push('# Configure GPIO Pinout standard');
    lines.push('GPIO.setmode(GPIO.BCM)');
    lines.push('GPIO.setwarnings(False)\n');

    const leds = components.filter(c => c.type === 'led');
    const switches = components.filter(c => c.type === 'switch');
    const buttons = components.filter(c => c.type === 'button');
    const motors = components.filter(c => c.type === 'motor');
    const buzzers = components.filter(c => c.type === 'buzzer');

    lines.push('# Pin Mappings & Configuration');
    leds.forEach((led, idx) => {
      const pin = 17 + idx;
      const name = (led.properties?.name || `LED_${idx + 1}`).toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`${name}_pin = ${pin} # ${led.properties?.colorName || 'Red'} LED`);
      lines.push(`GPIO.setup(${name}_pin, GPIO.OUT)`);
    });

    switches.forEach((sw, idx) => {
      const pin = 23 + idx;
      const name = (sw.properties?.name || `SW_${idx + 1}`).toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`${name}_pin = ${pin}`);
      lines.push(`GPIO.setup(${name}_pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)`);
    });

    buttons.forEach((btn, idx) => {
      const pin = 25 + idx;
      const name = (btn.properties?.name || `BTN_${idx + 1}`).toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`${name}_pin = ${pin}`);
      lines.push(`GPIO.setup(${name}_pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)`);
    });

    motors.forEach((mtr, idx) => {
      const pin = 18;
      const name = (mtr.properties?.name || `MTR_${idx + 1}`).toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`${name}_pin = ${pin}`);
      lines.push(`GPIO.setup(${name}_pin, GPIO.OUT)`);
      lines.push(`motor_pwm = GPIO.PWM(${name}_pin, 100) # 100Hz frequency`);
      lines.push('motor_pwm.start(75) # 75% duty cycle');
    });

    buzzers.forEach((buzzer, idx) => {
      const pin = 24 + idx;
      const name = (buzzer.properties?.name || `BUZZ_${idx + 1}`).toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`${name}_pin = ${pin}`);
      lines.push(`GPIO.setup(${name}_pin, GPIO.OUT)`);
    });

    lines.push('\nprint("[SIH SIMULATOR] Python control script running...")\n');
    lines.push('try:');
    lines.push('    while True:');

    if (switches.length > 0 && leds.length > 0) {
      const swName = (switches[0].properties?.name || 'SW_1').toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      const ledName = (leds[0].properties?.name || 'LED_1').toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`        # Poll switch status`);
      lines.push(`        if GPIO.input(${swName}_pin) == GPIO.LOW:`);
      lines.push(`            GPIO.output(${ledName}_pin, GPIO.HIGH)`);
      lines.push(`        else:`);
      lines.push(`            GPIO.output(${ledName}_pin, GPIO.LOW)`);
      lines.push('        time.sleep(0.05)');
    } else if (leds.length > 0) {
      leds.forEach((led, idx) => {
        const name = (led.properties?.name || `LED_${idx + 1}`).toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
        lines.push(`        GPIO.output(${name}_pin, GPIO.HIGH)`);
      });
      lines.push('        time.sleep(0.5)');
      leds.forEach((led, idx) => {
        const name = (led.properties?.name || `LED_${idx + 1}`).toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
        lines.push(`        GPIO.output(${name}_pin, GPIO.LOW)`);
      });
      lines.push('        time.sleep(0.5)');
    } else {
      lines.push('        # Circuit active');
      lines.push('        time.sleep(0.1)');
    }

    lines.push('except KeyboardInterrupt:');
    lines.push('    print("Simulation stopped by user.")');
    lines.push('finally:');
    lines.push('    GPIO.cleanup()');

    return lines.join('\n');
  }

  // --- JAVASCRIPT / JOHNNY-FIVE GENERATOR ---
  static generateJavaScript(components, connections) {
    const lines = [];
    lines.push('// =================================================');
    lines.push('// Smart India Hackathon - Auto-Generated Node.js Code');
    lines.push('// Framework: Johnny-Five IoT Robotics Architecture');
    lines.push('// =================================================\n');
    lines.push('const { Board, Led, Button, Switch, Motor, Piezo, Sensor } = require("johnny-five");');
    lines.push('const board = new Board();\n');

    lines.push('board.on("ready", () => {');
    lines.push('  console.log("🚀 [SIH SIMULATOR] Johnny-Five board connected!");\n');

    const leds = components.filter(c => c.type === 'led');
    const switches = components.filter(c => c.type === 'switch');
    const buttons = components.filter(c => c.type === 'button');
    const motors = components.filter(c => c.type === 'motor');
    const buzzers = components.filter(c => c.type === 'buzzer');
    const ldrs = components.filter(c => c.type === 'ldr');

    leds.forEach((led, idx) => {
      const pin = 13 - (idx % 4);
      const name = (led.properties?.name || `LED_${idx + 1}`).toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`  const ${name} = new Led(${pin}); // ${led.properties?.colorName || 'Red'}`);
    });

    switches.forEach((sw, idx) => {
      const pin = 2 + idx;
      const name = (sw.properties?.name || `SW_${idx + 1}`).toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`  const ${name} = new Switch(${pin});`);
    });

    buttons.forEach((btn, idx) => {
      const pin = 4 + idx;
      const name = (btn.properties?.name || `BTN_${idx + 1}`).toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`  const ${name} = new Button(${pin});`);
    });

    motors.forEach((mtr, idx) => {
      const pin = 9;
      const name = (mtr.properties?.name || `MTR_${idx + 1}`).toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`  const ${name} = new Motor({ pin: ${pin} });`);
      lines.push(`  ${name}.start(200);`);
    });

    buzzers.forEach((buzzer, idx) => {
      const pin = 8 + idx;
      const name = (buzzer.properties?.name || `BUZZ_${idx + 1}`).toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`  const ${name} = new Piezo(${pin});`);
    });

    if (switches.length > 0 && leds.length > 0) {
      const swName = (switches[0].properties?.name || 'SW_1').toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      const ledName = (leds[0].properties?.name || 'LED_1').toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`\n  // Wire switch events to LED`);
      lines.push(`  ${swName}.on("close", () => ${ledName}.on());`);
      lines.push(`  ${swName}.on("open", () => ${ledName}.off());`);
    } else if (buttons.length > 0 && leds.length > 0) {
      const btnName = (buttons[0].properties?.name || 'BTN_1').toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      const ledName = (leds[0].properties?.name || 'LED_1').toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`\n  ${btnName}.on("press", () => ${ledName}.toggle());`);
    } else if (leds.length > 0) {
      const ledName = (leds[0].properties?.name || 'LED_1').toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`\n  // Pulse LED rhythm`);
      lines.push(`  ${ledName}.blink(500);`);
    }

    lines.push('});');
    return lines.join('\n');
  }

  static getEmptyTemplate(language) {
    if (language === 'python') {
      return `# Python Simulation Script
# Drag components onto the canvas to generate hardware code dynamically.

import time

def setup():
    print("Circuit canvas is empty. Add a Battery, Resistor, and LED to start!")

if __name__ == "__main__":
    setup()
`;
    }

    if (language === 'javascript') {
      return `// JavaScript (Johnny-Five / Node Hardware)
// Drag components onto the canvas to generate hardware code dynamically.

console.log("Simulation canvas is empty.");
console.log("Select a component from the left sidebar to begin!");
`;
    }

    return `// Arduino C++ Hardware Simulation Script
// Drag components from the left sidebar onto the canvas to generate code.

void setup() {
  Serial.begin(9600);
  Serial.println(F("Welcome to Smart India Hackathon Simulation Lab!"));
}

void loop() {
  // Your generated hardware loop will appear here live as you wire components.
}
`;
  }
}
