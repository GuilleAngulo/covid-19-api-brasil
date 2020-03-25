const express = require('express');

const router = express.Router();

const RegionController = require('../controllers/RegionController');

router.get('/', RegionController.index);
router.get('/:regionId', RegionController.find);
router.post('/', RegionController.create);
router.put('/:regionId', RegionController.update);
router.delete('/:regionId', RegionController.remove);

module.exports = router;