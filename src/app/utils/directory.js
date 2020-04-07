const path = require('path');
const fs = require('fs');

module.exports = {
    createDirectory(directoryPath) {
        try {
            fs.mkdirSync(directoryPath);
        } catch (error) {
            if (error.code != 'EEXIST') {
              console.error(`Error creating directory at ${directoryPath}:`, error);
              process.exit(1);
            }
        }
    },

    cleanDirectory(directoryPath) {
        if (fs.existsSync(directoryPath)) {
            const files = fs.readdirSync(directoryPath);
            if (files.length) {
                try {    
                    for (let file of files) {
                        fs.unlinkSync(path.join(directoryPath, file));
                    }
                } catch (error) {
                    console.error(`Error cleaning directory at ${directoryPath}:`, error);
                }
            }
        }
    },
}
