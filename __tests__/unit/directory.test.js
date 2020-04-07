jest.mock('fs');

const fs = require('fs');
const path = require('path');

describe('directory utils', () => {

    const MOCK_FILE_INFO = {
        [path.join('path', 'temp', 'data.csv')]: 'csv file',
        [path.join('path', 'temp', 'file.txt')]: 'txt file',
    };

    beforeEach(() => {
        
        fs.__setMockFiles(MOCK_FILE_INFO);
    });
  
    test.skip('should create a new directory', () => {
    
        const { createDirectory } = require('../../src/app/utils/directory');
        const directoryPath = path.join('path', 'test');

        expect(fs.existsSync(directoryPath)).toBe(false);
        
        createDirectory(directoryPath);

        expect(fs.existsSync(directoryPath)).toBe(true);
    });

    test.skip('should clean directory if exists', () => {

        const { cleanDirectory } = require('../../src/app/utils/directory');
        const directoryPath = path.join('path', 'temp');

        expect(fs.readdirSync(directoryPath).length).toBe(2);

        cleanDirectory(directoryPath);

        expect(fs.readdirSync(directoryPath).length).toBe(0);

    });

    test.skip('should clean directory after new file addition', () => {

        const { createDirectory, cleanDirectory } = require('../../src/app/utils/directory');
        const newDirectoryPath = path.join('path', 'test');
        const existingDirectoryPath = path.join('path', 'temp');

        createDirectory(newDirectoryPath);

        expect(fs.existsSync(newDirectoryPath)).toBe(true);
        expect(fs.existsSync(existingDirectoryPath)).toBe(true);
        expect(fs.readdirSync(newDirectoryPath).length).toBe(0);
        expect(fs.readdirSync(existingDirectoryPath).length).toBe(2);

        fs.writeFile('data.txt', 'Hello World', newDirectoryPath);
        fs.writeFile('data.txt', 'Hello World', existingDirectoryPath);

        expect(fs.readdirSync(newDirectoryPath).length).toBe(1);
        expect(fs.readdirSync(existingDirectoryPath).length).toBe(3);

        cleanDirectory(newDirectoryPath);
        cleanDirectory(existingDirectoryPath);

        expect(fs.readdirSync(newDirectoryPath).length).toBe(0);
        expect(fs.readdirSync(existingDirectoryPath).length).toBe(0);

    });
  });


  /**
 * 
it('should create a directory', () => {
    
    createDirectory('path/test');
    expect(fs.mkdirSync).toHaveBeenCalled();

});

it('should read the directory and remove all files', () => {
    
    cleanDirectory('path/test');
    expect(fs.readdirSync).toHaveBeenCalled();
    expect(fs.unlinkSync).toHaveBeenCalled();

});


it('should NOT create a new log directory if one already exists', () => {

    fs.existsSync.mockReturnValue(true);

    createDirectory = jest.fn();
    fs.existsSync.mockReturnValue(false);
    
    setUpDirectory('path/test');

    expect(fs.existsSync).toHaveBeenCalled();
    expect(createDirectory).toHaveBeenCalled();

    directory.setUpDirectory('path/test');
    const mkdirSync = jest.spyOn(directory, 'fs.mkdirSync');
    const readdirSync = jest.spyOn(directory, 'fs.readdirSync');
    const unlinkSync = jest.spyOn(directory, 'fs.unlinkSync');

    expect(mkdirSync).not.toHaveBeenCalled();
    expect(readdirSync).toHaveBeenCalled();
    expect(unlinkSync).toHaveBeenCalled();
}); */