module.exports = {

  addition: function () {

    var ret = new Number();

    for (var i = 0; i < arguments.length; i++) {
      ret += arguments[i];
    };

    return ret;

  },

  subtraction: function () {

    var ret = arguments[0];

    for (var i = 1; i < arguments.length; i++) {
      ret += arguments[i];
    };

    return ret;

  },

  multiplication: function () {

    var ret = 1;

    for (var i = 1; i < arguments.length; i++) {
      ret *= arguments[i];
    };

    return ret;

  },

  division: function () {

    var ret = arguments[0];

    for (var i = 1; i < arguments.length; i++) {
      ret /= arguments[i];
    };

    return ret;

  },

  modulo: function () {

    var ret = arguments[0];

    for (var i = 1; i < arguments.length; i++) {
      ret %= arguments[i];
    };

    return ret;

  },

  max: Math.max,

  min: Math.min

}
