const Game = require('../models/gameModel');
const Platform = require('../models/platformModel');
const Genre = require('../models/genreModel');

const gamesServices = {

    getSortGames: async (sort, page = 1, limit = 5) => {
        try {
            page = parseInt(page, 10);
            limit = parseInt(limit, 10);

            if (!sort) {
            sort = '-createdAt';
            }

            const order = sort.startsWith('-') ? -1 : 1;
            const field = sort.replace('-', '');

            // Si tri sur champ peuplé : contient un point (ex: platform.name)
            if (field.includes('.')) {
            const [refName, refField] = field.split('.'); // ex: ['platform','name']

            // build $lookup stage(s) pour platform et genre (selon ce dont tu as besoin)
            const lookups = [
                {
                $lookup: {
                    from: 'genres',              // collection name lowercase + s ; adapte éventuellement
                    localField: 'genre',
                    foreignField: '_id',
                    as: 'genre'
                }
                },
                { $unwind: { path: '$genre', preserveNullAndEmptyArrays: true } },
                {
                $lookup: {
                    from: 'platforms',
                    localField: 'platform',
                    foreignField: '_id',
                    as: 'platform'
                }
                },
                { $unwind: { path: '$platform', preserveNullAndEmptyArrays: true } }
            ];

            // pipeline avec facet pour total + data paginée
            const pipeline = [
                // optional: match / filters here
                ...lookups,
                // ensure documents where referenced fields might be missing still included
                { $sort: { [field]: order } },
                {
                $facet: {
                    metadata: [{ $count: 'total' }],
                    data: [
                    { $skip: (page - 1) * limit },
                    { $limit: limit },
                    // optional projection to keep same fields as .find().populate()
                    {
                        $project: {
                        title: 1,
                        slug: 1,
                        genre: 1,
                        platform: 1,
                        sessions: 1,
                        createdAt: 1,
                        updatedAt: 1
                        }
                    }
                    ]
                }
                }
            ];

            const agg = await Game.aggregate(pipeline).exec();
            const metadata = agg[0].metadata[0] || { total: 0 };
            const games = agg[0].data;

            return { games, total: metadata.total };

            } else {
            // tri sur champ simple (stocké dans Game) : on peut utiliser find() + populate
            const total = await Game.countDocuments();
            const games = await Game.find()
                .collation({ locale: 'fr', strength: 1 })
                .sort({ [field]: order })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('genre')
                .populate('platform')
                .exec();

            return { games, total };
            }

        } catch (err) {
            throw err;
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

    creationGame: async (title, slug, genre, platform, next) => {
        if (!title || !slug || !genre || !platform) {
            const err = new Error('Le champ title, slug, genre et platform est requis');
            err.status = 400;
            throw err;
        }

        const existingGame = await Game.findOne({
            $or: [{ title: title.trim() }, { slug: slug.trim() }]
        });
        
        if (existingGame) {
            const err = new Error('Un jeu avec ce nom ou ce slug existe déjà');
            err.status = 409;
            return next(err);
        }

        // Vérification que le genre existe
        const genreExists = await Genre.findById(genre);
        if (!genreExists) {
            const err = new Error('Genre avec l\'ID spécifié introuvable');
            err.status = 409;
            throw err;
        }

        // Vérification que la plateforme existe
        const platformExists = await Platform.findById(platform);
        if (!platformExists) {
            const err = new Error('Plateforme avec l\'ID spécifié introuvable');
            err.status = 409;
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

        await game.populate([
        { path: 'genre' },
        { path: 'platform' }
        ]);
        
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

    countGames : async () => {
        const count = await Game.countDocuments();
        return count;
    },

};

module.exports = gamesServices;