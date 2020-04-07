const { celebrate, Segments, Joi } = require('celebrate');

const { REGION } = require('../utils/brazil');



module.exports = {

    find: celebrate({
        [Segments.PARAMS]: Joi.object().keys({
            regionId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
        }),
    }),

    findByName: celebrate({
        [Segments.PARAMS]: Joi.object().keys({
            name: Joi.string().required().valid(...REGION).insensitive(),
        }),
    }),

    create: celebrate({
        [Segments.HEADERS]: Joi.object().keys({
            authorization: Joi.string().required(),
        }).unknown(),
        [Segments.BODY]: Joi.object().keys({
            name: Joi.string().required().valid(...REGION).insensitive(),
            description: Joi.string().required().min(1).max(24),
            states: Joi.array().required(),
        }),
    }),

    update: celebrate({
        [Segments.HEADERS]: Joi.object().keys({
            authorization: Joi.string().required(),
        }).unknown(),
        [Segments.BODY]: Joi.object().keys({
            name: Joi.string().required().min(1).insensitive(),
            description: Joi.string().required().min(1).max(24),
            states: Joi.array().required(),
        }),
    }),

    remove: celebrate({
        [Segments.HEADERS]: Joi.object().keys({
            authorization: Joi.string().required(),
        }).unknown(),
        [Segments.PARAMS]: Joi.object().keys({
            regionId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
        }),
    }),
    
}