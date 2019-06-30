var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  if (player.misc.neighbourises_left > 0) {
    player.game.sendPeriodPin(channel, ":speech_balloon: You may recruit __" + player.misc.neighbourises_left + "__ more player" + auxils.vocab("s", player.misc.neighbourises_left)+ " into the neighbourhood chat.\n\nUse `" + config["command-prefix"] + "recruit <alphabet/name/nobody>` to select your target.");
  } else {
    player.game.sendPeriodPin(channel, ":speech_balloon: You may not recruit any more players.");
  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
