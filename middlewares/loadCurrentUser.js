const User = require("../models/userModel");

async function loadCurrentUser(req, res, next) {
    if (!req.session.userId) {
        req.user = null;
        return next();
    }

    try {
        const user = await User.findByPk(req.session.userId);
        req.user = user || null;
        next();
    } catch (err) {
        next(err);
    }
};
module.exports = loadCurrentUser
