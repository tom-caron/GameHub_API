const booksService = require('../services/booksService');

const booksController = {

    getAllBooks: async (req, res, next) => {
        const sort = req.query.sort;
        const page = parseInt(req.query.page || 1);
        const limit = parseInt(req.query.limit || 5);

        const { books, total } = await booksService.getSortBooks(sort, page, limit, next);

        return res.status(200).json({
            books,
            currentPage: page,
            total,
            message: 'Liste des Livres récupérée avec succès',
            code: 200
        });
    },


    getBookById: async (req, res, next) => {
        try {
            const idSearch = req.params.id;
            const book = await booksService.getOneBookId(idSearch);

            res.status(200).json({
                book,
                message: 'Livre récupéré avec succès',
                code: 200
            });
        } catch (err) {
            next(err);
        }
    },

    createBook: async (req, res, next) => {
        try {
            const { title, authorId, publishedYear } = req.body;

            const book = await booksService.creationBook(title, authorId, publishedYear);

            res.status(201).json({
                book,
                message: 'Livre créé avec succès',
                code: 201
            });
        } catch (err) {
            next(err);
        }
    },

    updateBook: async (req, res, next) => {
        try {
            const { title, authorId, publishedYear } = req.body;
            const book = await booksService.modifyBook(req.params.id, title, authorId, publishedYear);

            res.json({
                book,
                message: 'Livre mis à jour avec succès',
                code: 200
            });
        } catch (err) {
            next(err);
        }
    },

    deleteBook: async (req, res, next) => {
        try {
            await booksService.deleteBookById(req.params.id);

            res.status(200).json({
                message: 'Livre supprimé avec succès',
                code: 200
            });
        } catch (err) {
            next(err);
        }
    },
};

module.exports = booksController;