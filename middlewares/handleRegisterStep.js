const {User} = require('../models')

async function handleRegisterStep(req, res, next) {
    const { tempUserId } = req.session;

    if (!tempUserId) {
        return res.redirect('/auth/register');
    }

    const user = await User.findByPk(tempUserId);

    if (!user) {
        req.session.tempUserId = null;
        return res.redirect('/auth/register');
    }

    if (user.isRegistrationComplete) {
        return res.redirect('/');
    }

    const correctRouteByStep = {
        0: '/auth/register/step/1',
        1: '/auth/register/step/2',
        2: '/auth/register/step/3'
    };

    const expectedRoute = correctRouteByStep[user.registrationStep];
    const currentPath = req.originalUrl;

    if (currentPath === expectedRoute) {
        return next();
    }

    return res.redirect(expectedRoute);
}

module.exports = handleRegisterStep