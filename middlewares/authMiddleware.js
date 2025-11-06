const jwt = require('jsonwebtoken');
const Player = require('../models/playerModel');

const authMiddleware = {

    authorizeRoles: (roles) => {
        return (req, res, next) => {

            if (!req.user) {
                const error = new Error('Utilisateur non authentifié');
                error.status = 401;
                return next(error);
            }

            if (!roles.includes(req.user.role)) {
                const error = new Error('Accès refusé. Rôle insuffisant');
                error.status = 403;
                return next(error);
            }
            next();
        };
    },

    requireSelfOrAdmin: (req, res, next) => {
        // req.user doit être défini par authenticate
        if (!req.user) {
            const error = new Error('Utilisateur non authentifié');
            error.status = 401;
            return next(error);
        }

        // Si admin → ok
        if (req.user.role === 'admin') return next();

        // Si id de l’URL = id de l’utilisateur connecté → ok
        if (req.params.id === req.user._id.toString()) return next();

        // Sinon accès refusé
        const error = new Error('Accès refusé. Vous ne pouvez modifier que votre propre compte');
        error.status = 403;
        return next(error);
    },

    authenticate: async (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            const error = new Error('Vous devez être connecté pour accéder à cette ressource');
            error.status = 401;
            return next(error);
            
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);

            // Récupère le user complet depuis la DB
            const user = await Player.findById(decoded.id);
            if (!user) {
                const error = new Error('Utilisateur inexistant');
                error.status = 401;
                return next(error);
            }

            req.user = user; // on attache le user complet
            next();
        } catch (err) {
            const error = new Error('Token invalide');
            error.status = 403;
            return next(error);            
        }
    }
};

module.exports = authMiddleware;