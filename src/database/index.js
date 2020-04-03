const mongoose = require('mongoose');
const configuration = require('../config/database');
const config = process.env.NODE_ENV === 'test' ? configuration.test : configuration.development;
const { username, password, host, database } = config;

mongoose.connect(`mongodb+srv://${username}:${password}@${host}/${database}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

mongoose.Promise = global.Promise;
module.exports = mongoose; 