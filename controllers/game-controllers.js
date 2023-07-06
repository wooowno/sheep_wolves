const { EventEmitter } = require('events');
const Game = require('../models/game');
const emmiter = new EventEmitter();

exports.getHome = async (req, res) => {
    const top = req.body.top;
    res.render('home', {top: top});
}

exports.getGame = async (req, res) => {
    const gid = req.query.id;
    await Game
        .findById(gid)
        .lean()
        .then((game) => {
            res.render('game', {game: game});
        })
        .catch((err) => {
            console.log("getGame: ", err);
            res.status(500).json(err);
        })
}

exports.createGame = async (req, res) => {
    const user = req.body.user;
    const game = new Game({
        creater: user.name,
    })
    await game
        .save()
        .then(() => {
            res.redirect(`/game?id=${game.id}`);
        })
        .catch((err) => {
            console.log("createGame: ", err);
            res.status(500).json(err);
        })
}

exports.joinGame = async(req, res) => {
    await Game
        .find({available: true})
        .then((games) => {
            if(games.length == 0) res.redirect('/nogame');
            else {
                const game = games[Math.floor(Math.random() * games.length)];
                return game;
            }
        })
        .then(async (game) => {
            if (game == null) return;
            await Game
                .findOneAndUpdate({creater: game.creater}, {available: false})
                .catch((err) => {
                    console.log("joinGame update");
                    res.status(500).json(err);
                })
            res.redirect(`/game?id=${game._id.valueOf()}`);
        })
        .catch((err) => {
            console.log("joinGame find");
            res.status(500).json(err);
        })
}

exports.getNoGame = (req, res) => {
    res.render('nogame');
}

exports.getMove = async (req, res) => {
    res.writeHead(200, {
        'Connection': 'keep-alive',
        'Content-type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache',
    })
    emmiter.on('move', (move) => {
        res.write("event: message\n")
        res.write("data: " + JSON.stringify(move) + '\n\n');
    })
}

exports.postMove = async (req, res) => {
    const move = req.body;
    emmiter.emit('move', move);
    res.send('ok');
}
