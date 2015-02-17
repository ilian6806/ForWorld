var express = require('express');

var env = process.env.NODE_ENV || 'development';

var app = express();
var config = require('./server/config/config')[env];

require('./server/utilities/logger');
require('./server/utilities/helpers');
require('./server/utilities/constants');

define('VERSION', '1.0');
define('MAX_MESSAGES_COUNT', 22);

require('./server/config/express')(app, config);
require('./server/config/mongoose')(config);
require('./server/config/routes')(app);

var server = app.listen(config.port);

process.on('uncaughtException', function (err) {
    logError(err);
    log("Node restarting...");
    server.close();
    server = app.listen(config.port);
    log("Server running on port " + config.port + "...");
});

log("Server running on port " + config.port + "...");