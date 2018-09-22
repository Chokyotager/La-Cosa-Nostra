// Routines
// Runs every cycle

// Function should be synchronous

var auxils = require("../../../systems/auxils.js");

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  if (player.misc.janitor_cleans_left > 0) {

    player.game.sendPeriodPin(channel, ":file_cabinet: You may choose to clean a player tonight.\n\nYou currently have __" + player.misc.janitor_cleans_left + "__ clean" + auxils.vocab("s", player.misc.janitor_cleans_left) + " left.\n\nUse `" + config["command-prefix"] + "clean <alphabet/name/nobody>` to select your target.");

  } else {

    player.game.sendPeriodPin(channel, ":file_cabinet: You have used up all your cleans.")

  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
