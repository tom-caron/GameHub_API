const platformsService = require('../services/platformsService');

const platformsController = {
    
    getAllPlatforms: async (req, res, next) => {
        const sort = req.query.sort;
        const page = parseInt(req.query.page || 1);
        const limit = parseInt(req.query.limit || 5);

        const { platforms, total } = await platformsService.getSortPlatforms(sort, page, limit, next);

        return res.status(200).json({
            platforms,
            currentPage: page,
            total,
            message: 'Liste des plateformes récupérée avec succès',
            code: 200
        });
    },


    getPlatformById: async (req, res, next) => {
        const idSearch = req.params.id
        const platform = await platformsService.getOnePlatformId(idSearch, next);

        res.status(200).json({
            platform,
            message: 'Plateforme récupéré avec succès',
            code: 200
        });

    },

    createPlatform: async (req, res, next) => {
        const { name, slug } = req.body;

        const platform = await platformsService.creationPlatform(name, slug, next);

        res.status(201).json({
            platform,
            message: 'Plateforme créé avec succès',
            code: 201
        });
    },

    updatePlatform: async (req, res, next) => {
    const id = req.params.id;
    const { name, slug } = req.body;

    const platform = await platformsService.modifyPlatform(id, { name, slug }, next);

    res.status(200).json({
        platform,
        message: 'Plateforme mis à jour avec succès',
        code: 200
    });
    },

    deletePlatform: async (req, res, next) => {
    try {
        const id = req.params.id;
        await platformsService.deletePlatformById(id, next);

        res.status(200).json({
            message: 'Plateforme supprimé avec succès',
            code: 200
        });
    } catch (err) {
        next(err);
    }
    },
};

module.exports = platformsController;

