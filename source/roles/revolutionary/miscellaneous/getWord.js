var fs = require("fs");

var auxils = require("../../../systems/auxils.js");

var words = fs.readFileSync(__dirname + "/words.txt", "utf8").split("\n");

words.pop();

module.exports = function (game) {

  var word = auxils.choice(words);

  return word;

};
