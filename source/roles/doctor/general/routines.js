// Routines
// Runs every cycle

// Function should be synchronous

var auxils = require("../../../systems/auxils.js");

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  player.game.sendPeriodPin(channel, ":pill: You may choose to heal a player tonight.\n\nYou have __" + player.misc.doc_self_heals + "__ self-heal" + auxils.vocab("s", player.misc.doc_self_heals) + " left.\n\nUse `" + config["command-prefix"] + "heal <alphabet/name/nobody>` to select your target.");

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
