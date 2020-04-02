const express = require('express');

const router = express.Router();

const authMiddleware = require('../middlewares/auth');

const RegionController = require('../controllers/RegionController');
const RegionValidator = require('../validators/RegionValidator');

router.get('/', RegionController.index);
router.get('/id/:regionId', RegionValidator.find, RegionController.find);
router.get('/:name', RegionValidator.findByName, RegionController.findByName);
router.post('/', RegionValidator.create, authMiddleware, RegionController.create);
router.put('/:regionId', RegionValidator.update, authMiddleware, RegionController.update);
router.delete('/:regionId', RegionValidator.remove, authMiddleware, RegionController.remove);

module.exports = router;