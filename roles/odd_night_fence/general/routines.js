// Routines
// Runs every cycle

// Function should be synchronous

var auxils = require("../../../systems/auxils.js");

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  if (player.game.getPeriod() % 4 === 1) {
    player.game.sendPeriodPin(channel, ":mailbox_closed: You may deliver a gun to a player tonight.\n\nUse `" + config["command-prefix"] + "deliver <alphabet/name/nobody>` to select your target.\n\nIf you do not choose a target, one will be chosen at random.");

    player.game.addAction("odd_night_fence/random_delivery", ["cycle"], {
      name: "Odd-night-Fence-random-delivery",
      expiry: 1,
      from: player.identifier,
      to: player.identifier,
      priority: -1
    });
  } else {

    player.game.sendPeriodPin(channel, ":mailbox_closed: There are no guns to be delivered today.");

  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
