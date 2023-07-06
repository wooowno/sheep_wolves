const User = require('../models/user');

module.exports = async (req, res, next) => {
    const tops = await User.find({'wins': {$ne: 0}}).sort({'wins': -1}).limit(10).lean().catch((err) => {console.log('ebat`')});
    req.body.top = tops;
    next();
}