const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  birthYear: {
    type: Number,
    min: 1000,
    max: 2100,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Author', AuthorSchema);
