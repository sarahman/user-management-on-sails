/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    schema: true,

    attributes: {
        name: {
            type: 'string',
            required: true
        },
        email: {
            type: 'email',
            required: true,
            unique: true
        },
        title: {
            type: 'string'
        },
        encryptedPassword: {
            type: 'string',
            columnName: 'password'
        },
        isAdmin: {
            type: 'boolean',
            defaultsTo: false,
            columnName: 'is_admin'
        },
        createdAt: {
            type: 'datetime',
            columnName: 'created_at'
        },
        updatedAt: {
            type: 'datetime',
            columnName: 'updated_at'
        },
        toJSON: function () {
            var obj = this.toObject();
            delete obj.password;
            delete obj.confirmation;
            delete obj.encryptedPassword;
            delete obj._csrf;
            return obj;
        }
    },

    'beforeValidation': function (values, next) {
        if (typeof values.is_admin !== 'undefined') {
            delete values.isAdmin;
            if (values.is_admin == '0') {
                values.is_admin = false;
            } else if (_.indexOf(['on', '1'], values.is_admin[1]) > -1) {
                values.is_admin = true;
            }
        }

        return next();
    },

    'beforeCreate': function (values, next) {
        if (!values.password || values.password != values.confirmation) {
            return next({ err: 'Password does not match password confirmation.' });
        }

        require('bcrypt').hash(values.password, 10, function (err, encryptedPassword) {
            if (err) return next(err);
            values.encryptedPassword = encryptedPassword;
            return next();
        });
    }
};
