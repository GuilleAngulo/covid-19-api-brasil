const path = require('path');
const fs = require('fs');
const log4js = require('log4js');

const { setUpDirectory, existsDirectory } = require('./directory');

module.exports = {
    createAccessLogStream(logPath) {
        if (!existsDirectory(logPath)) setUpDirectory(logPath);
        return accessLogStream = fs.createWriteStream(path.join(logPath, 'access.log'), { flags: 'a' });
    },

    createUpdateLogger(logPath) {
        log4js.configure({
            appenders: { 
                update: { type: 'file', filename: path.join(logPath, 'update.log') },
                error: { type: 'file', filename: path.join(logPath, 'error.log') },
                'errors': { type: 'logLevelFilter', appender: 'error', level: 'error' },
            },
            categories: { default: { appenders: ['update', 'errors'], level: 'debug' } }
          });

          return log4js.getLogger();
    }
}