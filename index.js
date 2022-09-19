import './style.css';

const createMemory = require('./VM/create-memory');
const CPU = require('./VM/cpu');
const instructions = require('./VM/instructions');
const MemoryMapper = require('./VM/memory-mapper');

const IP = 0;
const ACC = 1;
const R1 = 2;
const R2 = 3;
const R3 = 4;
const R4 = 5;
const R5 = 6;
const R6 = 7;
const R7 = 8;
const R8 = 9;
const SP = 10;
const FP = 11;

const MM = new MemoryMapper();

const memory = createMemory(256 * 256);
MM.map(memory, 0, 0xffff);

//Map 0xFF bytes of the address space to an "output device" - just stdout
MM.map(createScreenDevice(), 0x3000, 0x30ff, true);

const writableBytes = new Uint8Array(memory.buffer);

const cpu = new CPU(MM);

const subRoutineAddress = 0x3000;
let i = 0;

// Main Routine
{
  writableBytes[i++] = instructions.PSH_LIT;
  writableBytes[i++] = 0x33;
  writableBytes[i++] = 0x33;

  writableBytes[i++] = instructions.PSH_LIT;
  writableBytes[i++] = 0x22;
  writableBytes[i++] = 0x22;

  writableBytes[i++] = instructions.PSH_LIT;
  writableBytes[i++] = 0x11;
  writableBytes[i++] = 0x11;

  writableBytes[i++] = instructions.MOV_LIT_REG;
  writableBytes[i++] = 0x12;
  writableBytes[i++] = 0x34;
  writableBytes[i++] = R1;

  writableBytes[i++] = instructions.MOV_LIT_REG;
  writableBytes[i++] = 0x56;
  writableBytes[i++] = 0x78;
  writableBytes[i++] = R4;

  writableBytes[i++] = instructions.PSH_LIT;
  writableBytes[i++] = 0x00;
  writableBytes[i++] = 0x00;

  writableBytes[i++] = instructions.CAL_LIT;
  writableBytes[i++] = (subRoutineAddress & 0xff00) >> 8;
  writableBytes[i++] = subRoutineAddress & 0x00ff;

  writableBytes[i++] = instructions.PSH_LIT;
  writableBytes[i++] = 0x44;
  writableBytes[i++] = 0x44;
}

// Subroutine
{
  i = subRoutineAddress;

  writableBytes[i++] = instructions.PSH_LIT;
  writableBytes[i++] = 0x01;
  writableBytes[i++] = 0x02;

  writableBytes[i++] = instructions.PSH_LIT;
  writableBytes[i++] = 0x03;
  writableBytes[i++] = 0x04;

  writableBytes[i++] = instructions.PSH_LIT;
  writableBytes[i++] = 0x05;
  writableBytes[i++] = 0x06;

  writableBytes[i++] = instructions.MOV_LIT_REG;
  writableBytes[i++] = 0x07;
  writableBytes[i++] = 0x08;
  writableBytes[i++] = R1;

  writableBytes[i++] = instructions.MOV_LIT_REG;
  writableBytes[i++] = 0x09;
  writableBytes[i++] = 0x0a;
  writableBytes[i++] = R8;

  writableBytes[i++] = instructions.RET;
}

// Run the Code step by step
{
  cpu.debug();
  cpu.viewMemoryAt(cpu.getRegister('ip'));
  cpu.viewMemoryAt(0xffff - 1 - 42, 44);

  document.addEventListener('keydown', (e) => {
    if (e.key == 'Enter') {
      cpu.step();
      cpu.debug();
      cpu.viewMemoryAt(cpu.getRegister('ip'));
      cpu.viewMemoryAt(0xffff - 1 - 42, 44);
    }
  });
}
