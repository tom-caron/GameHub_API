const Joi = require('joi');

const genreCreateSchema = Joi.object({
    name: Joi.string().min(1).max(100).required(),
    slug: Joi.string().min(1).max(100).required(),
});

const genreUpdateSchema = Joi.object({
    name: Joi.string().min(1).max(100).required(),
    slug: Joi.string().min(1).max(100).required(),
});

module.exports = {
    genreCreateSchema,
    genreUpdateSchema
};
