// Routines
// Runs every cycle

// Function should be synchronous

var auxils = require("../../../systems/auxils.js");

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  player.game.sendPeriodPin(channel, ":mailbox_with_mail: You may choose to send a player an anonymous message tonight.\n\nUse `" + config["command-prefix"] + "mail <alphabet/name/nobody> <message>` to select your target.");

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
