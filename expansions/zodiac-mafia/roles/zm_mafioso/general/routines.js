var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  if (player.game.getPeriod() % 8 === 3) {

    player.game.sendPeriodPin(channel, ":gun: You may shoot a player tonight.\n\nUse `" + config["command-prefix"] + "shoot <alphabet/name/nobody>` to select your target.");

  } else {

    player.game.sendPeriodPin(channel, ":gun: You may not shoot a player tonight.");

  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
