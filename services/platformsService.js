const Platform = require('../models/platformModel');
const Game = require('../models/gameModel');

const platformsService = {

    getSortPlatforms: async (sort, page = 1, limit = null, next) => {
        try {
            let query = Platform.find();

            if (sort) {
            const order = sort.startsWith('-') ? -1 : 1;
            const field = sort.replace('-', '');
            query = query
                .collation({ locale: 'fr', strength: 1 })
                .sort({ [field]: order });
            }

            const total = await Platform.countDocuments();

            if (limit && limit > 0) {
            query = query.skip((page - 1) * limit).limit(limit);
            }

            const platforms = await query.exec();

            return { platforms, total };
        } catch (err) {
            return next(err);
        }
    },


    getOnePlatformId: async (idSearch, next) => {
        try {
            const platforms = await Platform.findById(idSearch);

            if (!platforms) {
                const err = new Error('Plateforme introuvable');
                err.status = 404;
                return next(err);
            }

            return platforms;

        } catch (err) {
            throw err;
        }
    },

    creationPlatform: async (name, slug, next) => {
        try {
            if (!name || !slug) {
                const err = new Error('Le champ name et slug est requis');
                err.status = 400;
                return next(err);
            }

            // Vérifie si une plateforme existe déjà avec le même nom ou le même slug
            const existingPlatform = await Platform.findOne({
            $or: [{ name: name.trim() }, { slug: slug.trim() }]
            });

            if (existingPlatform) {
            const err = new Error('Une plateforme avec ce nom ou ce slug existe déjà');
            err.status = 409; // 409 = Conflict
            return next(err);
            }

            const platform = await Platform.create({ name, slug });
            return platform;

        } catch (err) {
            return next(err);
        }
    },

    modifyPlatform: async (id, data) => {

        // on ne doit pas laisser l’UI mettre à jour totalScore, sessions etc.
        const allowedFields = ["name", "slug"];
        const updateData = {};

        allowedFields.forEach(field => {
            if (data[field] !== undefined){
                updateData[field] = data[field];
            }
        });

        // Récupère le joueur
        const platform = await Platform.findById(id);
        if (!platform) {
            const err = new Error('Plateforme introuvable');
            err.status = 404;
            throw err;
        }

        // check unique name
        if (updateData.name) {
            const nameExists = await Platform.findOne({ name: updateData.name, _id: { $ne: id } });
            if (nameExists) {
                const err = new Error("Nom déjà utilisé");
                err.status = 400;
                throw err;
            }
        }

        // check unique slug
        if (updateData.slug) {
            const slugExists = await Platform.findOne({ slug: updateData.slug, _id: { $ne: id } });
            if (slugExists) {
                const err = new Error("Slug déjà utilisé");
                err.status = 400;
                throw err;
            }
        }

        Object.keys(updateData).forEach(field => {
            platform[field] = updateData[field];
        });

        await platform.save();

        return platform.safeProfile();
    },

    deletePlatformById: async (id, next) => {
        try {
            
            // vérifier que l’auteur existe
            const platform = await Platform.findById(id);
            if (!platform) {
                const err = new Error('Plateforme introuvable');
                err.status = 404;
                throw err;
            }

            
            // vérifier s’il a des livres associés
            const gamesByPlatform = await Game.find({ platform: id });
            
            if (gamesByPlatform.length > 0) {
                const err = new Error('Impossible de supprimer une plateforme ayant des jeux associés');
                err.status = 400;
                throw err;
            }
            

            // suppression
            await Platform.findByIdAndDelete(id);

        } catch (err) {
            throw err;
        }
    }

};

module.exports = platformsService;