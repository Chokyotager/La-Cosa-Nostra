var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  player.game.sendPeriodPin(channel, ":fire: You may choose to douse a player tonight.\n\nUse `" + config["command-prefix"] + "douse <alphabet/name/nobody>` to select your target.\nAlternatively, you may choose to ignite with `" + config["command-prefix"] + "ignite`");

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
