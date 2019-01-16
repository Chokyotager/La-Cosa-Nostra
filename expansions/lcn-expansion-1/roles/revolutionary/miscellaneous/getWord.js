var lcn = require("../../../../../source/lcn.js");

var fs = require("fs");

var auxils = lcn.auxils;

var words = fs.readFileSync(__dirname + "/words.txt", "utf8").split("\n");

words.pop();

module.exports = function (game) {

  var word = auxils.choice(words);

  return word;

};
