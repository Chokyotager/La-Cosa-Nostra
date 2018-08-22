var cryptoRandom = require("./cryptoRandom.js");

module.exports = function (x) {
  // Using cryptographic Fisher-Yates shuffling
  // Copied from CAH :P

  // Array is duplicated
  ret = Array.from(x);

  for (var i = 0; i < ret.length; i++) {
    var jumble = Math.floor(cryptoRandom() * i);
    var cache = ret[i];
    ret[i] = ret[jumble];
    ret[jumble] = cache;
  };

  return ret;
};
