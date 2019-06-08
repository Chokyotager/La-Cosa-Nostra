var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  var is_day = player.game.isDay();

  if (is_day && player.misc.day_gifts < 1) {
    return null;
  };

  var addendum = is_day ? "today, in which your target will receive the juice at the end of the day" : "tonight";

  player.game.sendPeriodPin(channel, ":tropical_drink: You may deliver juice " + addendum + ".\n\nUse `" + config["command-prefix"] + "gift <alphabet/name/nobody>` to select your target.");

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = true;
