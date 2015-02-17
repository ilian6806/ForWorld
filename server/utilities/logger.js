var mongoose = require('mongoose');

var errorSchema = mongoose.Schema({
    message: { type: String, require: '{PATH is required}' },
    file: { type: String, require: '{PATH is required}' },
    date: { type: Date, require: '{PATH is required}' }
},{
    capped: { max: 2000, size: 1000000 }
});

var Error = mongoose.model('Error', errorSchema);

logError = function (err) {
    try {
        var errorStack = err.stack.split('at')[1].split('\\').reverse();
        Error.create({
            message: err.stack.split('at')[0],
            file: errorStack[1] + '/'+ errorStack[0],
            date: formatDate(new Date())
        });
        console.log('Error logged: ' + err.stack.split('at')[0] + ' at ' + errorStack[1] + '/'+ errorStack[0]);
    } catch (err) {
        console.log('Error failed to log: ' + err);
    }
};

log = function (message, separator, title) {
    if (!inProduction()) {

        var log = '';

        if (separator) console.log(separator);

        try {
            if (message instanceof Array) {
                log = JSON.stringify(message);
            } else if (message instanceof Object) {
                log = JSON.stringify(message, null, 4);
            } else {
                log = message;
            }
        } catch (e) {
            console.log(e);
            console.log(message);
        }

        if (title) {
            console.log(title.toUpperCase() + ': ' + log);
        } else {
            console.log(log);
        }

        if (separator) console.log(separator);
    }
};