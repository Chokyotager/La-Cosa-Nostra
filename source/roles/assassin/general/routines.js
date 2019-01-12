// Routines
// Runs every cycle

// Function should be synchronous

var auxils = require("../../../systems/auxils.js");

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  if (player.misc.assassin_picked_target === false) {
    player.game.sendPeriodPin(channel, ":dagger: You may choose a victim tonight.\n\nUse `" + config["command-prefix"] + "pick <alphabet/name/nobody>` to select your target.");
  } else {
    var target = player.game.getPlayerByIdentifier(player.misc.assassin_target);
    player.game.sendPeriodPin(channel, ":dagger: Your current target is **" + target.getDisplayName() + "**.");
  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
