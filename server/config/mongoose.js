var mongoose = require('mongoose');
var user = require('../models/User');
var message = require('../models/Message');
var view =  require('../models/View');

module.exports = function(config) {

    mongoose.connect(config.db);

    var db = mongoose.connection;

    db.once('open', function(err) {
        if (err) {
            console.log("DB cound not be open:" + err);
            return;
        }
        console.log("MongoDB up and running at " + config.port + "...");
    });
     
    db.on('error', function(err) {
        console.log('DB error: ' + err);
    });

    // user.seedInitialUsers();
    // message.seedInitialMessages();
};