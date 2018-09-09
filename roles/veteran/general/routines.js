// Routines
// Runs every cycle

// Function should be synchronous

var auxils = require("../../../systems/auxils.js");

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  if (player.misc.veteran_alerts_left > 0) {
    player.game.sendPeriodPin(channel, ":triangular_flag_on_post: You may choose to go on alert tonight.\n\nYou have __" + player.misc.veteran_alerts_left + "__ alert" + auxils.vocab("s", player.misc.veteran_alerts_left) + " left.\n\nUse `" + config["command-prefix"] + "alert` to go on alert and `" + config["command-prefix"] + "deselect` to choose not to go on alert.")
  } else {
    player.game.sendPeriodPin(channel, ":triangular_flag_on_post: You have used up all your alerts.");
  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
