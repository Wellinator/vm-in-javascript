const createMemory = (sizeInBytes) => {
  const ab = new ArrayBuffer(sizeInBytes);
  return new DataView(ab);
};

module.exports = createMemory;
