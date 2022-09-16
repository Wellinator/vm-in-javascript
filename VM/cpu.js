const createMemory = require('./create-memory');
const instructions = require('./instructions');
const Terminal = require('../FrontEnd/terminal');

class CPU {
  constructor(memory) {
    this.memory = memory;

    this.registersNames = [
      'ip', //Instruction Pointer
      'acc', //Accumulator
      'r1', //General Registers
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

  debug() {
    this.registersNames.forEach((name) => {
      Terminal.print(
        `${name}: 0x${this.getRegister(name).toString(16).padStart(4, '0')}`
      );
    });
  }

  /**
   * Print the address, one bit before and the next seven bytes after;
   * @example 0x0f01(target adrress): (previous byte ->) 0x04 (next bytes ->) 0x05 0xA3 0xFE 0x13 0x0D 0x44 0x0F
   */
  viewMemoryAt(address) {
    const nextEightBytes = Array.from({ length: 8 }, (_, i) =>
      this.memory.getUint8(address + i)
    ).map((v) => `0x${v.toString(16).padStart(2, '0')}`);
    Terminal.printWarn(
      `0x${address.toString(16).padStart(4, '0')}: ${nextEightBytes.join(' ')}`
    );
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

    return this.registers.setUint16(this.registerMap[name], value);
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
      // Move literal into register
      case instructions.MOV_LIT_REG: {
        const literal = this.fetch16();
        const register = (this.fetch() % this.registersNames.length) * 2;
        this.registers.setUint16(register, literal);
        return;
      }

      // Move register to register
      case instructions.MOV_REG_REG: {
        const registerFrom = (this.fetch() % this.registersNames.length) * 2;
        const registerTo = (this.fetch() % this.registersNames.length) * 2;
        const value = this.registers.getUint16(registerFrom);
        this.registers.setUint16(registerTo, value);
        return;
      }

      // Move register to memory
      case instructions.MOV_REG_MEM: {
        const registerFrom = (this.fetch() % this.registersNames.length) * 2;
        const address = this.fetch16();
        const value = this.registers.getUint16(registerFrom);
        this.memory.setUint16(address, value);
        return;
      }

      // Move memory to register
      case instructions.MOV_MEM_REG: {
        const address = this.fetch16();
        const registerTo = (this.fetch() % this.registersNames.length) * 2;
        const value = this.memory.getUint16(address);
        this.registers.setUint16(registerTo, value);
        return;
      }

      // Add register to register
      case instructions.ADD_REG_REG: {
        const r1 = this.fetch();
        const r2 = this.fetch();
        const registerValue1 = this.registers.getUint16(r1 * 2);
        const registerValue2 = this.registers.getUint16(r2 * 2);
        this.setRegister('acc', registerValue1 + registerValue2);
        return;
      }

      // Jump if not equal
      case instruction.JMP_NOT_EQ: {
        const value = this.fetch16();
        const address = this.fetch16();
        if (value !== this.getRegister('acc')) {
          this.setRegister('ip', address);
        }
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
