const { Schema, model } = require('../../database/index');

const RegionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    states: [{
        type: Schema.Types.ObjectId,
        ref: 'State',
        required: true,
    }],
}, {
    timestamps: true,
});

module.exports = model('Region', RegionSchema);


/**
 * @swagger
 *  components:
 * 
 *    schemas:
 *      Region:
 *        type: object
 *        required:
 *          - name
 *          - description
 *          - states
 *        properties:
 *          name:
 *            type: string
 *            description: Region Name.
 *          description:
 *            type: string
 *            description: Region Description.
 *          states:
 *            type: array
 *            description: States array list.
 *            items:
 *              $ref: '#/components/schemas/StateSimple'
 *              
 * 
 * 
 *    responses:
 *      Regions:
 *          type: object
 *          properties:
 *             regions:
 *                 type: array
 *                 description: Region array list.
 *                 items:
 *                  type: object
 *                  properties:
 *                     _id:
 *                         type: string
 *                         description: Region ID.
 *                         format: uuid
 *                         example: 5e7699be9575540a5828ab07
 *                     name:
 *                         type: string
 *                         description: Region Name.
 *                         example: sudeste
 *                     description:
 *                         type: string
 *                         description: Region Description.
 *                         example: Região Sudeste
 *                     confirmed:
 *                         type: integer
 *                         description: Number of people confirmed to have Covid-19.
 *                         example: 6678
 *                     deaths:
 *                         type: integer
 *                         description: Number of people deceased caused by Covid-19.
 *                         example: 351
 *                     states:
 *                         type: array
 *                         description: States array list.
 *                         items:
 *                             $ref: '#/components/responses/StateSimple'
 * 
 *      Region:
 *          type: object
 *          properties:
 *             region:
 *                 type: object
 *                 properties:
 *                     _id:
 *                         type: string
 *                         description: Region ID.
 *                         format: uuid
 *                         example: 5e7699be9575540a5828ab07
 *                     name:
 *                         type: string
 *                         description: Region Name.
 *                         example: sudeste
 *                     description:
 *                         type: string
 *                         description: Region Description.
 *                         example: Região Sudeste
 *                     confirmed:
 *                         type: integer
 *                         description: Number of people confirmed to have Covid-19.
 *                         example: 6678
 *                     deaths:
 *                         type: integer
 *                         description: Number of people deceased caused by Covid-19.
 *                         example: 351
 *                     states:
 *                         type: array
 *                         description: States array list.
 *                         items:
 *                             $ref: '#/components/responses/StateSimple'
 * 
 *    parameters:
 *      name:
 *          in: path
 *          name: name
 *          required: true
 *          description: Region Name.
 *          schema:
 *            type: string
 *            enum: [norte, nordeste, sudeste, centro-oeste, sul]               
 *                    
 *                  
 *              
 * 
 * 
 */