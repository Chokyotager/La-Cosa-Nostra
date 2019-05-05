// Routines
// Runs every cycle

// Function should be synchronous

var auxils = require("../../../systems/auxils.js");

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  if (player.misc.escorts_left > 0) {

    player.game.sendPeriodPin(channel, ":wine_glass: You may choose to roleblock a player tonight.\n\nUse `" + config["command-prefix"] + "roleblock <alphabet/name/nobody>` to select your target.");

  } else {

    player.game.sendPeriodPin(channel, ":wine_glass: You have used up all your roleblocks.");

  }

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
