const { createDirectory, cleanDirectory } = require('../../src/app/utils/directory');
const fs = require('fs');

jest.mock('fs');

it('should create a directory', () => {
    
    createDirectory('path/test');
    expect(fs.mkdirSync).toHaveBeenCalled();

});

it('should read the directory and remove all files', () => {
    
    cleanDirectory('path/test');
    expect(fs.readdirSync).toHaveBeenCalled();
    expect(fs.unlinkSync).toHaveBeenCalled();

});

/**
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