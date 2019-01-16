var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  if (player.misc.strongman_kills_left > 0) {

    player.game.sendPeriodPin(channel, ":wilted_rose: You may choose to deal an Unstoppable attack to player tonight.\n\nYou currently have __" + player.misc.strongman_kills_left + "__ attack" + auxils.vocab("s", player.misc.strongman_kills_left) + ".\n\nUse `" + config["command-prefix"] + "attack <alphabet/name/nobody>` to select your target.");

  } else {

    player.game.sendPeriodPin(channel, ":wilted_rose: You may not attack any more people.")

  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
