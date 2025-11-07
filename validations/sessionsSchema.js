const Joi = require('joi');

const sessionCreateSchema = Joi.object({
    player: Joi.string()
        .allow(null)
        .required(),

    game: Joi.string()
        .allow(null)
        .required(),
});

const sessionUpdateSchema = Joi.object({
    player: Joi.string()
        .optional(),

    game: Joi.string()
        .optional(),
    score: Joi.number()
        .min(0)
        .optional(),
    active: Joi.boolean()
        .optional(),
});

module.exports = {
    sessionCreateSchema,
    sessionUpdateSchema
};