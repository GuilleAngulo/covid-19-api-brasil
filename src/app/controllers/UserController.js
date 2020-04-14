const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const authConfig = require('../../config/auth.json');


function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

module.exports = {
    async store(req, res) {
        const { email } = req.body;

        try {
            if (await User.findOne({ email }))
                return res.status(409).send({ error: 'Conflict Error. User already exists.'});

            const user = await User.create(req.body);

            user.password = undefined;
            user.updatedAt = undefined;
            user.__v = undefined;

            console.log(`User with email: ${email} created.`);
            return res.status(201).send({ 
                user,
                token: generateToken({ id: user.id }), 
            });

        } catch (err) {
            return res.status(500).send({ error: 'Internal Server Error. Registration failed.' });
        }
    },

    async authenticate(req, res) {
        const { email, password } = req.body;

        try {

        const user =  await User.findOne({ email }).select('+password');

        if (!user)
            return res.status(404).send({ error: 'User not found.'});

        if (!await bcrypt.compare(password, user.password))
            return res.status(401).send({ error: 'Unauthorized. Invalid password.'});

        user.password = undefined;
        user.updatedAt = undefined;
        user.__v = undefined;

        console.log(`User with email: ${email} authenticated.`);

        res.status(200).send({ 
            user,
            token: generateToken({ id: user.id}),
        });

        } catch (err) {
            return res.status(500).send({ error: 'Internal Server Error. Authentication failed.' });
        }
    },

    async forgotPassword(req, res) {
        const { email } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user)
                return res.status(404).send({ error: 'User not found.'});


            const token = crypto.randomBytes(20).toString('hex');

            const now = new Date();
            now.setHours(now.getMinutes() + 10);

            await User.findByIdAndUpdate(user.id, 
                {
                    '$set': {
                        passwordResetToken: token,
                        passwordResetExpires: now,
                } 
            }, { useFindAndModify: false });

            mailer.sendMail({
                to: email,
                subject: 'Forgot Password',
                template: 'auth/forgot_password',
                context: { token },

            }, (err) => {
                if (err) {
                    return res.status(503).send({ error: 'Service Unavailable. Can´t send Password recovery email.' });
                }
        
                console.log(`Password recovery email sent to user with email: ${email}.`);
                return res.status(200).send({ message: 'Password recovery email sent successfully.' });
            });


        } catch (err) {

            return res.status(500).send({ error: 'Internal Server Error. Sending recovering email failed.' });
        }
    },

    async resetPassword(req, res) {
        const { email, token, password } = req.body;

        try {
            const user = await User.findOne({ email })
                .select('+passwordResetToken passwordResetExpires');

            if (!user)
                return res.status(404).send({ error: 'User not found.'});

            if (token !== user.passwordResetToken)
                return res.status(401).send({ error: 'Unauthorized. Token invalid.' });
            
            const now = new Date();

            if (now > user.passwordResetExpires)
                return res.status(401).send({ error: 'Unauthorized. Token expired, generate a new one.' });

            user.password = password;

            await user.save();

            console.log(`Password changed for user with email: ${email}.`);
            res.status(200).send({ message: 'Password changed successfully.' });

        } catch (err) {
            res.status(500).send({ error: 'Internal Server Error. Unable to reset passsword.' });
        }
    },
};

