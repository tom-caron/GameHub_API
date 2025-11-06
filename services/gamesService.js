const Game = require('../models/gameModel');
const Platform = require('../models/platformModel');
const Genre = require('../models/genreModel');

const gamesServices = {

    getSortGames: async (sort, page = 1, limit = 5) => {
        try {
            let query = Game.find();

            if (sort) {
                const order = sort.startsWith('-') ? -1 : 1;
                const field = sort.replace('-', '');
                query = query.sort({ [field]: order });
            }

            const total = await Game.countDocuments();

            const games = await query
                .skip((page - 1) * limit)           
                .populate('genre')
                .populate('platform') 
                .limit(limit)
                .exec();

            return { games, total }
        } catch (err) {
            return next(err);
        }
    },


    getOneGameId: async (idSearch) => {
        const game = await Game.findById(idSearch)
            .populate('genre')
            .populate('platform');

        if (!game) {
            const err = new Error('Jeu introuvable');
            err.status = 404;
            throw err;
        }

        return game;
    },

    creationGame: async (title, slug, genre, platform) => {
        if (!title || !slug || !genre || !platform) {
            const err = new Error('Le champ title, slug, genre et platform est requis');
            err.status = 400;
            throw err;
        }

        // Vérification que le genre existe
        const genreExists = await Genre.findById(genre);
        if (!genreExists) {
            const err = new Error('Genre avec l\'ID spécifié introuvable');
            err.status = 400;
            throw err;
        }

        // Vérification que la plateforme existe
        const platformExists = await Platform.findById(platform);
        if (!platformExists) {
            const err = new Error('Plateforme avec l\'ID spécifié introuvable');
            err.status = 400;
            throw err;
        }

        // Création du livre
        const game = new Game({
            title,
            slug,
            genre,
            platform
        });

        await game.save();

        await game.populate([
        { path: 'genre' },
        { path: 'platform' }
        ]);

        return game;
    },

    modifyGame: async (id, title, slug, genre, platform) => {

        const game = await Game.findById(id);
        if (!game) {
            const err = new Error('Jeu introuvable');
            err.status = 404;
            throw err;
        }

        if (!title && !slug && !genre && !platform) {
            const err = new Error('Le champ title, slug, genre ou platform est requis');
            err.status = 400;
            throw err;
        }

        if (title) {
            game.title = title;
        }
        if (slug) {
            game.slug = slug;
        }
        if (genre) {
            const genreExists = await Genre.findById(genre);
            if (!genreExists) {
                const err = new Error('Genre avec l\'ID spécifié introuvable');
                err.status = 400;
                throw err;
            }

            game.genre = genre;
        }
        if (platform) {
            const platformExists = await Platform.findById(platform);
            if (!platformExists) {
                const err = new Error('Plateforme avec l\'ID spécifié introuvable');
                err.status = 400;
                throw err;
            }
            game.platform = platform;
        }

        await game.save();
        return game;
    },

    deleteGameById: async (id) => {

        const game = await Game.findById(id);
        if (!game) {
            const err = new Error('Jeu introuvable');
            err.status = 404;
            throw err;
        }

        await Game.findByIdAndDelete(id);
    },

};

module.exports = gamesServices;