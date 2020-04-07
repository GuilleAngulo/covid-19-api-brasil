jest.mock('fs');

const fs = require('fs');
const path = require('path');

describe('log utils', () => {

    const MOCK_FILE_INFO = {
        [path.join('path', 'temp', 'data.csv')]: 'csv file',
        [path.join('path', 'temp', 'file.txt')]: 'txt file',
    };

    beforeEach(() => {
        
        fs.__setMockFiles(MOCK_FILE_INFO);
    });
  
    it('should create a new directory', () => {
    
        const { createDirectory } = require('../../src/app/utils/directory');
        const directoryPath = path.join('path', 'test');
        
        createDirectory(directoryPath);

        expect(fs.existsSync(directoryPath)).toBe(true);
    });

    it('should clean directory if exists', () => {

        const { cleanDirectory } = require('../../src/app/utils/directory');
        const directoryPath = path.join('path', 'temp');

        expect(fs.readdirSync(directoryPath).length).toBe(2);

        cleanDirectory(directoryPath);

        expect(fs.readdirSync(directoryPath).length).toBe(0);

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