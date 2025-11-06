const Joi = require('joi');

const genreSchema = Joi.object({
    name: Joi.string().min(1).max(100).required(),
    slug: Joi.string().min(1).max(100).required(),
});

module.exports = genreSchema;
