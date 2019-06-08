var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;

module.exports = function (player) {

  var game = player.game;

  var config = game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  if (!game.arbiter_god_alive && game.arbiter_god_lynched !== (game.getStep() - 1)) {

    player.misc.charms_left++;
    player.getPrivateChannel().send(":four_leaf_clover: With the Arbiter God banished, you made __1__ charm. You now have __" + player.misc.charms_left + "__ charm" + auxils.vocab("s", player.misc.charms_left) + ".");

  };

   game.sendPeriodPin(channel, ":four_leaf_clover: You have __" + player.misc.charms_left + "__ charm" + auxils.vocab("s", player.misc.charms_left) + " and may choose to give out charms to players tonight.\n\nUse `" + config["command-prefix"] + "charm <alphabet/name/nobody> [<alphabet/name>...]` to select your target(s).");

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
