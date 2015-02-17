
each = function (arr, func) {
    for (var i = 0, l = arr.length; i < l; i++) {
        func.call(arr[i], i);
    }
};

getItemFromCollection = function (arr, prop, val) {
    for (var i = 0, l = arr.length; i < l; i++) {
        if (arr[i][prop] == val) { return arr[i]; }
    }
    return {};
};