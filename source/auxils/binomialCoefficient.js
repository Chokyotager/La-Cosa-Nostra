var factorial = require("./factorial.js");
var permutations = require("./permutations.js");

module.exports = function (n, r) {

  // n choose r
  return permutations(n, r) * 1/(factorial(r));

};
