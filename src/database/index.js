const mongoose = require('mongoose');
const { username, password, host, database } = require('../config/database');

mongoose.connect(`mongodb+srv://${username}:${password}@${host}/${database}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

mongoose.Promise = global.Promise;
module.exports = mongoose; 