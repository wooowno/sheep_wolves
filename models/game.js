const { Schema, default: mongoose } = require('mongoose');

const gameSchema = new Schema({
    creater: {
        type: String,
        unique: true,
    },
    available: {
        type: Boolean,
        default: true,
    }
})

module.exports = mongoose.model('Game', gameSchema);
