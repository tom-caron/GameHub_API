const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    title: { 
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
    genre: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre'
    },
    platform: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Platform'
    },
}, { timestamps: true });

module.exports = mongoose.model('Game', GameSchema);
