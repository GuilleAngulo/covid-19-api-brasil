const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000

const regionRoutes = require('./app/routes/RegionRoutes');
const stateRoutes = require('./app/routes/StateRoutes');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, '/log/access.log'), { flags: 'a' })

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('combined', { stream: accessLogStream }));

app.use('/region', regionRoutes);
app.use('/state', stateRoutes);


app.listen(port, () => {
    console.log(`Server running on port ${port}.`); 
 });