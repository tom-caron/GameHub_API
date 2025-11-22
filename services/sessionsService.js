const Session = require('../models/sessionModel');
const Player = require('../models/playerModel');
const Game = require('../models/gameModel');

const sessionsServices = {

    getSortSessions: async (sort, page = 1, limit = 5) => {
    try {
        // Définition du tri
        let sortQuery = {};
        if (sort) {
            const order = sort.startsWith('-') ? -1 : 1;
            const field = sort.replace('-', '');

            // Support du tri sur player.xxx et game.xxx
            if (field.startsWith('player.') || field.startsWith('game.')) {
                sortQuery[field] = order;
            } else {
                sortQuery[field] = order;
            }
        }

        const skip = (page - 1) * limit;

        // Pipeline AGGREGATE
        const sessions = await Session.aggregate([
    // Lookup Player
        {
            $lookup: {
                from: 'players',
                localField: 'player',
                foreignField: '_id',
                as: 'player'
            }
        },
        { $unwind: "$player" },

        // Retirer password
        { $project: { "player.password": 0 } },

        // Lookup Game
        {
            $lookup: {
                from: 'games',
                localField: 'game',
                foreignField: '_id',
                as: 'game'
            }
        },
        { $unwind: "$game" },

        // 👉 Ajouter durationSeconds comme ton virtual
        {
            $addFields: {
                durationSeconds: {
                    $floor: {
                        $divide: [
                            {
                                $subtract: [
                                    {
                                        $cond: [
                                            "$active",
                                            new Date(),
                                            "$updatedAt"
                                        ]
                                    },
                                    "$createdAt"
                                ]
                            },
                            1000
                        ]
                    }
                }
            }
        },

        // 👉 Tri dynamique
        ...(sort ? [{ $sort: sortQuery }] : []),

        // Pagination
        { $skip: skip },
        { $limit: limit },
    ]);


        // Compte total
        const total = await Session.countDocuments();

        return { sessions, total };

    } catch (err) {
        return next(err);
    }
},



    getOneSessionId: async (idSearch) => {
        const session = await Session.findById(idSearch)
            .populate('player', '-password')
            .populate('game');

        if (!session) {
            const err = new Error('Session introuvable');
            err.status = 404;
            throw err;
        }

        return session;
    },

    creationSession: async (player, game) => {
        if (!player || !game) {
            const err = new Error('Le champ player et game est requis');
            err.status = 400;
            throw err;
        }

        // Vérification que le joueur existe
        const playerExists = await Player.findById(player);
        if (!playerExists) {
            const err = new Error('Joueur avec l\'ID spécifié introuvable');
            err.status = 400;
            throw err;
        }

        //verifier qu'il n'est pas déjà dans une autre session active
        const activeSession = await Session.findOne({
            player: player,
            active: true
        });
        if (activeSession) {
            const err = new Error('Le joueur est déjà dans une session active');
            err.status = 400;
            throw err;
        }

        // Vérification que le jeu existe
        const gameExists = await Game.findById(game);
        if (!gameExists) {
            const err = new Error('Jeu avec l\'ID spécifié introuvable');
            err.status = 400;
            throw err;
        }

        // Création de la session
        const session = new Session({
            player,
            game,
        });

        await session.save();

        await session.populate([
        { path: 'player' },
        { path: 'game' }
        ]);

        return session;
    },

    modifySession: async (id, player, game, score, active) => {

        const session = await Session.findById(id);
        if (!session) {
            const err = new Error('Session introuvable');
            err.status = 404;
            throw err;
        }

        if (!player && !game && !score && !active) {
            const err = new Error('Le champ player, game, score ou active est requis');
            err.status = 400;
            throw err;
        }

        if (player) {
            // Vérification que le joueur existe
            const playerExists = await Player.findById(player);
            if (!playerExists) {
                const err = new Error('Joueur avec l\'ID spécifié introuvable');
                err.status = 400;
                throw err;
            }
            //Vérifier qu'il n'est pas déjà dans une autre session active
            const activeSession = await Session.findOne({
                player: player,
                active: true,
                _id: { $ne: id } // Exclure la session actuelle
            });
            
            if (activeSession) {
                const err = new Error('Le joueur est déjà dans une session active');
                err.status = 400;
                throw err;
            }

            session.player = player;
        }

        if (game) {
            // Vérification que le jeu existe
            const gameExists = await Game.findById(game);
            if (!gameExists) {
                const err = new Error('Jeu avec l\'ID spécifié introuvable');
                err.status = 400;
                throw err;
            }
            session.game = game;
        }

        if (score !== undefined) {
            session.score = score;
        }

        if (active !== undefined) {
            session.active = active;
        }

        await session.save();
        return session;
    },

    deleteSessionById: async (id) => {

        const session = await Session.findById(id);
        if (!session) {
            const err = new Error('Session introuvable');
            err.status = 404;
            throw err;
        }

        await Session.findByIdAndDelete(id);
    },

};

module.exports = sessionsServices;