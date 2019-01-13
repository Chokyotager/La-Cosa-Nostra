var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  if (player.misc.vagrant_vest_uses > 0 && !player.misc.vagrant_vest_shot) {
    player.game.sendPeriodPin(channel, ":shield: You may choose to put on your bulletproof vest tonight.\n\nYou may do so __" + player.misc.vagrant_vest_uses + "__ more time" + auxils.vocab("s", player.misc.vagrant_vest_uses) + ".\n\nUse `" + config["command-prefix"] + "equip` to equip your vest and `" + config["command-prefix"] + "unequip` to choose not to put on your vest.")
  } else {
    player.game.sendPeriodPin(channel, ":shield: You vest is no longer usable.");
  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
