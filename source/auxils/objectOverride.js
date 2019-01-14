module.exports = function replace (j1, j2) {

  // Scan through j1, replace
  var ret = Object.assign(new Object(), j1);

  for (var key in j2) {

    var item = j2[key];

    // Addition
    if (!j1[key]) {
      ret[key] = item;
      continue;
    };

    // Substitution
    if (typeof item === "object" && !(Symbol.iterator in Object(item))) {

      ret[key] = replace(j1[key], item);
      continue;

    } else {

      ret[key] = item;

    };

  };

  return ret;

};
