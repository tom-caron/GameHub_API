const bcrypt = require('bcrypt');	
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authService = {

    registerUser: async (email, password, role = 'user') => {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const err = new Error('Utilisateur déjà existant');
            err.status = 400;
            throw err;
        }

        // Création de l'utilisateur
        const user = new User({ email, password, role });
        await user.save(); // le password sera hashé grâce au pre-save

        return user;
    },


    loginUser: async (email, password) => {
        // Chercher l'utilisateur par email
        const user = await User.findOne({ email });
        if (!user) {
            const err = new Error('Utilisateur non trouvé');
            err.status = 404;
            throw err;
        }

        // Vérifier le mot de passe
        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) {
            const err = new Error('Mot de passe incorrect');
            err.status = 401;
            throw err;
        }

        // Générer le token JWT
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        return token;
    },
};

module.exports = authService;