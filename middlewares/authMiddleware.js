const jwt = require('jsonwebtoken');

const authMiddleware = {

    authorizeRoles: (roles) => {
        return (req, res, next) => {
            if (!roles.includes(req.user.role)) {
                const error = new Error('Accès refusé. Rôle insuffisant');
                error.status = 403;
                return next(error);
            }
            next();
        };
    },

    authenticate: (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            const error = new Error('Vous devez être connecté pour accéder à cette ressource');
            error.status = 401;
            return next(error);
            
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decoded;
            next();
        } catch (err) {
            const error = new Error('Token invalide');
            error.status = 403;
            return next(error);            
        }
    }
};

module.exports = authMiddleware;