module.exports = function (req, res, next) {
    if (req.method == 'OPTIONS') {
        next();
    }
    const token = req.cookies.uid;
    if (!token) {
        res.status(303).redirect('/signup');
    } else {
        req.body.token = token;
        next();
    }
}