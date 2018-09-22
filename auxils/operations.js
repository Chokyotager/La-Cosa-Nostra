module.exports = {

  addition: function () {

    var arr = Array.from(arguments);

    var ret = new Number();

    for (var i = 0; i < arguments.length; i++) {
      ret += arguments[i];
    };

    return ret;

  },

  subtraction: function () {

    var arr = Array.from(arguments);

    var ret = arr[0];

    for (var i = 1; i < arr.length; i++) {
      ret += arr[i];
    };

    return ret;

  },

  multiplication: function () {

    var arr = Array.from(arguments);

    var ret = 1;

    for (var i = 0; i < arr.length; i++) {
      ret *= arr[i];
    };

    return ret;

  },

  division: function () {

    var arr = Array.from(arguments);

    var ret = arr[0];

    for (var i = 1; i < arr.length; i++) {
      ret /= arr[i];
    };

    return ret;

  },

  modulo: function () {

    var arr = Array.from(arguments);

    var ret = arr[0];

    for (var i = 1; i < arr.length; i++) {
      ret %= arr[i];
    };

    return ret;

  },

  max: Math.max,

  min: Math.min

}
