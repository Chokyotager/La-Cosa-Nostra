var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  if (player.misc.janitor_cleans_left > 0) {

    player.game.sendPeriodPin(channel, ":paperclip: You may clean a player tonight.\n\nUse `" + config["command-prefix"] + "clean <alphabet/name/nobody>` to select your target.");

  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
