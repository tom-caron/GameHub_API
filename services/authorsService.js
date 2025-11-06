const Book = require('../models/bookModel');
const Author = require('../models/authorModel');

const authorsService = {

    getSortAuthors: async (sort, page, limit, next) => {
        try {
            let query = Author.find();

            if (sort) {
                const order = sort.startsWith('-') ? -1 : 1;
                const field = sort.replace('-', '');
                query = query.sort({ [field]: order });
            }

            const total = await Author.countDocuments();

            const authors = await query
                .skip((page - 1) * limit)
                .limit(limit)
                .exec();

            return { authors, total }
        } catch (err) {
            return next(err);
        }
    },

    getOneAuthorId: async (idSearch, next) => {
        try {
            const author = await Author.findById(idSearch);

            if (!author) {
                const err = new Error('Auteur introuvable');
                err.status = 404;
                return next(err);
            }

            return author;

        } catch (err) {
            throw err;
        }
    },

    creationAuthor: async (name, birthYear, next) => {
        try {
            if (!name || !birthYear) {
                const err = new Error('Le champ name et birthYear est requis');
                err.status = 400;
                return next(err);
            }

            const author = await Author.create({ name, birthYear });
            return author;

        } catch (err) {
            return next(err);
        }
    },

    modifyAuthor: async (id, data, next) => {

        const { name, birthYear } = data;

        if (!name && !birthYear) {
            const err = new Error('Le champ name ou birthYear est requis');
            err.status = 400;
            return next(err);
        }

        try {
            const author = await Author.findById(id);

            if (!author) {
                const err = new Error('Auteur introuvable');
                err.status = 404;
                return next(err);
            }

            if (name) author.name = name;
            if (birthYear) author.birthYear = birthYear;

            await author.save();

            return author;

        } catch (err) {
            throw err;
        }
    },

    deleteAuthorById: async (id, next) => {
        try {
            
            // vérifier que l’auteur existe
            const author = await Author.findById(id);
            if (!author) {
                const err = new Error('Auteur introuvable');
                err.status = 404;
                throw err;
            }

            
            // vérifier s’il a des livres associés
            const booksByAuthor = await Book.find({ authorId: id });
            
            if (booksByAuthor.length > 0) {
                const err = new Error('Impossible de supprimer un auteur ayant des livres associés');
                err.status = 400;
                throw err;
            }
            

            // suppression
            await Author.findByIdAndDelete(id);

        } catch (err) {
            throw err;
        }
    }

};

module.exports = authorsService;