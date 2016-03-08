$(function() {
    $('form#sign-up').validate({
        rules: {
            name: { required: true },
            email: { required: true, email: true },
            password: { required: true, minlength: 6 },
            confirmation: { required: true, equalTo: 'input[name="password"]' }
        },
        messages: {
            name: { required: 'Please enter your name.' },
            email: {
                required: 'Please enter your email address.',
                email: 'Please enter a valid email address.'
            },
            password: {
                required: 'Please provide a password.',
                minlength: $.validator.format('Your password must be at least {0} characters long.')
            },
            confirmation: {
                required: 'Please provide a password',
                equalTo: 'Please enter the same password as above.'
            }
        },
        success: function(errorContainer) {
            errorContainer.text('Ok!').addClass('valid').closest('.form-group').removeClass('has-error');
        },
        errorPlacement: function ($error, $element) {
            var $errorDom = $element.closest('.form-group').addClass('has-error').find([this.errorElement, this.errorClass].join('.')).first();
            if ($errorDom.length) {
                $errorDom.replaceWith($error);
            } else {
                $error.insertAfter($element);
            }
        },
        errorClass: 'help-block',
        errorElement: 'span'
    });
});

io.socket.on('user', function (event){
    var page = document.location.pathname;
    page = page.replace(/(\/)$/, '');

    switch(page) {
        case '/user':
            if (event.verb === 'created') {
                UserIndexPage.addUser(event.id, event.data);
            }
            if (event.verb === 'updated') {
                UserIndexPage.updateUser(event.id, event.data);
            }
            break;
    }
});

io.socket.get('/user/subscribe');
var UserIndexPage = {
    addUser: function(id, user) {
        var userObj = {
            user: user,
            _csrf: window['overload'].csrf || ''
        };
        $('tr:last').after(
            JST['assets/templates/addUser.ejs'](userObj)
        );
    },
    updateUser: function(id, message) {
        var $userRow = $('tr[data-id="' + id + '"] td:eq(1) i');
        if (message.loggedIn) {
            $userRow.addClass('glyphicon-log-in').removeClass('glyphicon-log-out');
        } else {
            $userRow.removeClass('glyphicon-log-in').addClass('glyphicon-log-out');
        }
    }
};
