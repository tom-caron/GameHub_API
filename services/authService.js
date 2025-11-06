const jwt = require('jsonwebtoken');
const Player = require('../models/playerModel');

const authService = {

    registerPlayer: async (email, username, password, role = 'player') => {
        // Vérifier si l'utilisateur existe déjà
        const existing = await Player.findOne({
        $or: [
            { email },
            { username }
        ]
        });

        if (existing) {
        let err;
        if (existing.email === email) {
            err = new Error('Email déjà utilisé');
        } else {
            err = new Error('Username déjà utilisé');
        }
        err.status = 400;
        throw err;
        }

        // Création de l'utilisateur
        const player = new Player({ email, username, password, role });
        await player.save(); // le password sera hashé grâce au pre-save

        return player;
    },


    loginPlayer: async (email, password) => {
        // Chercher l'utilisateur par email
        const player = await Player.findOne({ email });
        if (!player) {
            const err = new Error('Joueur non trouvé');
            err.status = 404;
            throw err;
        }

        // Vérifier le mot de passe
        const passwordMatch = await player.comparePassword(password);
        if (!passwordMatch) {
            const err = new Error('Mot de passe incorrect');
            err.status = 401;
            throw err;
        }

        // Générer le token JWT
        const token = jwt.sign(
            { id: player._id },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        return token;
    },

};

module.exports = authService;