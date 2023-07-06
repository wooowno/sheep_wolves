const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { secret } = require('../config');

const generateToken = (id) => {
    const payload = { id: id };
    return jwt.sign(payload, secret, {expiresIn: '7d'});
}

exports.getSignin = async (req, res) => {
    res.render('signin');
}

exports.signin = async (req, res) => {
    const user = new User({
        name: req.body.name,
        password: bcrypt.hashSync(req.body.password, 9),
    });
    await user
        .save()
        .then(() => {
            res.redirect(303, '/signup');
        })
        .catch((err) => {
            if (err.name === "MongoServerError") {
                return res.render('signin', {message: 'Это имя уже занято'});
            } else if (err.name === 'ValidationError') {
                return res.render('signin', {message: err.message.split(': ')[2]})
            }
            res.status(500).json(err);
        });
}

exports.getSignup = async (req, res) => {
    res.render('signup');
}

exports.signup = async (req, res) => {
    await User
        .findOne({ name: req.body.name })
        .then((user) => {
            const notFound = new Error('Нет пользователя с этим именем');
            const invalidPsw = new Error('Неверный пароль');
            notFound.name = 'NotFoundUserError'
            invalidPsw.name = 'InvalidPassword'
            if (!user) throw notFound;
            const pswV = bcrypt.compareSync(req.body.password, user.password);
            if (!pswV) throw invalidPsw;
            return user;
        })
        .then((user) => {
            const token = generateToken(user._id.toString())
            res.cookie('uid', token);
            res.cookie('name', user.name);
        })
        .then(() => {
            res.redirect(303, '/home');
        })
        .catch((err) => {
            if (['NotFoundUserError', 'InvalidPassword'].includes(err.name)) {
                return res.render('signup', {message: err.message});
            }
            res.status(500).json(err)
        });
}
