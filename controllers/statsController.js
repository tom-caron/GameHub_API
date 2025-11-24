const playerService = require('../services/playersServices');
const gamesServices = require('../services/gamesService');
const genresService = require('../services/genresService');
const platformsService = require('../services/platformsService');
const sessionsServices = require('../services/sessionsService');

const statsController = {
    
    getAllStats: async (req, res, next) => {
        try {
            const totalPlayers = await playerService.countPlayers();
            const totalGames = await gamesServices.countGames();
            const totalGenres = await genresService.countGenres();
            const totalPlatforms = await platformsService.countPlatforms();
            const totalSessions = await sessionsServices.countSessions();

            const topFivePlayer = await playerService.getSortPlayers('-totalScore', 1, 5)
            return res.status(200).json({
                totalPlayers,
                totalGames,
                totalGenres,
                totalPlatforms,
                totalSessions,
                topFivePlayer,
                message: 'Statistiques récupérées avec succès',
                code: 200
            });
        } catch (err) {
            return next(err);
        }
    },
};

module.exports = statsController;

