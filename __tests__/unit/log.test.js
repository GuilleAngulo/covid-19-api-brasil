jest.mock('fs');

const fs = require('fs');
const path = require('path');

describe('directory utils', () => {

    const MOCK_FILE_INFO = {
        [path.join('path', 'test', 'access.log')]: 'access log',
    };

    beforeEach(() => {
        
        fs.__setMockFiles(MOCK_FILE_INFO);
    });

    test.skip('should create a new log stream', () => {
        const { createLogStream } = require('../../src/app/utils/log');
        const directoryPath = path.join('path', 'test');
        const stream = createLogStream(directoryPath, 'access.log');

        expect(fs.readdirSync(directoryPath).length).toBe(1);
        expect(stream).toBe(path.join('path', 'test','access.log'));
    });

    test.skip('should open existing log stream', () => {
        const { createLogStream } = require('../../src/app/utils/log');
        const directoryPath = path.join('path', 'test');
        const stream = createLogStream(directoryPath, 'access.log');

        expect(fs.readdirSync(directoryPath).length).toBe(1);
        expect(stream).toBe(path.join('path', 'test','access.log'));
    })
    
});