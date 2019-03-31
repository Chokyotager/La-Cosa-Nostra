var lcn = require("../../../../../source/lcn.js");

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  player.setGameStat("basic-defense", 2, Math.max);

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = true;
