const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { errors } = require('celebrate');

const addRequestId = require('express-request-id')();
const { createLogStream } = require('./app/utils/log');

const regionRoutes = require('./app/routes/RegionRoutes');
const stateRoutes = require('./app/routes/StateRoutes');
const statsRoutes = require('./app/routes/StatsRoutes');


const app = express();

app.use(helmet());
//app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const loggerFormat = ':id [:date[web]]" :method :url" :status :response-time ms';
const accessStream = createLogStream(path.join(__dirname, 'log'), 'access.log');
const errorStream = createLogStream(path.join(__dirname, 'log'), 'error.log');

app.use(addRequestId);
morgan.token('id', req => req.id);

app.use(morgan(loggerFormat, {
    skip: (req, res) => res.statusCode < 400,
    stream: errorStream,
}));

app.use(morgan(loggerFormat, {
    skip: (req, res) => res.statusCode >= 400,
    stream: accessStream,
}));

app.use('/region', regionRoutes);
app.use('/state', stateRoutes);
app.use('/stats', statsRoutes);

app.use(errors());

module.exports = app;