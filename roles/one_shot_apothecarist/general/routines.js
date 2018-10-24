// Routines
// Runs every cycle

// Function should be synchronous

var auxils = require("../../../systems/auxils.js");

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  if (player.misc.apothecarist_poisons_left > 0) {

    player.game.sendPeriodPin(channel, ":herb: You may choose to poison a player tonight.\n\nYou have __" + player.misc.apothecarist_poisons_left + "__ poison" + auxils.vocab("s", player.misc.apothecarist_poisons_left) + " left.\n\nUse `" + config["command-prefix"] + "poison <alphabet/name/nobody>` to select your target.");

  } else {

    player.game.sendPeriodPin(channel, ":herb: You have run out of poisons.");

  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
