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
 *            description: Region identification name.
 *          description:
 *            type: string
 *            description: Region description.
 *          states:
 *            type: array
 *            description: States which are part of the region.
 *            items:
 *              $ref: '#/components/schemas/State'
 *              
 * 
 */