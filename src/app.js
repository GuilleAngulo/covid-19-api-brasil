const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { errors } = require('celebrate');
const { createAccessLogStream } = require('./app/utils/log');

const regionRoutes = require('./app/routes/RegionRoutes');
const stateRoutes = require('./app/routes/StateRoutes');
const statsRoutes = require('./app/routes/StatsRoutes');


const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('combined', { stream: createAccessLogStream(path.join(__dirname, '/log')) }));

app.use('/region', regionRoutes);
app.use('/state', stateRoutes);
app.use('/stats', statsRoutes);

app.use(errors());

module.exports = app;