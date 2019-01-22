var factorial = require("./factorial.js");

module.exports = function (n, r) {

  // n choose r
  return factorial(n)/factorial(n - r);

};
