const createMemory = require('./create-memory');

class CPU {
  constructor(memory) {
    this.memory = memory;

    this.registersNames = [
      'ip', //Instruction Pointer
      'acc', //Accumulator

      //General Registers
      'r1',
      'r2',
      'r3',
      'r4',
      'r5',
      'r6',
      'r7',
      'r8',
    ];

    this.registers = createMemory(this.registersNames.length * 2);

    this.registerMap = this.registersNames.reduce((map, name, i) => {
      map[name] = i * 2;
      return map;
    }, {});
  }

  getRegister(name) {
    if (!(name in this.registerMap)) {
      throw new Error(`getRegister: No such register '${name}'`);
    }

    return this.registers.getUint16(this.registerMap[name]);
  }

  setRegister(name, value) {
    if (!(name in this.registerMap)) {
      throw new Error(`getRegister: No such register '${name}'`);
    }

    return this.registers.getUint16(this.registerMap[name], value);
  }

  fetch() {
    const nextInstructionAddress = this.getRegister('ip');
    const instruction = this.memory.getUint8(nextInstructionAddress);
    this.setRegister('ip', nextInstructionAddress + 1);
    return instruction;
  }

  fetch16() {
    const nextInstructionAddress = this.getRegister('ip');
    const instruction = this.memory.getUint16(nextInstructionAddress);
    this.setRegister('ip', nextInstructionAddress + 2);
    return instruction;
  }

  execute(instruction) {
    switch (instruction) {
      // Move literal into the r1 register
      case 0x10: {
        const literal = this.fetch16();
        this.setRegister('r1', literal);
        return;
      }

      // Move literal into the r2 register
      case 0x11: {
        const literal = this.fetch16();
        this.setRegister('r2', literal);
        return;
      }

      // Add register to register
      case 0x12: {
        const r1 = this.fetch();
        const r2 = this.fetch();
        const registerValue1 = this.registers.getUint16(r1 * 2);
        const registerValue2 = this.registers.getUint16(r2 * 2);
        this.setRegister('acc', registerValue1 + registerValue2);
        return;
      }
    }
  }

  step() {
    const instruction = this.fetch();
    return this.execute(instruction);
  }
}

module.exports = CPU;