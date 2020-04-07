const path = require('path');

const fs = jest.genMockFromModule('fs');

let mockFiles = Object.create(null);
function __setMockFiles(newMockFiles) {
  mockFiles = Object.create(null);
  for (const file in newMockFiles) {
    const dir = path.dirname(file);

    if (!mockFiles[dir]) {
      mockFiles[dir] = [];
    }
    mockFiles[dir].push(path.basename(file));
  }
}

function readdirSync(directoryPath) {
  return mockFiles[directoryPath] || [];
}

function mkdirSync(directoryPath) {
    mockFiles[directoryPath] = [];
    return directoryPath;
}

function existsSync(directoryPath) {
    return mockFiles[directoryPath] ? true : false;
}

function unlinkSync(filePath) {
    const dir = path.dirname(filePath);
    const index = mockFiles[dir].indexOf(path.basename(filePath));
    if (index > -1) {
        mockFiles[dir] = [
            ...mockFiles[dir].slice(0, index),
            ...mockFiles[dir].slice(index + 1)
          ];
    }
}



fs.__setMockFiles = __setMockFiles;
fs.readdirSync = readdirSync;
fs.mkdirSync = mkdirSync;
fs.existsSync = existsSync;
fs.unlinkSync = unlinkSync;

module.exports = fs;