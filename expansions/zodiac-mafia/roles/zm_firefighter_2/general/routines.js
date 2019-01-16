var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  if (player.game.getPeriod() % 8 === 5) {

    player.game.sendPeriodPin(channel, ":fire_engine: You may choose to extinguish a player tonight.\n\nUse `" + config["command-prefix"] + "extinguish <alphabet/name/nobody>` to select your target.");

  } else {

    player.game.sendPeriodPin(channel, ":house_with_garden: You may visit a player tonight.\n\nUse `" + config["command-prefix"] + "visit <alphabet/name/nobody>` to select your target.\n\nIf you do not choose a target, one will be chosen at random.");

    player.game.addAction("zm_firefighter_2/random_visit", ["cycle"], {
      name: "zm_firefighter_2-random-visit",
      expiry: 1,
      from: player.identifier,
      to: player.identifier,
      priority: -1
    });
  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
