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