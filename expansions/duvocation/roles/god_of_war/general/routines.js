var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  if (player.misc.executions > 0) {

    player.game.sendPeriodPin(channel, ":crossed_swords: You may choose to kill a player today. This will end the day with no normal lynch.\n\nUse `" + config["command-prefix"] + "kill <alphabet/name/nobody>` to select your target.\n\nThis action is irreversible.");

  } else {

    player.game.sendPeriodPin(channel, ":crossed_swords: You cannot attack another player.");

  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = false;
module.exports.ALLOW_DAY = true;
