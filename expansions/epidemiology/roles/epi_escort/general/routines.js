var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  var available = player.game.findAll(x => x.isAlive() && !player.misc.visit_log.includes(x.identifier) && x.identifier !== player.identifier);

  available = available.map((x, index) => (index + 1) + ". " + x.getDisplayName());

  player.game.sendPeriodPin(channel, ":wine_glass: You may choose to roleblock a player tonight.\n\nUse `" + config["command-prefix"] + "roleblock <alphabet/name/nobody>` to select your target.\n\nYou may roleblock the following players:\n```fix\n" + available.join("\n") + "```\nIf you do not choose a target, one will be selected at random.");

  player.game.addAction("epi_escort/random_roleblock", ["cycle"], {
    name: "Escort-random-roleblock",
    expiry: 1,
    from: player,
    to: player,
    priority: -1
  });

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
