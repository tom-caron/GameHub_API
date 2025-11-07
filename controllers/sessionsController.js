const sessionsService = require('../services/sessionsService');

const sessionsController = {

    getAllSessions: async (req, res, next) => {
        const sort = req.query.sort;
        const page = parseInt(req.query.page || 1);
        const limit = parseInt(req.query.limit || 5);

        const { sessions, total } = await sessionsService.getSortSessions(sort, page, limit, next);

        return res.status(200).json({
            sessions,
            currentPage: page,
            total,
            message: 'Liste des sessions récupérée avec succès',
            code: 200
        });
    },


    getSessionById: async (req, res, next) => {
        try {
            const idSearch = req.params.id;
            const session = await sessionsService.getOneSessionId(idSearch);

            res.status(200).json({
                session,
                message: 'Session récupéré avec succès',
                code: 200
            });
        } catch (err) {
            next(err);
        }
    },

    createSession: async (req, res, next) => {
        try {
            const { player, game } = req.body;

            const session = await sessionsService.creationSession(player, game);

            res.status(201).json({
                session,
                message: 'Session créé avec succès',
                code: 201
            });
        } catch (err) {
            next(err);
        }
    },

    updateSession: async (req, res, next) => {
        try {
            const { player, game, score, active } = req.body;
            const session = await sessionsService.modifySession(req.params.id, player, game, score, active);

            res.json({
                session,
                message: 'Session mis à jour avec succès',
                code: 200
            });
        } catch (err) {
            next(err);
        }
    },

    deleteSession: async (req, res, next) => {
        try {
            await sessionsService.deleteSessionById(req.params.id);

            res.status(200).json({
                message: 'Session supprimé avec succès',
                code: 200
            });
        } catch (err) {
            next(err);
        }
    },
};

module.exports = sessionsController;