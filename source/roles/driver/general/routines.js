// Routines
// Runs every cycle

// Function should be synchronous

var auxils = require("../../../systems/auxils.js");

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  if (player.misc.driver_drives_left > 0) {
    player.game.sendPeriodPin(channel, ":bus: You may choose to redirect actions performed on your first target onto your second target tonight.\n\nYou have __" + player.misc.driver_drives_left + "__ drive action" + auxils.vocab("s", player.misc.driver_drives_left) + " left.\n\nUse `" + config["command-prefix"] + "drive <alphabet/name/nobody> <alphabet/name/nobody>` to select your targets respectively.");
  } else {
    player.game.sendPeriodPin(channel, ":bus: You have no more drive actions left!");
  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
