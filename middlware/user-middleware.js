const jwt = require('jsonwebtoken');
const { secret } = require('../config');
const User = require('../models/user')

module.exports = async (req, res, next) => {
    const token = req.body.token;
    const data = jwt.verify(token, secret);
     await User
        .findById(data.id)
        .lean()
        .then((user) => {
            req.body.user = user;
        })
        .catch(err => console.log('По токену пользователь не найден'));

    next();
}