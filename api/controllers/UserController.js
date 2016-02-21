/**
 * User Controller
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    new: function (req, res) {
        return res.view();
    },
    create: function(req, res) {
        User.create(req.params.all(), function(err, user) {
            if (err) {
                req.session.flash = {
                    err: err
                };
                return res.redirect('/user/new');
            }

            req.session.flash = {};
            return res.json(user);
        });
    }
};
