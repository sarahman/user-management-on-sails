/**
 * Admin
 *
 * @module      :: Policy
 * @description :: Simple policy to allow an admin user.
 */
module.exports = function (req, res, ok) {

    if (req.session.User && req.session.User.isAdmin) {
        return ok();
    }

    // User is not logged in.
    req.session.flash = {
        err: [{ name: 'requireAdminError', message: 'You must be an admin user.' }]
    };
    return res.redirect('/session/new');
};
