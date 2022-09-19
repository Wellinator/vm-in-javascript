const Terminal = require('../FrontEnd/terminal');

const moveTo = (x, y) => {
  Terminal.print(`\x1b[${y};${x}H`);
};

const createScreenDevice = () => {
  return {
    getUint8: () => 0,
    getUint16: () => 0,
    setUint16: (address, data) => {
      const characterValue = data & 0x00ff;

      const x = address % 16;
      const y = Math.floor(address / 16);

      moveTo(x, y);
      const character = String.fromCharCode(characterValue);
      Terminal.print(character);
    },
  };
};
