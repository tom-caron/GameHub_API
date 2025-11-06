const Joi = require('joi');

const authSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .max(100)
        .required(),

    password: Joi.string()
        .min(6)
        .max(100)
        .required(),
        
    role: Joi.string()
        .valid('user', 'admin')
        .default('user')
        
});

module.exports = authSchema;
