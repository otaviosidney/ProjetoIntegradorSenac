function onlyGuest(req, res, next) {
    if (!req.session.userId) {
        return next();
    }

    if (!req.user) {
        req.session.destroy(() => {});
        return next();
    }

    return res.redirect('/');
}

module.exports = onlyGuest;