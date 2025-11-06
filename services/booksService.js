const Book = require('../models/bookModel');
const Author = require('../models/authorModel');

const booksServices = {

    getSortBooks: async (sort, page = 1, limit = 5) => {
        try {
            let query = Book.find();

            if (sort) {
                const order = sort.startsWith('-') ? -1 : 1;
                const field = sort.replace('-', '');
                query = query.sort({ [field]: order });
            }

            const total = await Book.countDocuments();

            const books = await query
                .skip((page - 1) * limit)
                .populate('authorId')
                .limit(limit)
                .exec();

            return { books, total }
        } catch (err) {
            return next(err);
        }
    },


    getOneBookId: async (idSearch) => {
        const book = await Book.findById(idSearch).populate('authorId');
        console.log(book);

        if (!book) {
            const err = new Error('Livre introuvable');
            err.status = 404;
            throw err;
        }

        return book;
    },

    creationBook: async (title, authorId, publishedYear) => {
        if (!title || !authorId || !publishedYear) {
            const err = new Error('Le champ title, authorId et publishedYear est requis');
            err.status = 400;
            throw err;
        }

        // Vérification que l'auteur existe
        const authorExists = await Author.findById(authorId);
        if (!authorExists) {
            const err = new Error('Auteur avec l\'ID spécifié introuvable');
            err.status = 400;
            throw err;
        }

        // Création du livre
        const book = new Book({
            title,
            authorId,
            publishedYear
        });

        await book.save();

        // Populate l'auteur pour renvoyer les infos complètes
        await book.populate('authorId');

        return book;
    },

    modifyBook: async (id, title, authorId, publishedYear) => {

        const book = await Book.findById(id);
        if (!book) {
            const err = new Error('Livre introuvable');
            err.status = 404;
            throw err;
        }

        if (!title && !authorId && !publishedYear) {
            const err = new Error('Le champ title, authorId ou publishedYear est requis');
            err.status = 400;
            throw err;
        }

        if (title) book.title = title;
        if (authorId) {
            const authorExists = await Author.findById(authorId);
            if (!authorExists) {
                const err = new Error('Auteur avec l\'ID spécifié introuvable');
                err.status = 400;
                throw err;
            }
            book.authorId = authorId;
        }
        if (publishedYear) book.publishedYear = publishedYear;

        await book.save();
        return book;
    },

    deleteBookById: async (id) => {

        const book = await Book.findById(id);
        if (!book) {
            const err = new Error('Livre introuvable');
            err.status = 404;
            throw err;
        }

        await Book.findByIdAndDelete(id);
    },

};

module.exports = booksServices;