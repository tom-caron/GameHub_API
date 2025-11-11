const gamesService = require('../services/gamesService');

const gamesController = {

    getAllGames: async (req, res, next) => {
        const sort = req.query.sort;
        const page = parseInt(req.query.page || 1);
        const limit = req.query.limit ? parseInt(req.query.limit) : null;

        const { games, total } = await gamesService.getSortGames(sort, page, limit, next);

        return res.status(200).json({
            games,
            currentPage: page,
            total,
            message: 'Liste des Jeux récupérée avec succès',
            code: 200
        });
    },


    getGameById: async (req, res, next) => {
        try {
            const idSearch = req.params.id;
            const game = await gamesService.getOneGameId(idSearch);

            res.status(200).json({
                game,
                message: 'Jeu récupéré avec succès',
                code: 200
            });
        } catch (err) {
            next(err);
        }
    },

    createGame: async (req, res, next) => {
        try {
            const { title, slug, genre, platform } = req.body;

            const game = await gamesService.creationGame(title, slug, genre, platform, next);

            res.status(201).json({
                game,
                message: 'Jeu créé avec succès',
                code: 201
            });
        } catch (err) {
            next(err);
        }
    },

    updateGame: async (req, res, next) => {
        try {
            const { title, slug, genre, platform } = req.body;
            const game = await gamesService.modifyGame(req.params.id, title, slug, genre, platform);

            res.json({
                game,
                message: 'Jeu mis à jour avec succès',
                code: 200
            });
        } catch (err) {
            next(err);
        }
    },

    deleteGame: async (req, res, next) => {
        try {
            await gamesService.deleteGameById(req.params.id);

            res.status(200).json({
                message: 'Jeu supprimé avec succès',
                code: 200
            });
        } catch (err) {
            next(err);
        }
    },
};

module.exports = gamesController;