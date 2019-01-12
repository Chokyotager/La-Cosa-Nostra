// Routines
// Runs every cycle

// Function should be synchronous

var auxils = require("../../../systems/auxils.js");

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  player.game.sendPeriodPin(channel, ":round_pushpin: You may choose a protégé and a target tonight.\n\nUse `" + config["command-prefix"] + "mark <alphabet/name/nobody> <alphabet/name>` to select your protégé and target respectively.");

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
