const express = require('express');
const {
    getSignin,
    signin,
    getSignup,
    signup,
} = require('../controllers/auth-controllers');

const router = express.Router();

router.get('/signin', getSignin);
router.post('/signin', signin);
router.get('/signup', getSignup);
router.post('/signup', signup);

module.exports = router;
