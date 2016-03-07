/**
 * Authentication
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 */
module.exports = function (req, res, next) {

    if (req.session.authenticated) {
        return next();
    }

    // User is not logged in.
    req.session.flash = {
        err: [{ name: 'requireLogin', message: 'You must be signed in.' }]
    };
    return res.redirect('/session/new');
};
