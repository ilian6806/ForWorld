if (!Object.defineProperty) {
    Object.defineProperty = function (obj, key, props) {
        obj[key] = props.value;
    };
}

Object.defineProperty(global, 'CONSTANTS', {
    value: {},
    writable: false,
    enumerable: true,
    configurable: false
});

Object.defineProperty(global, 'CONST', {
    value: function(key) {
        if (!CONSTANTS[key]) {
            throw new Error('Constant "' + key + '" do not exist.');
        }
        return CONSTANTS[key];
    },
    writable: false,
    enumerable: true,
    configurable: false
});

Object.defineProperty(global, 'define', {
    value: function(key, value) {
        Object.defineProperty(CONSTANTS, key, {
            value: value,
            writable: false,
            enumerable: false,
            configurable: false,
        });
    },
    writable: false,
    enumerable: true,
    configurable: false
});

Object.defineProperty(global, 'Response', {
    value: function(data, success, action, err) {
        this.data = data || {};
        this.data.success = success,
        this.action = action || '';
        if (!success) {
            log('Response error at "' + action +'":');
            log(err);
        }
    },
    writable: false,
    enumerable: true,
    configurable: false
});

Object.defineProperty(global, 'parse', {
    value: function(data) {
        if ((typeof data).toLowerCase() == 'string') {
            return JSON.parse(data);
        } else {
            return data;
        }
    },
    writable: false,
    enumerable: true,
    configurable: false
});

Object.defineProperty(global, 'formatDate', {
    value: function(dateStr) {
        return dateStr.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    },
    writable: false,
    enumerable: true,
    configurable: false
});

Object.defineProperty(global, 'inProduction', {
    value: function() {
        return !!(process.env.NODE_ENV);
    },
    writable: false,
    enumerable: true,
    configurable: false
});
