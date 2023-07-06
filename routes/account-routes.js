const express = require('express');
const user = require('../middlware/user-middleware');
const game = require('../middlware/game-middleware');
const {
    getAccount,
    getExit,
} = require('../controllers/account-controllers');

const router = express.Router();

router.get('/account', user, game, getAccount);
router.get('/exit', getExit);

module.exports = router;