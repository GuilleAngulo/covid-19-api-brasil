const { celebrate, Segments, Joi } = require('celebrate');

const uf = ["AC", "AL", "AP" ,"AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", 
            "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

const brazilPopulation = 212174832;



module.exports = {

    find: celebrate({
        [Segments.PARAMS]: Joi.object().keys({
            stateId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
        }),
    }),

    findByCode: celebrate({
        [Segments.PARAMS]: Joi.object().keys({
            code: Joi.string().required().length(2).regex(/^[a-zA-Z]$/).valid(...uf).insensitive(),
        }),
    }),

    create: celebrate({
        [Segments.HEADERS]: Joi.object().keys({
            authorization: Joi.string().required(),
        }).unknown(),
        [Segments.BODY]: Joi.object().keys({
            name: Joi.string().required().min(1).max(24),
            code: Joi.string().required().length(2).regex(/^[a-zA-Z]$/).insensitive(),
            population: Joi.number().min(1).max(brazilPopulation),
            region: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
            confirmed: Joi.number().min(0).max(brazilPopulation),
            deaths: Joi.number().min(0).max(brazilPopulation),
            officialUpdated: Joi.date(),
        }),
    }),

    update: celebrate({
        [Segments.HEADERS]: Joi.object().keys({
            authorization: Joi.string().required(),
        }).unknown(),
        [Segments.BODY]: Joi.object().keys({
            confirmed: Joi.number().min(0).max(brazilPopulation),
            deaths: Joi.number().min(0).max(brazilPopulation),
            officialUpdated: Joi.date(),
        }),
    }),

    updateByCode: celebrate({
        [Segments.HEADERS]: Joi.object().keys({
            authorization: Joi.string().required(),
        }).unknown(),
        [Segments.PARAMS]: Joi.object().keys({
            code: Joi.string().required().length(2).regex(/^[a-zA-Z]$/).valid(...uf).insensitive(),
        }),
        [Segments.BODY]: Joi.object().keys({
            confirmed: Joi.number().min(0).max(brazilPopulation),
            deaths: Joi.number().min(0).max(brazilPopulation),
            officialUpdated: Joi.date(),
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