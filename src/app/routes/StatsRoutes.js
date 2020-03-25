const express = require('express');

const StatsController = require('../controllers/StatsController');

const router = express.Router();

router.get('/total', StatsController.total);

module.exports = router;