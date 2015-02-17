var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    fromUserId: { type: String, require: '{PATH is required}' },
    message: { type: String, require: '{PATH is required}' },
    country: { type: String, require: '{PATH is required}' },
    date: { type: Date, require: '{PATH is required}' }
});

var Message = mongoose.model('Message', messageSchema);

// collection hook to delete oldest record
messageSchema.post('save', function (doc) {
   Message.count({}, function(err, count){
        if (count > CONST('MAX_MESSAGES_COUNT')) {
            Message.findOne({}, {}, { sort: { 'date' : 1 } }, function(err, last) {
                if (err) {
                    logError(err);
                    return;
                }
                log(last);
                last.remove();
            });
        } 
    });
});

module.exports.seedInitialMessages = function() {

    var reset = 0;

    function seed() {
        Message.find({}).exec(function(err, collection) {
            if (err) {
                log('Cannot find messages: ' + err);
                return;
            }

            var msgs = ["Find a place inside where there's joy, and the joy will burn out the pain.",
                        "Keep your face to the sunshine and you cannot see a shadow.",
                        "I always like to look on the optimistic side of life, but I am realistic enough to know that life is a complex matter.",
                        "Positive thinking will let you do everything better than negative thinking will.",
                        "In order to carry a positive action we must develop here a positive vision.",
                        "Try to be a rainbow in someone's cloud.",
                        "Change your thoughts and you change your world.",
                        "Always do your best. What you plant now, you will harvest later.",
                        "Keep your eyes on the stars, and your feet on the ground.",
                        "The starting point of all achievement is desire.",
                        "I've failed over and over and over again in my life and that is why I succeed.",
                        "Happiness lies in the joy of achievement and the thrill of creative effort.",
                        "Formal education will make you a living; self-education will make you a fortune.",
                        "Success consists of going from failure to failure without loss of enthusiasm.",
                        "Formula for success: rise early, work hard, strike oil.",
                        "Love isn't something you find. Love is something that finds you.",
                        "The first duty of love is to listen.",
                        "Innovation distinguishes between a leader and a follower.",
                        "High expectations are the key to everything.",
                        "Getting in touch with your true self must be your first priority."];

            if (collection.length === 0) {
                // Add messages with small delay
                for (var i = 0; i < msgs.length; i++) {
                    (function(idx) {
                        setTimeout(function() {
                            var msg = msgs[idx];
                            Message.create({
                                fromUserId: '12314512',
                                message: msg,
                                country: 'Bulgaria',
                                date: new Date()
                            });
                        }, idx * 100);
                    }(i));
                }
                log('Messages added');
            }
        });
    }

    if (reset) {
        Message.remove({}).exec(function() {
            log('Messages deleted'); 
            seed();
        });
    } else {
        seed();
    }
};