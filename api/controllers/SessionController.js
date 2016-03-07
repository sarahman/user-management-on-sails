/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	new: function(req, res) {
        return res.view();
    },
    create: function(req, res, next) {
        var email;
        if (!(email = req.param('email')) || !req.param('password')) {
            var usernamePasswordRequiredError = [{
                name: 'usernamePasswordRequired', message: 'Please enter both of username & password.'
            }];
            req.session.flash = {
                err: usernamePasswordRequiredError
            };
            return res.redirect('/session/new');
        }

        User.findOneByEmail(email).exec(function(err, user) {
            if (err) return next(err);

            if (!user) {
                req.session.flash = {
                    err: [{ name: 'noAccount', message: 'The email address ' + email + ' has not been found' }]
                };

                return res.redirect('/session/new');
            }

            require('bcrypt').compare(req.param('password'), user.encryptedPassword, function(err, valid) {
                if (err) return next(err);
                if (!valid) {
                    req.session.flash = {
                        err: [{ name: 'usernamePasswordMismatch', message: 'Invalid username & password have been given.' }]
                    };

                    return res.redirect('/session/new');
                }

                req.session.authenticated = true;
                req.session.User = user;
                if (req.session.User.isAdmin) {
                    return res.redirect('/user');
                }
                return res.redirect('/user/show/' + user.id);
            });
        });
    },
    destroy: function(req, res) {
        req.session.destroy();
        return res.redirect('/session/new');
    }
};
