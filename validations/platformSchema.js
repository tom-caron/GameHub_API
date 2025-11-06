const Joi = require('joi');

const platformCreateSchema = Joi.object({
    name: Joi.string().min(1).max(100).required(),
    slug: Joi.string().min(1).max(100).required(),
});

const platformUpdateSchema = Joi.object({
    name: Joi.string().min(1).max(100).required(),
    slug: Joi.string().min(1).max(100).required(),
});

module.exports = {
    platformCreateSchema,
    platformUpdateSchema
};
