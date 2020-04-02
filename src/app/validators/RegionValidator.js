const { celebrate, Segments, Joi } = require('celebrate');

const { regions } = require('../utils/brazil');

const brazilPopulation = 212174832;



module.exports = {

    find: celebrate({
        [Segments.PARAMS]: Joi.object().keys({
            regionId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
        }),
    }),

    findByName: celebrate({
        [Segments.PARAMS]: Joi.object().keys({
            name: Joi.string().required().length(2).regex(/^[a-zA-Z]$/).valid(...regions).insensitive(),
        }),
    }),

    create: celebrate({
        [Segments.HEADERS]: Joi.object().keys({
            authorization: Joi.string().required(),
        }).unknown(),
        [Segments.BODY]: Joi.object().keys({
            name: Joi.string().required().min(1).regex(/^[a-zA-Z]$/).insensitive(),
            description: Joi.string().required().min(1).max(24),
            states: Joi.array().required(),
        }),
    }),

    update: celebrate({
        [Segments.HEADERS]: Joi.object().keys({
            authorization: Joi.string().required(),
        }).unknown(),
        [Segments.BODY]: Joi.object().keys({
            name: Joi.string().required().min(1).regex(/^[a-zA-Z]$/).insensitive(),
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