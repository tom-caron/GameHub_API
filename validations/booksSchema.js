const Joi = require('joi');

const bookSchema = Joi.object({
    title: Joi.string().min(1).max(100),
    authorId: Joi.string(),
    publishedYear: Joi.number().integer().min(1000).max(2100),
});

module.exports = bookSchema;
