// Routines
// Runs every cycle

// Function should be synchronous

var lcn = require("../../../../../source/lcn.js");

var auxils = lcn.auxils;

var rs = lcn.rolesystem;

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  if (player.misc.abstain == true) {
    player.misc.abstain = false;
    player.misc.failure_chance += 1;
  }

  if (player.misc.failure_chance < 10) {
    //rs.misc.beasts(true) + 
    player.game.sendPeriodPin(channel, rs.misc.beasts(true) + " You may choose to kill a player tonight. There is a __" + player.misc.failure_chance + "0%__ chance of failure.\n\nUse `" + config["command-prefix"] + "kill <alphabet/name/nobody>` to select your target.");
    player.misc.abstain = true;

  } else {

    player.game.sendPeriodPin(channel, rs.misc.beasts(true) + " Your beasts have left you to go hunt on their own.")

  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
