var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  player.game.sendPeriodPin(channel, ":bomb: You may choose to tag an explosive on a player tonight.\n\nYou need __" + player.misc.reactionary_kills_left + "__ more kill" + auxils.vocab("s", player.misc.reactionary_kills_left) + " to win this game.\n\nUse `" + config["command-prefix"] + "tag <alphabet/name/nobody>` to select your target.");

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
