var jaroWinklerDistance = require("./jaroWinklerDistance.js");

module.exports = function (a, b) {

  a = a.toLowerCase();
  b = b.toLowerCase();

  // Split Jaro-Winkler
  var a_split = a.split(" ");
  var b_split = b.split(" ");

  var ret = 0;

  for (var i = 0; i < a_split.length; i++) {

    for (var j = 0; j < b_split.length; j++) {

      var distance = jaroWinklerDistance(a_split[i], b_split[j]);
      ret = Math.max(ret, distance);

    };

  };

  return ret;

};
