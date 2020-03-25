const express = require('express');
var authMiddleware = require('../middlewares/auth');
const StateController = require('../controllers/StateController');

const router = express.Router();

router.get('/', StateController.index);
router.get('/id/:stateId', StateController.find);
router.get('/:code', StateController.findByCode);
router.post('/', authMiddleware, StateController.create);
router.put('/id/:stateId', authMiddleware, StateController.update);
router.put('/:code', authMiddleware, StateController.updateByCode);
router.delete('/:stateId', authMiddleware, StateController.remove);

module.exports = router;