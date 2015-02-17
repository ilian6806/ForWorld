var mongoose = require('mongoose');
var User = mongoose.model('User');
var Message = mongoose.model('Message');

var viewsSchema = mongoose.Schema({
    authorId: { type: String, require: '{PATH is required}' },
    viewerId: { type: String, require: '{PATH is required}' },
    messageId: { type: String, require: '{PATH is required}' },
    date: { type: Date, require: '{PATH is required}' }
});

function fetchViewsData(views, messagesArr, usersArr, callback) {

    // fetch db with prepared data, modify 'views' array and call callback with it
    Message.find({}).where('_id').in(messagesArr).exec(function(err, messages) {
        if (err || !messages || !messages.length) {
            callback({});
            return;
        }
        User.find({}).where('userId').in(usersArr).exec(function(err, users) {
             if (err || !users || !users.length) {
                callback({});
                return;
            }
            each(views, function() {
                // set message
                var id = this.message.toString();
                this.message = getItemFromCollection(messages, '_id', id).message;
                // set users array
                each(this.users, function() {
                    var userId = this.userId.toString();
                    var user = getItemFromCollection(users, 'userId', userId);
                    this.username = user.username;
                    this.userCountry = user.country;
                    delete this.userId;
                });
            });
            callback(views);
        });
    });
}

viewsSchema.statics.getViewsPerMessage = function(views, callback) {

    if (!views || !views.length) {
        callback(views);
        return;
    }

    // unique message and user id's - used to fetch data later
    var messages = [];
    var users = [];

    each(views, function() {
        if (messages.indexOf(this.messageId) < 0) {
            messages.push(this.messageId);
        }
        if (users.indexOf(this.viewerId) < 0) {
            users.push(this.viewerId);
        }
    });

    var messagesViews = []; // modified views array
    each(messages, function() {
        var that = this;
        var messageView = {
            message: this,
            users: []
        };
        views.filter(function(el) {
            if (el.messageId == that) {
                messageView.users.push({
                    userId: el.viewerId,
                    date: el.date
                });
            }
        });
        messagesViews.push(messageView);
    });

    fetchViewsData(messagesViews, messages, users, callback);
};

module.exports = mongoose.model('View', viewsSchema);