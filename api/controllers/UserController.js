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
            return res.redirect('/user/show/'+user.id);
        });
    },
    show: function(req, res, next) {
        User.findOne(req.param('id'), function(err, user) {
            if (err) { return next(err); }
            if (!user) { return next('User has not been found.'); }
            return res.view({
                user: user
            });
        });
    }
};
