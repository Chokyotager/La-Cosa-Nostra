var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  player.game.sendPeriodPin(channel, ":envelope_with_arrow: You may impart with a member of the Praetorium tonight to engage in secret communication.\n\nUse `" + config["command-prefix"] + "impart <alphabet/name/nobody>` to select your target.\nThis action is irreversible and will fail if the target selected is not a recruited member of the Praetorium.");

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = false;
module.exports.ALLOW_DAY = true;
