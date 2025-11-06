const Joi = require('joi');

const gameCreateSchema = Joi.object({
    title: Joi.string()
        .trim()
        .required(),

    slug: Joi.string()
        .trim()
        .lowercase()
        .required(),

    genre: Joi.string()
        .allow(null)
        .required(),

    platform: Joi.string()
        .allow(null)
        .required(),
});

const gameUpdateSchema = Joi.object({
    title: Joi.string().trim().optional(),

    slug: Joi.string().trim().lowercase().optional(),

    genre: Joi.string().allow(null).optional(),

    platform: Joi.string().allow(null).optional(),
});

module.exports = {
    gameCreateSchema,
    gameUpdateSchema
};