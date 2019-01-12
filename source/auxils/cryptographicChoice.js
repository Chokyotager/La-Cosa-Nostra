var cryptoRandom = require("./cryptoRandom.js");

module.exports = function (array) {

  var indices = array.length;

  var index = Math.floor(cryptoRandom(indices*3, indices*1) * indices);
  return array[index];

};
