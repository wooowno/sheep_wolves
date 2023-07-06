exports.getAccount = async (req, res) => {
    const user = req.body.user;
    res.render('account', { user: user });
}

exports.getExit = async (req, res) => {
    res.clearCookie('uid');
    res.redirect('/signup');
}
