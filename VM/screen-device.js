const Terminal = require('../FrontEnd/terminal');

const moveTo = (x, y) => {
  Terminal.print(`\x1b[${y};${x}H`);
};

const createScreenDevice = () => {
  return {
    getUint16: () => 0,
    getUint8: () => 0,
    setUint16: (address, data) => {
      const characterValue = data & 0x00ff;

      const x = (address % 16) + 1;
      const y = Math.floor(address / 16) + 1;

      // moveTo(x * 2, y);
      const character = String.fromCharCode(characterValue);
      Terminal.print(character);
    },
  };
};

module.exports = createScreenDevice;
