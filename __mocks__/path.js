const path = jest.genMockFromModule('path');

function join(path1, path2) {
    return path1 + '\' + path2;
}

path.join = join;

module.exports = path;