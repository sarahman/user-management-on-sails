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
        var userObj = {
            name: req.param('name'),
            title: req.param('title'),
            email: req.param('email'),
            password: req.param('password'),
            confirmation: req.param('confirmation')
        };
        User.create(userObj, function (err, user) {
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
        var userObj = {
            name: req.param('name'),
            title: req.param('title'),
            email: req.param('email')
        };
        req.session.User.isAdmin ? userObj['is_admin'] = req.param('is_admin') : null;
        User.update(req.param('id'), userObj, function (err) {
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
    },
    subscribe: function (req, res) {
        User.find(function (err, users) {
            if (err) return next(err);

            User.watch(req.socket);
            User.subscribe(req.socket, users);
            if (req.isSocket) {
                return res.send(200);
            } else {
                return res.redirect('/session/new');
            }
        });
    }
};
