const genresService = require('../services/genresService');

const genresController = {
    
    getAllGenres: async (req, res, next) => {
        const sort = req.query.sort;
        const page = parseInt(req.query.page || 1);
        const limit = parseInt(req.query.limit || 5);

        const { genres, total } = await genresService.getSortGenres(sort, page, limit, next);

        return res.status(200).json({
            genres,
            currentPage: page,
            total,
            message: 'Liste des genres récupérée avec succès',
            code: 200
        });
    },


    getGenreById: async (req, res, next) => {
        const idSearch = req.params.id
        const genre = await genresService.getOneGenreId(idSearch, next);

        res.status(200).json({
            genre,
            message: 'Genre récupéré avec succès',
            code: 200
        });

    },

    createGenre: async (req, res, next) => {
        const { name, slug } = req.body;

        const genre = await genresService.creationGenre(name, slug, next);

        res.status(201).json({
            genre,
            message: 'Genre créé avec succès',
            code: 201
        });
    },

    updateGenre: async (req, res, next) => {
    const id = req.params.id;
    const { name, slug } = req.body;

    const genre = await genresService.modifyGenre(id, { name, slug }, next);

    res.status(200).json({
        genre,
        message: 'Genre mis à jour avec succès',
        code: 200
    });
    },

    deleteGenre: async (req, res, next) => {
    try {
        const id = req.params.id;
        await genresService.deleteGenreById(id, next);

        res.status(200).json({
            message: 'Genre supprimé avec succès',
            code: 200
        });
    } catch (err) {
        next(err);
    }
    },
};

module.exports = genresController;

