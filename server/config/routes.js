var controllers = require('../controllers');

var version = '/version' + CONST('VERSION');

module.exports = function(app) {

    if(!inProduction()) {
        //for test post requests
        app.use(function (req, res, next) {
            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', null);
            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            // Set to true if you need the website to include cookies in the requests sent
            // to the API (e.g. in case you use sessions)
            res.setHeader('Access-Control-Allow-Credentials', true);
            // Pass to next layer of middleware
            next();
        });
    }

    app.post('*', function(req, res, next) {
        log('POST: "' + req.url.replace(version + '/', '') + '"');
        next();
    });
    app.get('*', function(req, res, next) {
        if (req.url.replace(version + '/', '') != '/favicon.ico') {
            log('GET: "' + req.url.replace(version + '/', '') + '"');
        }
        next();
    });

    app.post(version + '/login/', controllers.users.login);
    app.post(version + '/register', controllers.users.register);
    app.post(version + '/getUserInfo', controllers.users.getUserInfo);
    app.post(version + '/checkForUser', controllers.users.checkForUser);
    app.post(version + '/updateUser', controllers.users.updateUser);
    app.get(version + '/getAllUsers', controllers.users.getAll);

    app.post(version + '/sendMessage', controllers.messages.sendMessage);
    app.post(version + '/getMessage', controllers.messages.getMessage);
    app.get(version + '/getAllMessages', controllers.messages.getAll);

    app.get('*', function(req, res){
        res.end();
    });
}