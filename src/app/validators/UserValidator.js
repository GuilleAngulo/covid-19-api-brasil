const { celebrate, Segments, Joi } = require('celebrate');

module.exports = {

    store: celebrate({
        [Segments.BODY]: Joi.object().keys({
            username: Joi.string().alphanum().min(3).max(20).required(),
            email: Joi.string().email().required(),
            password: Joi.string().required().min(3).max(15),
        }),
    }),

    authenticate: celebrate({
        [Segments.BODY]: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required().min(3).max(15),
        }),
    }),

    forgotPassword: celebrate({
        [Segments.BODY]: Joi.object().keys({
            email: Joi.string().email().required(),
        }),
    }),

    resetPassword: celebrate({
        [Segments.BODY]: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required().min(3).max(15),
            token: Joi.string().hex().required().min(40),
        }),
    }),

}