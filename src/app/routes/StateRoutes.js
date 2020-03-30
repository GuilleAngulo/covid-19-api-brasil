const express = require('express');

const authMiddleware = require('../middlewares/auth');
const StateController = require('../controllers/StateController');
const StateValidator = require('../validators/StateValidator');

const router = express.Router();

router.get('/', StateController.index);
router.get('/id/:stateId', StateValidator.find, StateController.find);
router.get('/:code', StateValidator.findByCode, StateController.findByCode);
router.post('/', authMiddleware, StateController.create);
router.put('/id/:stateId', authMiddleware, StateController.update);
router.put('/:code', authMiddleware, StateController.updateByCode);
router.delete('/:stateId', authMiddleware, StateController.remove);

module.exports = router;