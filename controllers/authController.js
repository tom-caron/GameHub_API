const authService = require('../services/authService');

const authController = {

    register: async (req, res, next) => {
        try {
            const { email, username, password, role } = req.body;

            await authService.registerPlayer(email, username, password, role);

            return res.status(201).json({
                message: 'Joueur créé avec succès',
                code: 201
            });
        } catch (error) {
            next(error);
        }
    },

    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            const token = await authService.loginPlayer(email, password);

            return res.status(200).json({
                message: 'Connexion réussie',
                token,
                code: 200
            });
        } catch (error) {
            next(error);
        }
    },

};

module.exports = authController;