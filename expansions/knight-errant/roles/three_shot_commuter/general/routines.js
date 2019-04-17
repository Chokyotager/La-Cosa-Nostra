var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  if (player.commutes_left < 1) {
    return null;
  };

  player.game.sendPeriodPin(channel, ":runner: You may commute **" + player.commutes_left + "** more time" + auxils.vocab("s", player.commutes_left) + ".\n\nUse `" + config["command-prefix"] + "commute` to choose to commute and `" + config["command-prefix"] + "deselect` to choose not to commute.");

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
