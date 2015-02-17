var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

module.exports = function(app, config) {
    app.use(cookieParser());
    app.use(bodyParser());
    app.use(session({ secret: 'js magic is magic'}));
};