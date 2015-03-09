var User = require('mongoose').model('User');
var View = require('mongoose').model('View');

module.exports = {
    getAll: function(req, res) {
        if (inProduction()){
            res.send(new Response({}, 0, 'getAll'));
            return;
        }
        User.find({}).exec(function(err, collection) {
            if (err) {
                logError(err);
                log('Users could not be loaded: ' + err);
            }
            res.send(collection);
        });
    },
    register: function(req, res) {
        try {
            var data = parse(req.body.data);
            var newUserData = {
                userId: data.userId,
                username: data.username,
                country: data.country,
                userInfo: data.userInfo,
                regDate: new Date(),
                lastLoginDate: new Date()
            };
            log(newUserData);
        } catch (err) {
            logError(err);
            res.send(new Response({}, 0, 'register', err));
            return;
        }

        User.create(newUserData, function(err, user) {
            if (err) {
                res.send(new Response({}, 0, 'register', err));
                return;
            }
            res.send(new Response({}, 1, 'register'));
        });
    },
    updateUser: function(req, res) {
        try {
            var data = parse(req.body.data);
            var newUserData = {
                userId: data.userId,
                username: data.username,
                country: data.country,
                userInfo: data.userInfo
            };
            log(newUserData);
        } catch (err) {
            logError(err);
            res.send(new Response({}, 0, 'updateUser', err));
            return;
        }

        User.findOne({ userId: newUserData.userId }, function (err, user) {
            if (err || !user) {
                res.send(new Response({}, 0, 'updateUser', err));
                return;
            }

            user.username = newUserData.username;
            user.country = newUserData.country;
            user.userInfo = newUserData.userInfo;
            user.lastLoginDate = new Date();

            try {
                user.save();
                res.send(new Response({}, 1, 'updateUser', err));
            } catch (err) {
                logError(err);
                res.send(new Response({}, 0, 'updateUser', err));
                return;
            }
        });
    },
    login: function(req, res) {
        try {
            log(req.body.data)
            var userId = parse(req.body.data).userId;
        } catch (err) {
            logError(err);
            res.send(new Response({}, 0, 'login', err));
            return;
        }

        // update last login date and check for message views
        User.findOne({ userId: userId }, function(err, user) {
            if (err || !user) {
                res.send(new Response({}, 0, 'login', err));
                return;
            }

            user.lastLoginDate = new Date();
            user.save(function(err) {
                if (err) { 
                    res.send(new Response({}, 0, 'login', err));
                    return;
                }
                // send message views to getViewsPerMessage to modify it and send to response
                View.find({ authorId: user.userId }).exec(function(err, collection) {
                    if (err) { 
                        res.send(new Response({}, 1, 'login'));
                        return;
                    }
                    View.getViewsPerMessage(collection, function(views) {
                        var data = (views.length) ? { messageViews: views } : {};
                        res.send(new Response(data, 1, 'login'));
                    });
                    // once returned delete these records
                    each(collection, function() {
                        this.remove(); 
                    });
                });
            });
        });
    },
    getUserInfo: function(req, res) {
        try {
            var userId = parse(req.body.data).userId;
        } catch (err) {
            logError(err);
            res.send(new Response({}, 0, 'getUserInfo', err));
            return;
        }

        User.findOne({ userId: userId }, function(err, user) {
            if (err) {
                res.send(new Response({}, 0, 'getUserInfo', err));
                return;
            }

            res.send(new Response({
                username: user.username,
                country: user.country,
                userInfo: user.userInfo
            }, 1, 'getUserInfo'));
        });
    },
    checkForUser: function(req, res) {
        try {
            var userId = parse(req.body.data).userId;
        } catch (err) {
            logError(err);
            res.send(new Response({}, 0, 'checkForUser', err));
            return;
        }

        User.findOne({ userId: userId }, function(err, user) {
            if (err) {
                res.send(new Response({}, 0, 'checkForUser', err));
                return;
            }
            if (user) {
                res.send(new Response({
                    username: user.username,
                    country: user.country,
                    userInfo: user.userInfo
                }, 1, 'checkForUser'));
            } else {
                res.send(new Response({}, 0, 'checkForUser', err));
            }
        });
    }
};