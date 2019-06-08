var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  player.game.sendPeriodPin(channel, ":dart: You may control a player tonight instead of using the factional kill.\n\nUse `" + config["command-prefix"] + "control <alphabet/name/nobody> <alphabet/name/nobody>` to redirect all actions used by your first target to your second target.");

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
