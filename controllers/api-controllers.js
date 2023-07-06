const User = require('../models/user');

exports.addWin = async (req, res) => {
    const user = req.body.user;
    await User
        .findOneAndUpdate({name: user.name}, {wins: user.wins + 1})
        .catch((err) => {
            console.log("addWin: ", err);
            res.status(500).json(err);
        })
}

exports.addLoss = async (req, res) => {
    const user = req.body.user;
    await User
        .findOneAndUpdate({name: user.name}, {losses: user.losses + 1})
        .catch((err) => {
            console.log("addWin: ", err);
            res.status(500).json(err);
        })
}