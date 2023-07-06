const express = require('express');
const user = require('../middlware/user-middleware');
const {
    addWin,
    addLoss,
} = require('../controllers/api-controllers');

const router = express.Router();

router.put('/api/win', user, addWin);
router.put('/api/loss', user, addLoss);

module.exports = router;