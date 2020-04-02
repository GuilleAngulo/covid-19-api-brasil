const path = require('path');
const fs = require('fs');

module.exports = {
    createDirectory(directoryPath) {
        try {
            fs.mkdirSync(directoryPath);
        } catch (error) {
            if (error.code != 'EEXIST') {
              console.error(`Error setting up the directory at ${directoryPath}:`, error);
              process.exit(1);
            }
        }
    },

    cleanDirectory(directoryPath) {
        const files = fs.readdirSync(directoryPath);
            for (let file of files) {
                try {
                    fs.unlinkSync(path.join(directoryPath, file));
                } catch (error) {
                    console.error(`Error removing the file ${file}:`, error);
                }
            }
    },

    existsDirectory(directoryPath) {
        try {
            fs.readdirSync(directoryPath);
            return true;
        } catch (error) {
            return false;
        }
    },

    setUpDirectory(directoryPath) {
        try {
            cleanDirectory(directoryPath);
        } catch (error) {
            console.log(`Directory ${directoryPath} not found. Creating directory ...`);
            module.exports.createDirectory(directoryPath);
        }
    },
}
