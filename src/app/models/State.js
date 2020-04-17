const { Schema, model } = require('../../database/index');

const StateSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    code: {
        type: String,
        required: true,
    },
    region: {
        type: Schema.Types.ObjectId,
        ref: 'Region',
        required: true,
    },
    population: {
        type: Number,
        required: true,
    },
    confirmed: {
        type: Number,
        default: 0,
    },
    deaths: {
        type: Number,
        default: 0,
    },
    officialUpdated: {
        type: Date,
        default: Date.now(),
    }
}, {
    timestamps: true,
});

module.exports = model('State', StateSchema);


/**
 * @swagger
 *  components:
 * 
 *    schemas:
 *      State:
 *        type: object
 *        required:
 *          - _id
 *          - name
 *          - code
 *          - region
 *          - population
 *        properties:
 *          _id:
 *             type: string
 *             description: State ID.
 *             format: uuid
 *          name:
 *            type: string
 *            description: State Name.
 *          code:
 *            type: string
 *            length: 2
 *            description: State Code (UF).
 *          region:
 *            type: string
 *            description: Region ID to which the state belongs.
 *            format: uuid
 *          population:
 *            type: integer
 *            description: State Number of People.
 *            minimum: 1
 *          confirmed:
 *            type: integer
 *            description: Number of people confirmed to have Covid-19.
 *          deaths:
 *            type: integer
 *            description: Number of people deceased caused by Covid-19.
 *          officialUpdated:
 *            type: string
 *            format: date-time
 *            description: Date of last official data update.
 * 
 *            
 * 
 *    requests:
 *      StateCreate:
 *          type: object
 *          required:
 *          - name
 *          - code
 *          - region
 *          - population
 *          properties:
 *              name:
 *                  type: string
 *                  description: State Name.
 *              code:
 *                  type: string
 *                  description: State Code (UF).
 *                  enum: [AC, AL, AP ,AM, BA, CE, DF, ES, GO, MA, MT, MS, MG, PA, PB, PR, PE, PI, RJ, RN, RS, RO, RR, SC, SP, SE, TO]
 *              region:
 *                  type: string
 *                  description: Region ID to which the state belongs.
 *                  format: uuid
 *              population:
 *                  type: integer
 *                  description: State Number of People.
 *                  minimum: 1
 *              confirmed:
 *                  type: integer
 *                  description: Number of people confirmed to have Covid-19.
 *              deaths:
 *                  type: integer
 *                  description: Number of people deceased caused by Covid-19.
 *              officialUpdated:
 *                  type: string
 *                  format: date-time
 *                  description: Date of last official data update.
 *          example:
 *              name: Rio de Janeiro
 *              code: RJ
 *              region: 5e7699be9575540a5828ab07
 *              population: 17264943
 *              confirmed: 1394
 *              deaths: 64
 *              officialUpdated: 2020-04-05T20:00:00.000Z
 * 
 *      StateUpdate:
 *          type: object
 *          properties:
 *              confirmed:
 *                  type: integer
 *                  description: Number of people confirmed to have Covid-19.
 *              deaths:
 *                  type: integer
 *                  description: Number of people deceased caused by Covid-19.
 *              officialUpdated:
 *                  type: string
 *                  format: date-time
 *                  description: Date of last official data update.
 *              population:
 *                  type: integer
 *                  description: State Number of People.
 *                  minimum: 1
 *          example:
 *              confirmed: 1394
 *              deaths: 64
 *              officialUpdated: 2020-04-05T20:00:00.000Z  
 *              population: 17264943           
 * 
 *    responses:
 *      States:
 *          type: object
 *          properties:
 *              states:
 *                type: array
 *                description: States array list.
 *                items:
 *                   $ref: '#/components/responses/State'
 *      State:
 *        type: object
 *        properties:
 *          _id:
 *             type: string
 *             description: State ID.
 *             format: uuid
 *          name:
 *             type: string
 *             description: State Name.
 *          code:
 *             type: string
 *             length: 2
 *             description: State Code (UF).
 *          region:
 *              type: object
 *              description: Region to which the state belongs.
 *              properties:
 *                 _id: 
 *                    type: string
 *                    description: Region ID to which the state belongs.
 *                    format: uuid
 *                 description:
 *                    type: string
 *                    description: Region name to which the state belongs.
 *          population:
 *              type: integer
 *              description: State Number of People.
 *              minimum: 1
 *          confirmed:
 *              type: integer
 *              description: Number of people confirmed to have Covid-19.
 *          deaths:
 *              type: integer
 *              description: Number of people deceased caused by Covid-19.
 *          officialUpdated:
 *              type: string
 *              format: date-time
 *              description: Date of last official data update.
 *        example:
 *           name: Rio de Janeiro
 *           code: RJ
 *           region: 
 *              _id: 5e7699be9575540a5828ab07
 *              description: Região Sudeste
 *           population: 17264943
 *           confirmed: 1394
 *           deaths: 64
 *           officialUpdated: 2020-04-05T20:00:00.000Z
 * 
 *      StateSimple:
 *        type: object
 *        required:
 *          - _id
 *          - name
 *          - code
 *          - region
 *          - population
 *        properties:
 *          _id:
 *             type: string
 *             description: State ID.
 *             format: uuid
 *          name:
 *             type: string
 *             description: State Name.
 *          code:
 *             type: string
 *             length: 2
 *             description: State Code (UF).
 *          population:
 *              type: integer
 *              description: State Number of People.
 *              minimum: 1
 *          confirmed:
 *              type: integer
 *              description: Number of people confirmed to have Covid-19.
 *          deaths:
 *              type: integer
 *              description: Number of people deceased caused by Covid-19.
 *          officialUpdated:
 *              type: string
 *              format: date-time
 *              description: Date of last official data update.
 *        example:
 *           _id: 5e76a10c9575540a5828ab1f
 *           name: Rio de Janeiro
 *           code: RJ
 *           population: 17264943
 *           confirmed: 1394
 *           deaths: 64
 *           officialUpdated: 2020-04-05T20:00:00.000Z
 *    
 *  
 *    securitySchemes:
 *      token:
 *          in: header
 *          name: Authorization
 *          description: Token
 *          required: true
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT 
 * 
 *    parameters:
 *      code:
 *          in: path
 *          name: code
 *          required: true
 *          description: State Code (UF).
 *          schema:
 *            type: string
 *            enum: [AC, AL, AP, AM, BA, CE, DF, ES, GO, MA, MT, MS, MG, PA, PB, PR, PE, PI, RJ, RN, RS, RO, RR, SC, SP, SE, TO]
 *    
 *      stateId: 
 *          in: path
 *          name: stateId
 *          required: true
 *          description: State ID.
 *          schema:
 *            type: string
 *            format: uuid
 */