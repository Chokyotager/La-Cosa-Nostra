// Routines
// Runs every cycle

// Function should be synchronous

var auxils = require("../../../systems/auxils.js");

module.exports = function (player) {

  var game = player.game;
  var config = game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  // TODO: tell Alien who has not been probed yet and is still alive
  var probed = player.misc.alien_kidnappings;

  var unprobed = game.findAll(x => x.isAlive() && !probed.includes(x.identifier) && x.identifier !== player.identifier);

  unprobed = unprobed.map((x, index) => (index + 1) + ". " + x.getDisplayName());

  game.sendPeriodPin(channel, ":alien: You may choose to probe a player tonight.\n\nUse `" + config["command-prefix"] + "probe <alphabet/name/nobody>` to select your target.\n\nThe following players have yet to be probed:\n```fix\n" + unprobed.join("\n") + "```");

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
