// Routines
// Runs every cycle

// Function should be synchronous

var auxils = require("../../../systems/auxils.js");

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  if (player.misc.cupid_matches < 1) {
    player.game.sendPeriodPin(channel, ":heart: You do not have any matches left.");
  } else {
    player.game.sendPeriodPin(channel, ":heart: You may choose to match two players tonight.\n\nUse `" + config["command-prefix"] + "match <alphabet/name/nobody> <alphabet/name>` to select your targets.\n\nYou currently have " + player.misc.cupid_matches + " match" + auxils.vocab("es", player.misc.cupid_matches) + " left.");
  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
