const { celebrate, Segments, Joi } = require('celebrate');

const { UF } = require('../utils/brazil');


module.exports = {

    find: celebrate({
        [Segments.PARAMS]: Joi.object().keys({
            stateId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
        }),
    }),

    findByCode: celebrate({
        [Segments.PARAMS]: Joi.object().keys({
            code: Joi.string().required().length(2).valid(...UF).insensitive(),
        }),
    }),

    create: celebrate({
        [Segments.HEADERS]: Joi.object().keys({
            authorization: Joi.string().required(),
        }).unknown(),
        [Segments.BODY]: Joi.object().keys({
            name: Joi.string().required().min(1).max(24),
            code: Joi.string().required().length(2).insensitive(),
            population: Joi.number().required().min(1),
            region: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
            confirmed: Joi.number().min(0),
            deaths: Joi.number().min(0),
            officialUpdated: Joi.date(),
        }),
    }),

    update: celebrate({
        [Segments.HEADERS]: Joi.object().keys({
            authorization: Joi.string().required(),
        }).unknown(),
        [Segments.BODY]: Joi.object().keys({
            confirmed: Joi.number().min(0),
            deaths: Joi.number().min(0),
            officialUpdated: Joi.date(),
            population: Joi.number().min(1),
        }),
    }),

    updateByCode: celebrate({
        [Segments.HEADERS]: Joi.object().keys({
            authorization: Joi.string().required(),
        }).unknown(),
        [Segments.PARAMS]: Joi.object().keys({
            code: Joi.string().required().length(2).valid(...UF).insensitive(),
        }),
        [Segments.BODY]: Joi.object().keys({
            confirmed: Joi.number().min(0),
            deaths: Joi.number().min(0),
            officialUpdated: Joi.date(),
            population: Joi.number().min(1),
        }),
    }),

    remove: celebrate({
        [Segments.HEADERS]: Joi.object().keys({
            authorization: Joi.string().required(),
        }).unknown(),
        [Segments.PARAMS]: Joi.object().keys({
            stateId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
        }),
    }),
    
}