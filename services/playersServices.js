const Player = require('../models/playerModel');
require('../models/sessionModel');

const playerService = {

    getSortPlayers: async (sort, page, limit, next) => {
        try {
            let query = Player.find();
    
            if (sort) {
                const order = sort.startsWith('-') ? -1 : 1;
                const field = sort.replace('-', '');
                query = query.sort({ [field]: order });
            }
    
            const total = await Player.countDocuments();
    
            const players = await query
                .select('-password')
                .skip((page - 1) * limit)
                .limit(limit)
                .exec();
    
            return { players, total }
        } catch (err) {
            return next(err);
        }
    },

    getOnePlayerId: async (idSearch) => {
        const player = await Player
            .findById(idSearch)
            .populate('sessions')
            .select('-password');

        if (!player) {
            const err = new Error('Player introuvable');
            err.status = 404;
            throw err;
        }

        return player;
    },

    modifyPlayer: async (id, data) => {

        // on ne doit pas laisser l’UI mettre à jour totalScore, sessions etc.
        const allowedFields = ["email", "username", "password", "role"];
        const updateData = {};

        allowedFields.forEach(field => {
            if (data[field] !== undefined){
                updateData[field] = data[field];
            }
        });

        // Récupère le joueur
        const player = await Player.findById(id);
        if (!player) {
            const err = new Error('Player introuvable');
            err.status = 404;
            throw err;
        }

        // check unique email
        if (updateData.email) {
            const emailExists = await Player.findOne({ email: updateData.email, _id: { $ne: id } });
            if (emailExists) {
                const err = new Error("Email déjà utilisé");
                err.status = 400;
                throw err;
            }
        }

        // check unique username
        if (updateData.username) {
            const usernameExists = await Player.findOne({ username: updateData.username, _id: { $ne: id } });
            if (usernameExists) {
                const err = new Error("Username déjà utilisé");
                err.status = 400;
                throw err;
            }
        }

        Object.keys(updateData).forEach(field => {
            player[field] = updateData[field];
        });

        await player.save();

        return player.safeProfile();
    },

    deletePlayerById: async (id) => {

        const player = await Player.findById(id);
        if (!player) {
            const err = new Error('Player introuvable');
            err.status = 404;
            throw err;
        }

        await Player.findByIdAndDelete(id);
    },

};

module.exports = playerService;