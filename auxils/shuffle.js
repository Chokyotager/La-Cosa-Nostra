module.exports = function (x) {
  // Using standard Fisher-Yates shuffling
  // Copied from CAH :P

  // Array is duplicated
  ret = Array.from(x);

  for (var i = 0; i < ret.length; i++) {
    var jumble = Math.floor(Math.random() * i);
    var cache = ret[i];
    ret[i] = ret[jumble];
    ret[jumble] = cache;
  };

  return ret;
};
