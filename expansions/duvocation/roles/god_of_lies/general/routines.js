var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  if (player.game.arbiter_god_alive) {

    player.misc.forgeries_left = 1;

  } else {

    player.misc.forgeries_left = 2;

  };

  // Nighttime actions
  var channel = player.getPrivateChannel();

  player.game.sendPeriodPin(channel, ":pencil: You may forge a player's vote on another individual __" + player.misc.forgeries_left + "__ time" + auxils.vocab("s", player.misc.forgeries_left) + " today.\n\nUse `" + config["command-prefix"] + "forge <alphabet/name/nobody> <alphabet/name/nobody>` to select your target, and `" + config["command-prefix"] + "forge retract` to retract all forged votes.");

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = false;
module.exports.ALLOW_DAY = true;
