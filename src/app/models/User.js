const { Schema, model } = require('../../database/index');
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    passwordResetToken: {
        type: String,
        select: false,
    }, 
    passwordResetExpires: {
        type: Date,
        select: false,
    },
}, {
    timestamps: true,
});

UserSchema.pre('save', async function(next) {
    const hash =  await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
});

module.exports = model('User', UserSchema);