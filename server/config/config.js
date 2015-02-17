var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {

    development: {
        rootPath: rootPath,
        db: 'mongodb://localhost/ForWorld',
        port: process.env.PORT || 9000
    },

    production: {
        rootPath: rootPath,
        db: 'mongodb://ilian6806:ilian6806forworld@ds039351.mongolab.com:39351/forworld',
        port: process.env.PORT || 9000
    }
}