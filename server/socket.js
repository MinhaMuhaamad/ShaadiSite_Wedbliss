let ioInstance = null;

function setIo(io) {
  ioInstance = io;
}

function getIo() {
  if (!ioInstance) return null;
  return ioInstance;
}

module.exports = { setIo, getIo };

