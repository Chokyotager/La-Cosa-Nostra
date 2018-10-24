// Routines
// Runs every cycle

// Function should be synchronous

var auxils = require("../../../systems/auxils.js");

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  player.game.sendPeriodPin(channel, ":gun: You may choose to shoot one player today.\n\nUse `" + config["command-prefix"] + "shoot <alphabet/name/nobody>` to select your target.\n\nThis action is irreversible.\n\nShooting a target with their votes cast will lock their votes in place.\n\nThe gun will expire if unused today.");

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = false;
module.exports.ALLOW_DAY = true;
