const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const { options } = require('../../config/swagger.json');

const specs = swaggerJsdoc(options);

const router = express.Router();

router.use('/docs', swaggerUi.serve);

router.get('/docs', swaggerUi.setup(specs, { explorer: true }));


module.exports = router;