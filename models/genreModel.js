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

module.exports = mongoose.model('Genre', GenreSchema);
