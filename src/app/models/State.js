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