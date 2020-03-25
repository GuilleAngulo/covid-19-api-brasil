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
    suspects: {
        type: Number,
    },
    discarded: {
        type: Number,
    },
    confirmed: {
        type: Number,
    },
    deaths: {
        type: Number,
    },
    recovered: {
        type: Number,
    },
    officialUpdated: {
        type: Date,
    }
}, {
    timestamps: true,
});

module.exports = model('State', StateSchema);