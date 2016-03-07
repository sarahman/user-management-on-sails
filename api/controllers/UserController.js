/**
 * User Controller
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    index: function (req, res, next) {
        User.find(function (err, users) {
            if (err) return next(err);
            if (!users) return next('No user has been found.');

            return res.view({
                users: users
            });
        });
    },
    new: function (req, res) {
        return res.view();
    },
    create: function (req, res) {
        User.create(req.params.all(), function (err, user) {
            if (err) {
                req.session.flash = {
                    err: err
                };
                return res.redirect('/user/new');
            }

            req.session.flash = {};
            if (!req.session.authenticated) {
                req.session.authenticated = true;
                req.session.User = user;
                user.isOnline = true;
                user.save(function(err, user) {
                    if (err) return next(err);
                    return res.redirect('/user/show/' + user.id);
                });
            }
            return res.redirect('/user/show/' + user.id);
        });
    },
    show: function (req, res, next) {
        User.findOne(req.param('id'), function (err, user) {
            if (err) return next(err);
            if (!user) return next('User has not been found.');

            return res.view({
                user: user
            });
        });
    },
    edit: function (req, res, next) {
        User.findOne(req.param('id'), function (err, user) {
            if (err) return next(err);
            if (!user) return next('User has not been found.');

            return res.view({
                user: user
            });
        });
    },
    update: function (req, res) {
        User.update(req.param('id'), req.params.all(), function (err) {
            if (err) return res.redirect('/user/edit/' + req.param('id'));

            req.session.flash = {};
            return res.redirect('/user/show/' + req.param('id'));
        });
    },
    destroy: function (req, res, next) {
        User.findOne(req.param('id'), function (err, user) {
            if (err) return next(err);
            if (!user) return next('User has not been found.');

            User.destroy(req.param('id'), function(err) {
               if (err) return next(err);
            });
            res.redirect('/user');
        });
    }
};
