const authorsService = require('../services/authorsService');

const authorsController = {
    
    getAllAuthors: async (req, res, next) => {
        const sort = req.query.sort;
        const page = parseInt(req.query.page || 1);
        const limit = parseInt(req.query.limit || 5);

        const { authors, total } = await authorsService.getSortAuthors(sort, page, limit, next);

        return res.status(200).json({
            authors,
            currentPage: page,
            total,
            message: 'Liste des auteurs récupérée avec succès',
            code: 200
        });
    },


    getAuthorById: async (req, res, next) => {
        const idSearch = req.params.id
        const author = await authorsService.getOneAuthorId(idSearch, next);

        res.status(200).json({
            author,
            message: 'Auteur récupéré avec succès',
            code: 200
        });

    },

    createAuthor: async (req, res, next) => {
        const { name, birthYear } = req.body;

        const author = await authorsService.creationAuthor(name, birthYear, next);

        res.status(201).json({
            author,
            message: 'Auteur créé avec succès',
            code: 201
        });
    },

    updateAuthor: async (req, res, next) => {
    const id = req.params.id;
    const { name, birthYear } = req.body;

    const author = await authorsService.modifyAuthor(id, { name, birthYear }, next);

    res.status(200).json({
        author,
        message: 'Auteur mis à jour avec succès',
        code: 200
    });
    },

    deleteAuthor: async (req, res, next) => {
    try {
        const id = req.params.id;
        await authorsService.deleteAuthorById(id, next);

        res.status(200).json({
            message: 'Auteur supprimé avec succès',
            code: 200
        });
    } catch (err) {
        next(err);
    }
    },
};

module.exports = authorsController;

