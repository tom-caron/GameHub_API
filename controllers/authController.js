const authService = require('../services/authService');

const authController = {

    register: async (req, res, next) => {
        try {
            const { email, password, role } = req.body;

            await authService.registerUser(email, password, role);

            return res.status(201).json({
                message: 'Utilisateur créé avec succès',
                code: 201
            });
        } catch (error) {
            next(error);
        }
    },


    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            const token = await authService.loginUser(email, password);

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