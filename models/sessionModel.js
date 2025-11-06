const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Player', 
        required: true 
    },
    game: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Game', 
        required: true 
    },
    durationSeconds: { 
        type: Number, 
        default: 0 
    }, // store duration in seconds
    score: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    notes: { 
        type: String 
    },
    metadata: { 
        type: mongoose.Schema.Types.Mixed 
    },
}, { timestamps: true });


sessionSchema.pre('save', async function (next) {
    try {
        if (this.isNew) {
            this._scoreDelta = this.score; // mark for post-save
            return next();
        }
        // not new -> fetch previous document to compute delta
        const orig = await this.constructor.findById(this._id).lean();
        if (!orig) {
            this._scoreDelta = this.score;
        } else {
            this._scoreDelta = this.score - (orig.score || 0);
        }
        return next();
    } catch (err) {
        return next(err);
    }
});


sessionSchema.post('save', async function (doc) {
    try {
        const delta = this._scoreDelta || 0;
        if (delta !== 0) {
            await Player.findByIdAndUpdate(doc.player, { $inc: { totalScore: delta }, $addToSet: { sessions: doc._id } });
        } else {
            // still ensure session id present on create/update
            await Player.findByIdAndUpdate(doc.player, { $addToSet: { sessions: doc._id } });
        }
        // Ensure game has a reference to the session
        await Game.findByIdAndUpdate(doc.game, { $addToSet: { sessions: doc._id } });
    } catch (err) {
        return next(err);
    }
});


sessionSchema.post('findOneAndDelete', async function (doc) {
    try {
        if (!doc) return;
        await Player.findByIdAndUpdate(doc.player, { $inc: { totalScore: -doc.score }, $pull: { sessions: doc._id } });
        await Game.findByIdAndUpdate(doc.game, { $pull: { sessions: doc._id } });
    } catch (err) {
        return next(err);
}
});

sessionSchema.post('remove', async function (doc) {
    try {
        await Player.findByIdAndUpdate(doc.player, { $inc: { totalScore: -doc.score }, $pull: { sessions: doc._id } });
        await Game.findByIdAndUpdate(doc.game, { $pull: { sessions: doc._id } });
    } catch (err) {
        return next(err);
}
});

module.exports = mongoose.model('Session', sessionSchema);
