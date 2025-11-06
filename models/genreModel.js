const mongoose = require('mongoose');

const GenreSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
    slug: { 
        type: String,
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true 
    },
}, { timestamps: true });

GenreSchema.methods.safeProfile = function () {
    return {
        id: this._id,
        name: this.name,
        slug: this.slug,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    };
};

module.exports = mongoose.model('Genre', GenreSchema);
