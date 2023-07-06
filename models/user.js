const { Schema, default: mongoose } = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        unique: [true, 'Это Имя занято'],
        requier: [true, 'Введите Имя'],
        minlength: [1, 'Имя меньше 1 символа'],
        maxlength: [11, 'Имя длинее 10 символов'],
    },
    password: {
        type: String,
        required: [true, 'Введите Пароль'],
        trim: true,
        minlength: [6, 'Пароль меньше 6 символов']
    },
    losses: {
        type: Number,
        default: 0,
    },
    wins: {
        type: Number,
        default: 0,
    },
    created: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('User', userSchema);
