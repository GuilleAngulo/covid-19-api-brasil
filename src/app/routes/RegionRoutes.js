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


/**
 * @swagger
 * tags:
 *   name: Regions
 *   description: Region management
 */

 /**
 * @swagger
 * paths:
 *  /regions:
 *    get:
 *      tags: [Regions]
 *      summary: List Region
 *      description: This resource returns the complete list of **regions**.
 *      operationId: getRegions
 *      responses:
 *        "200":
 *          description: Successful operation. Regions listed. 
 *          content:
 *            application/json:
 *              schema:
 *                  $ref: '#/components/responses/Regions'
 *        "500":
 *          description: Internal Server Error. Error listing regions.
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/Error'
 *              example: 
 *                  error: Internal Server Error. Error listing regions.
 * 
 * 
 *  /regions/{name}:
 *    get:
 *      tags: [Regions]
 *      summary: Get State by Name
 *      description: This resource **finds** and returns a **region** by its `name`.
 *      operationId: getStateByCode
 *      parameters:
 *        - $ref: '#/components/parameters/name'
 *      responses:
 *        "200":
 *          description: Successful operation. Region listed. 
 *          content:
 *            application/json:
 *              schema:
 *                  $ref: '#/components/responses/Region'
 *        "400":
 *          description: Bad request. Wrong Region Name.
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/BadRequest'
 *        "404":
 *          description: Region not found.
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/Error'
 *              example: 
 *                  error: Region not found.
 *        "500":
 *          description: Internal Server Error. Error finding the region.
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/Error'
 *              example: 
 *                  error: Internal Server Error. Error finding the region.
 */