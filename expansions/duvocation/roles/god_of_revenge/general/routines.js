var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  if (player.misc.revenge_attack_preparations > 0) {
    player.game.sendPeriodPin(channel, ":boom: You may choose to prepare for an attack tonight.\n\nYou can prepare __" + player.misc.revenge_attack_preparations + "__ more time" + auxils.vocab("s", player.misc.revenge_attack_preparations) + ".\n\nUse `" + config["command-prefix"] + "prepare` to prepare for an attack and `" + config["command-prefix"] + "deselect` to relax and not be on alert.")
  } else {
    player.game.sendPeriodPin(channel, ":no_entry_sign: You have are too tired and cannot meditate and prepare.");
  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
