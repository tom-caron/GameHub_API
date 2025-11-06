const Joi = require('joi');

// --- CREATE player ---
const playerCreateSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(50)
    .required(),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(100)
    .required(),

  password: Joi.string()
    .min(6)
    .max(100)
    .required(),

  role: Joi.string()
    .valid('player', 'admin')
    .default('player')
});

// --- CONNEXION player ---
const playerConnectSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(100)
    .required(),

  password: Joi.string()
    .min(6)
    .max(100)
    .required(),
});

// --- UPDATE player ---
const playerUpdateSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(50),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(100),

  password: Joi.string()
    .min(6)
    .max(100),

  role: Joi.string()
    .valid('player', 'admin')
})
.min(1); // obligé d'avoir au moins 1 champ à updater


module.exports = {
  playerCreateSchema,
  playerConnectSchema,
  playerUpdateSchema
}
