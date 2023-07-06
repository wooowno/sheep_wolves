const express = require('express');
const user = require('../middlware/user-middleware');
const game = require('../middlware/game-middleware');
const top = require('../middlware/top-middleware');
const {
    getHome,
    getGame,
    createGame,
    joinGame,
    getNoGame,
    postMove,
    getMove,
} = require('../controllers/game-controllers')

const router = express.Router();

router.get('/home', user, game, top, getHome);
router.get('/game', getGame);
router.post('/game', user, createGame);
router.post('/join-game', joinGame);
router.get('/nogame', getNoGame);
router.get('/get-move', getMove);
router.post('/post-move', postMove);

module.exports = router;
