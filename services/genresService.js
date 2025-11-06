const Genre = require('../models/genreModel');
const Game = require('../models/gameModel');

const genresService = {

    getSortGenres: async (sort, page, limit, next) => {
        try {
            let query = Genre.find();

            if (sort) {
                const order = sort.startsWith('-') ? -1 : 1;
                const field = sort.replace('-', '');
                query = query.sort({ [field]: order });
            }

            const total = await Genre.countDocuments();

            const genres = await query
                .skip((page - 1) * limit)
                .limit(limit)
                .exec();

            return { genres, total }
        } catch (err) {
            return next(err);
        }
    },

    getOneGenreId: async (idSearch, next) => {
        try {
            const genres = await Genre.findById(idSearch);

            if (!genres) {
                const err = new Error('Genre introuvable');
                err.status = 404;
                return next(err);
            }

            return genres;

        } catch (err) {
            throw err;
        }
    },

    creationGenre: async (name, slug, next) => {
        try {
            if (!name || !slug) {
                const err = new Error('Le champ name et slug est requis');
                err.status = 400;
                return next(err);
            }

            const genre = await Genre.create({ name, slug });
            return genre;

        } catch (err) {
            return next(err);
        }
    },

    modifyGenre: async (id, data) => {

        // on ne doit pas laisser l’UI mettre à jour totalScore, sessions etc.
        const allowedFields = ["name", "slug"];
        const updateData = {};

        allowedFields.forEach(field => {
            if (data[field] !== undefined){
                updateData[field] = data[field];
            }
        });

        // Récupère le joueur
        const genre = await Genre.findById(id);
        if (!genre) {
            const err = new Error('Genre introuvable');
            err.status = 404;
            throw err;
        }

        // check unique name
        if (updateData.name) {
            const nameExists = await Genre.findOne({ name: updateData.name, _id: { $ne: id } });
            if (nameExists) {
                const err = new Error("Nom déjà utilisé");
                err.status = 400;
                throw err;
            }
        }

        // check unique slug
        if (updateData.slug) {
            const slugExists = await Genre.findOne({ slug: updateData.slug, _id: { $ne: id } });
            if (slugExists) {
                const err = new Error("Slug déjà utilisé");
                err.status = 400;
                throw err;
            }
        }

        Object.keys(updateData).forEach(field => {
            genre[field] = updateData[field];
        });

        await genre.save();

        return genre.safeProfile();
    },

    deleteGenreById: async (id, next) => {
        try {
            
            // vérifier que l’auteur existe
            const genre = await Genre.findById(id);
            if (!genre) {
                const err = new Error('Genre introuvable');
                err.status = 404;
                throw err;
            }

            
            // vérifier s’il a des livres associés
            const gamesByGenre = await Game.find({ platform: id });
            
            if (gamesByGenre.length > 0) {
                const err = new Error('Impossible de supprimer un genre ayant des jeux associés');
                err.status = 400;
                throw err;
            }
            

            // suppression
            await Genre.findByIdAndDelete(id);

        } catch (err) {
            throw err;
        }
    }

};

module.exports = genresService;