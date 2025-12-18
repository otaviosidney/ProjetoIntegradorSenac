const formatPostDate = require("../helpers/formatPostDate");

function setGlobalVars(req, res, next) {
    res.locals.myUser = req.user;
    res.locals.isAuthenticated = !!req.user;
    res.locals.isMyUser = null
    res.locals.formatPostDate = formatPostDate
    res.locals.searchQuery = null
    res.locals.currentUrl = req.originalUrl;
    // flash messages
    res.locals.messages = {
        error: req.flash('error'),
        success: req.flash('success'),
    };
    res.locals.errors = req.flash('errors')[0] || {}
    res.locals.old = req.flash('old')[0] || {}
    next();
};

module.exports = setGlobalVars