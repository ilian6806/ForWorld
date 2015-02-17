var Message = require('mongoose').model('Message');
var User = require('mongoose').model('User');
var View = require('mongoose').model('View');

module.exports = {
    getAll: function(req, res) {
        if (inProduction()){
            res.send(new Response({}, 0, 'getAll'));
            return;
        }
        Message.find({}).exec(function(err, collection) {
            if (err) {
                console.log('Messages could not be loaded: ' + err);
            }
            res.send(collection);
        });
    },
    sendMessage: function(req, res) {
        try {
            var data = parse(req.body.data);
            var newMessageData = {
                fromUserId: data.fromUserId,
                message: data.message,
                country: data.country,
                date: new Date()
            };
            log(newMessageData);
        } catch (err) {
            logError(err);
            res.send(new Response({}, 0, 'sendMessage', err));
            return;
        }

        Message.create(newMessageData, function(err, user) {
            if (err) {
                res.send(new Response({}, 0, 'sendMessage', err));
                return;
            }
            res.send(new Response({}, 1, 'sendMessage'));
        });
    },
    getMessage: function(req, res) {
        try {
            var userId = parse(req.body.data).userId;
        } catch (err) {
            logError(err);
            res.send(new Response({}, 0, 'getMessage', err));
            return;
        }

        Message.find({}).sort({'date': 1}).where('fromUserId').ne(userId).exec(function(err, collection) {
            if (err || !collection || collection.length == 0) {
                res.send(new Response({}, 0, 'getMessage', err));
                return;
            }

            var message = collection[Math.floor(Math.random() * collection.length)];

            User.findOne({userId: message.fromUserId}, function (err, user) {
                if (err || !user) {
                    res.send(new Response({}, 0, 'getMessage', err));
                    return;
                }

                var formatedDate = formatDate(message.date).split(' ');

                var viewData = {
                    authorId: user.userId,
                    viewerId: userId,
                    messageId: message._id,
                    date: new Date()
                };

                View.create(viewData, function(err, user) {
                    if (err) {
                        res.send(new Response({}, 0, 'getMessage', err));
                        return;
                    }
                    res.send(new Response({
                        username: user.username,
                        fromUserId: message.fromUserId,
                        message: message.message,
                        country: message.country,
                        date: formatedDate[0],
                        time: formatedDate[1]
                    }, 1, 'getMessage'));
                });
            });
        });             
    }
};