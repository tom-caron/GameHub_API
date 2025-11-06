const mongoose = require('mongoose');
const bcrypt = require('bcrypt');	

const PlayerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 100
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 100
  },
  sessions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  }],
  totalScore: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    enum: ['player', 'admin'],
    default: 'player'
  }
}, { timestamps: true });

PlayerSchema.statics.topPlayers = function (limit = 5) {
return this.find()
.sort({ totalScore: -1 })
.limit(limit)
.select('username email totalScore role')
.lean();
};

// Middleware pour hasher le mot de passe avant sauvegarde
PlayerSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        next(err);
    }
});

// Méthode pour comparer les mots de passe
PlayerSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

PlayerSchema.methods.safeProfile = function () {
return {
id: this._id,
username: this.username,
email: this.email,
role: this.role,
totalScore: this.totalScore,
createdAt: this.createdAt,
updatedAt: this.updatedAt,
};
};

module.exports = mongoose.model('Player', PlayerSchema);
