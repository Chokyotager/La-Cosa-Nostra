var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  if (player.game.getPeriod() % 4 === 3) {
    player.game.sendPeriodPin(channel, ":mag: You may choose to watch a player tonight instead of using the factional kill.\n\nUse `" + config["command-prefix"] + "watch <alphabet/name/nobody>` to select your target.");
  } else {
    player.game.sendPeriodPin(channel, ":mag: You may not watch a player tonight.");
  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
