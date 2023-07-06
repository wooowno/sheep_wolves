const Game = require('../models/game');

module.exports = function(req, res, next) {
    const user = req.body.user;
    Game
        .findOneAndDelete({creater: user.name})
        .catch((err) => {
            res.status(500).json(err);
        })
    next();
}