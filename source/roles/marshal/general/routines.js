// Routines
// Runs every cycle

// Function should be synchronous

var auxils = require("../../../systems/auxils.js");

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  if (player.misc.marshal_uses > 0) {

    player.game.sendPeriodPin(channel, ":octagonal_sign: You may choose to marshal the vote tonight.\n\nYou may marshal __" + player.misc.marshal_uses + "__ trial" + auxils.vocab("s", player.misc.marshal_uses) + ".\n\nUse `" + config["command-prefix"] + "marshal` to triple the number of lynches the next day.\n\nUse `" + config["command-prefix"] + "deselect` to skip your night action.");

  } else {

    player.game.sendPeriodPin(channel, ":octagonal_sign: You have used up all of your trial vote marshal actions.");

  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
