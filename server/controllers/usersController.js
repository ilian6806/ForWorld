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
    login : function(req, res) {
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
                        data = { messageViews: [
                            {
                                "message": "Positive thinking will let you do everything better than negative thinking will.",
                                "users": [
                                        {
                                            "date": "2015-02-15T12:31:42.099Z",
                                            "username": "Stefitu",
                                            "userCountry": "Bulgaria"
                                        },
                                        {
                                            "date": "2015-02-15T12:31:42.099Z",
                                            "username": "ilian6806",
                                            "userCountry": "Bulgaria"
                                        }
                                ]
                            },
                            {
                                "message": "Try to be a rainbow in someone's cloud..",
                                "users": [
                                        {
                                            "date": "2015-02-15T12:31:42.099Z",
                                            "username": "ilian6806",
                                            "userCountry": "Bulgaria"
                                        }
                                ]
                            }
                        ]};
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
    }
};