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

  var rolled = auxils.choice(player.misc.joat_usable);

  player.misc.joat_rolled = rolled.command;

  if (player.misc.joat_actions_left > 0) {
    player.game.sendPeriodPin(channel, ":four_leaf_clover: Your rolled night action tonight is `" + rolled.command + "`.\n\nYou need to successfully execute __" + player.misc.joat_actions_left + "__ more action" + auxils.vocab("s", player.misc.joat_actions_left) + " to win this game.\n\n**Command:** `" + config["command-prefix"] + rolled.command + " <alphabet/name/nobody>`\n**Description:** " + rolled.description + "\n**Condition:** " + rolled.condition);
  } else {
    player.game.sendPeriodPin(channel, ":four_leaf_clover: Your rolled night action tonight is `" + rolled.command + "`.\n\nYou have already won this game.\n\n**Command:** `" + config["command-prefix"] + rolled.command + " <alphabet/name/nobody>`\n**Description:** " + rolled.description + "\n**Condition:** " + rolled.condition);
  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
