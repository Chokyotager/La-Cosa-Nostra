var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  player.misc.mortician_protection_online = false;

  player.game.sendPeriodPin(channel, ":flag_white: You may choose to visit a player tonight.\n\nYou currently have __" + player.misc.mortician_protections + "__ protection" + auxils.vocab("s", player.misc.mortician_protections) + " from attacks.\n\nUse `" + config["command-prefix"] + "visit <alphabet/name/nobody>` to select your target.");

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
