// Routines
// Runs every cycle

// Function should be synchronous

var auxils = require("../../../systems/auxils.js");

module.exports = function (player) {

  var game = player.game;
  var config = game.config;

  // Get the lovers channel

  var channel = game.getChannelById(player.misc.lover_channel);

  if (player.misc.lover_initiator === true) {
    channel.send("~~                                              ~~    **" + game.getFormattedDay() + "**");
  };

  var member = player.getGuildMember();

  if (!member) {
    return null;
  };

  if (game.isDay()) {
    // Day time
    channel.overwritePermissions(member, config["base-perms"]["read"]);

  } else {
    // Night time
    channel.overwritePermissions(member, config["base-perms"]["post"]);

  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = true;
