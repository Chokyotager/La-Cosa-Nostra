var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  if (player.misc.matches_left > 0) {
    player.game.sendPeriodPin(channel, ":two_hearts: You may match two players tonight.\n\nUse `" + config["command-prefix"] + "match <alphabet/name/nobody> <alphabet/name>` to select your targets.\n\nShould one of your targets die in subsequent nights, their matched lover will die too. The match is not counted as used if either of your targets die tonight.");
  } else {
    player.game.sendPeriodPin(channel, ":heart: You may no longer match two other players.");
  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
