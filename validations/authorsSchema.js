const Joi = require('joi');

const bookSchema = Joi.object({
    name: Joi.string().min(1).max(100),
    birthYear: Joi.number().integer().min(1000).max(2100),
});

module.exports = bookSchema;
