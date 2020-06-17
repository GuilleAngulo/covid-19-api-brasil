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
 *      summary: List Regions
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
 *    post:
 *      tags: [Regions]
 *      summary: Create Region
 *      description: This resource **creates** a new **region** in the system. The request needs to include a the Bearer`token` at header, generated at Authenticate User.
 *      operationId: createRegion
 *      security:
 *          - token: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/requests/RegionCreate'
 *      responses:
 *        "201":
 *          description: Successful operation. Region created. 
 *          content:
 *            application/json:
 *              schema:
 *                  $ref: '#/components/responses/RegionSimple'
 *        "400":
 *          description: Bad request. Request body incomplete or incorrect.
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/BadRequest'
 *        "409":
 *          description: Conflict error. Region already exists. Returns existing Region.
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/Region'
 *        "500":
 *          description: Internal Server Error. Region creation failed.
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/Error'
 *              example: 
 *                  error: Internal Server Error. Region creation failed.
 * 
 * 
 *  /regions/{name}:
 *    get:
 *      tags: [Regions]
 *      summary: Get Region by Name
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
 *              example:
 *                  statusCode: 400
 *                  error: Bad Request
 *                  message: \"name\" must be one of [norte, nordeste, sudeste, centro-oeste, sul]
 *                  validation: 
 *                      source: params
 *                      keys: 
 *                          [name]
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
 *                 error: Internal Server Error. Error finding the region.
 * 
 *    
 *  /regions/{regionId}:
 *    put:
 *      tags: [Regions]
 *      summary: Update Region
 *      description: This resource **updates** a **region** in the system. The request needs to include a the Bearer`token` at header, generated at Authenticate User.
 *      operationId: updateRegion
 *      security:
 *          - token: []
 *      parameters:
 *        - $ref: '#/components/parameters/regionId'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/requests/RegionUpdate'
 *      responses:
 *        "200":
 *          description: Successful operation. Region updated. 
 *          content:
 *            application/json:
 *              schema:
 *                  $ref: '#/components/responses/RegionSimple'
 *        "400":
 *          description: Bad request. Request body incomplete or incorrect.
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/BadRequest'
 *        "500":
 *          description: Internal Server Error. Region update failed.
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/Error'
 *              example: 
 *                  error: Internal Server Error. Region update failed.
 * 
 *    delete:
 *      tags: [Regions]
 *      summary: Remove Region
 *      description: This resource finds and **deletes** a **region**, and States associated (cascade). The request needs to include a the Bearer`token` at header, generated at Authenticate User.
 *      operationId: deleteRegion
 *      security:
 *          - token: []
 *      parameters:
 *         - $ref: '#/components/parameters/stateId'
 *      responses:
 *         "200":
 *            description: Successful operation. Region removed correctly.
 *            content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/responses/Success'
 *                  example: 
 *                      message: Successful operation. Region removed correctly.
 * 
 *         "404":
 *            description: Not found. Error finding the states associated.
 *            content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/responses/Error'
 *                  example: 
 *                      error: Not found. Error finding the states associated.   
 *         "500":
 *            description: Internal Server Error. Error removing the region. 
 *            content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/responses/Error'
 *                  example: 
 *                      error: Internal Server Error. Error removing the region. 
 * 
 * 
 */
