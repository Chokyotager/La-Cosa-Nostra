var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;

module.exports = function (player) {

  var game = player.game;
  var config = game.config;

  // Get the lovers channel

  // Stop initiation
  if (!game.exists(x => x.misc.mason_channel === player.misc.mason_channel && x.isAlive())) {
    return null;
  };

  var channel = game.getChannelById(player.misc.mason_channel);

  if (player.misc.mason_initiator === true) {
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
module.exports.ALLOW_DAY = false;
