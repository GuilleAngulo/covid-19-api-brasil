const express = require('express');

const authMiddleware = require('../middlewares/auth');

const StateController = require('../controllers/StateController');
const StateValidator = require('../validators/StateValidator');

const router = express.Router();

router.get('/', StateController.index);
router.get('/id/:stateId', StateValidator.find, StateController.find);
router.get('/:code', StateValidator.findByCode, StateController.findByCode);
router.post('/', StateValidator.create, authMiddleware, StateController.create);
router.put('/id/:stateId', StateValidator.update, authMiddleware, StateController.update);
router.put('/:code', StateValidator.updateByCode, authMiddleware, StateController.updateByCode);
router.delete('/:stateId', StateValidator.remove, authMiddleware, StateController.remove);

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: States
 *   description: State management
 */

 /**
 * @swagger
 * paths:
 *  /states:
 *    get:
 *      tags: [States]
 *      summary: List State
 *      description: This resource returns the complete list of **states**.
 *      operationId: getStates
 *      responses:
 *        "200":
 *          description: Successful operation. States listed. 
 *          content:
 *            application/json:
 *              schema:
 *                  $ref: '#/components/responses/States'
 *    post:
 *      tags: [States]
 *      summary: Create State
 *      description: This resource **creates** a new **state** in the system. The request needs to include a `token` authorization at header.
 *      operationId: createState
 *      parameters:
 *         - $ref: '#/components/securitySchemes/token'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/requests/StateCreate'
 *      responses:
 *        "201":
 *          description: Successful operation. State created. 
 *          content:
 *            application/json:
 *              schema:
 *                  $ref: '#/components/responses/State'
 *        "400":
 *          description: Bad request. Request body incomplete or incorrect.
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/BadRequest'
 *        "404":
 *          description: Not found. Error finding the region.
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/Error'
 *              example: 
 *                  error: Not found. Error finding the region.
 *        "409":
 *          description: Conflict error. State already exists.
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/Error'
 *              example: 
 *                  error: Conflict error. State already exists.
 *        "500":
 *          description: Internal Server Error. Registration failed.
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/Error'
 *              example: 
 *                  error: Internal Server Error. State creation failed.
 * 
 *  /states/{code}:
 *    get:
 *      tags: [States]
 *      summary: Get State by Code
 *      description: This resource finds and returns a **state** by `code` (UF code).
 *      operationId: getStateByCode
 *      parameters:
 *        - $ref: '#/components/parameters/code'
 *      responses:
 *        "200":
 *          description: Successful operation. State listed. 
 *          content:
 *            application/json:
 *              schema:
 *                  $ref: '#/components/responses/State'
 *        "400":
 *          description: Bad request. Wrong State code.
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/BadRequest'
 *        "500":
 *          description: Internal Server Error. Error finding the state.
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/Error'
 *              example: 
 *                  error: Internal Server Error. Error finding the state.
 *    put:
 *      tags: [States]
 *      summary: Update State by Code
 *      description: This resource finds and updates a **state** by `code` (UF code) with body parameters. The request needs to include a `token` authorization at header.
 *      operationId: updateStateByCode
 *      parameters:
 *         - $ref: '#/components/securitySchemes/token'
 *         - $ref: '#/components/parameters/code'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/requests/StateUpdate'
 *      responses:
 *        "200":
 *          description: Successful operation. State updated. 
 *          content:
 *            application/json:
 *              schema:
 *                  $ref: '#/components/responses/State'    
 *        "404":
 *          description: Not found. Error finding the state.
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/Error'
 *              example: 
 *                  error: Not found. Error finding the state.    
 *        "500":
 *          description: Internal Server Error. Error updating state.
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/responses/Error'
 *              example: 
 *                  error: Internal Server Error. Error updating state.
 */