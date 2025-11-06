const playersService = require('../services/playersServices');

const playerController = {

    getAllPlayers: async (req, res, next) => {
        const sort = req.query.sort;
        const page = parseInt(req.query.page || 1);
        const limit = parseInt(req.query.limit || 5);

        const { players, total } = await playersService.getSortPlayers(sort, page, limit, next);

        return res.status(200).json({
            players,
            currentPage: page,
            total,
            message: 'Liste des players récupérée avec succès',
            code: 200
        });
    },

    getPlayerById: async (req, res, next) => {
        try {
            const idSearch = req.params.id;
            const player = await playersService.getOnePlayerId(idSearch);

            res.status(200).json({
                player,
                message: 'Joueur récupéré avec succès',
                code: 200
            });
        } catch (err) {
            next(err);
        }
    },

    updatePlayer: async (req, res, next) => {
        const id = req.params.id;
        const { email, username, password, role } = req.body;

        const player = await playersService.modifyPlayer(id, { email, username, password, role }, next);

        res.status(200).json({
            player,
            message: 'Player mis à jour avec succès',
            code: 200
        });
    },

    deletePlayer: async (req, res, next) => {
    try {
        const id = req.params.id;
        await playersService.deletePlayerById(id, next);

        res.status(200).json({
            message: 'Joueur supprimé avec succès',
            code: 200
        });
    } catch (err) {
        next(err);
    }
    },
};

module.exports = playerController;