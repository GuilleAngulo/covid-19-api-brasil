const path = require('path');
const fs = require('fs');
const log4js = require('log4js');

const { createDirectory } = require('./directory');

module.exports = {
    createLogStream(logPath, logName) {
        if (!fs.existsSync(logPath)) createDirectory(logPath);
        return fs.createWriteStream(path.join(logPath, logName), { flags: 'a' });
    },

    createUpdateLogger(logPath) {
        log4js.configure({
            appenders: { 
                update: { type: 'file', filename: path.join(logPath, 'update.log') },
            },
            categories: { default: { appenders: ['update'], level: 'debug' } }
          });

          return log4js.getLogger();
    }
}