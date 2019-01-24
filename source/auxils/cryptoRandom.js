var crypto = require("crypto");

module.exports = function (bytes=24, extend=6) {

  if (extend > bytes) {
    var err = new Error("Extend cannot be more than bytes!");
    throw err;
  };

  if (bytes % extend !== 0) {
    var err = new Error("The bytes should be integer-wise divisible by the extend to prevent bias!");
    throw err;
  };

  // Byte possibilities = 256 * extend

  var buffer = crypto.randomBytes(bytes);

  var numeral = new Number();

  for (var i = 0; i < buffer.length; i++) {
    numeral += buffer[i];
  };

  var limit = 256 / extend;

  return (numeral % limit) / limit;

};
