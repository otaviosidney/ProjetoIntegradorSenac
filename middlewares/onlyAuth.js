function onlyAuth(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/auth/login');
    }

    if (!req.user) {
        req.session.destroy(() => {});
        return res.redirect('/auth/login');
    }

    next();
}
module.exports = onlyAuth;
