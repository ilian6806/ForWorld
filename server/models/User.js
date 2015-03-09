var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    userId: { type: String, require: '{PATH is required}', unique : true },
    username: { type: String, require: '{PATH is required}' },
    country: { type: String, require: '{PATH is required}' },
    userInfo: { type: String, require: '{PATH is required}' },
    regDate: { type: Date, require: '{PATH is required}' },
    lastLoginDate: { type: Date, require: '{PATH is required}' }
});

var User = mongoose.model('User', userSchema);

module.exports.seedInitialUsers = function() {

    User.find({}).exec(function(err, collection) {
        if (err) {
            log('Cannot find users: ' + err);
            return;
        }

        if (collection.length === 0) {

            User.create({
                userId: '12314512',
                username: 'ilian6806',
                country: 'Bulgaria',
                userInfo: 'Blaaa blaaa',
                regDate: new Date(),
                lastLoginDate: new Date()
            });

            User.create({
                userId: '31211123',
                username: 'Stefitu',
                country: 'Bulgaria',
                userInfo: 'Blaaa2 blaaa2',
                regDate: new Date(),
                lastLoginDate: new Date()
            });

            log('Users added');
        }
    });
};
//User.remove({}).exec(function() { console.log('users deleted'); });
