// Routines
// Runs every cycle

// Function should be synchronous

var auxils = require("../../../systems/auxils.js");

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  player.game.addAction("social_engineer/no_action", ["cycle"], {
    name: "SE-no_action",
    expiry: 1,
    from: player,
    to: player
  });

  player.game.sendPeriodPin(channel, ":ballot_box: You may choose to double a player's vote strength or null it for tomorrow.\n\nUse `" + config["command-prefix"] + "influence <alphabet/name/nobody>` to double the vote strength of your selected target.\n\nUse `" + config["command-prefix"] + "block <alphabet/name/nobody>` to null the vote of your selected target.\n\nYou may only do either action.");

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
