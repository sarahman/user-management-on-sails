/**
 * User Profile
 *
 * @module      :: Policy
 * @description :: Simple policy to allow an user to access his/her profile page.
 */
module.exports = function (req, res, ok) {

    var loggedInUserMatchesId = req.session.User.id == req.param('id'),
        isAdmin = req.session.User.isAdmin;

    if (loggedInUserMatchesId || isAdmin) {
        return ok();
    }

    // User has to be an admin or only an user to access his/her profile.
    req.session.flash = {
        err: [{ name: 'noRights', message: 'You must be an admin user.' }]
    };
    return res.redirect('/session/new');
};
