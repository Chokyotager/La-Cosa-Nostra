// Routines
// Runs every cycle

// Function should be synchronous

var auxils = require("../../../systems/auxils.js");

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  channel.send(":oil: You may choose to douse a player tonight.\n\nUse `" + config["command-prefix"] + "douse <alphabet/name>` to select your target.\n\nAlternatively, you may ignite with `" + config["command-prefix"] + "ignite`");

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
