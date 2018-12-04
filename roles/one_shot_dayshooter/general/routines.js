// Routines
// Runs every cycle

// Function should be synchronous

var auxils = require("../../../systems/auxils.js");

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  if (player.misc.dayshooter_bullets > 0) {

    player.game.sendPeriodPin(channel, ":gun: You may choose to shoot a player today.\n\nYou currently have __" + player.misc.dayshooter_bullets + "__ bullet" + auxils.vocab("s", player.misc.dayshooter_bullets) + ".\n\nUse `" + config["command-prefix"] + "shoot <alphabet/name/nobody>` to select your target.\n\nThis action is irreversible.");

  } else {

    player.game.sendPeriodPin(channel, ":gun: You do not have any bullets left.")

  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = false;
module.exports.ALLOW_DAY = true;
