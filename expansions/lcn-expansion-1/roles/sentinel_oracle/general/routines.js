var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  var target = player.game.getPlayerByIdentifier(player.misc.oracle_last_target);

  if (target && target.isAlive()) {

    player.game.sendPeriodPin(channel, ":eye_in_speech_bubble: Your current target is **" + target.getDisplayName() + "**. You may choose a new target only should they die.");

  } else {

    player.misc.oracle_last_target = null;

    player.game.sendPeriodPin(channel, ":eye_in_speech_bubble: You may choose a player tonight.\n\nUse `" + config["command-prefix"] + "choose <alphabet/name/nobody>` to select your target.\n\nYou may not reselect a target until they are dead.");

  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
