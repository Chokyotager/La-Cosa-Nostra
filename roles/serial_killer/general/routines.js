// Routines
// Runs every cycle

// Function should be synchronous

var auxils = require("../../../systems/auxils.js");

module.exports = function (player) {

  var game = player.game;

  var period = game.period;

  // Is daytime
  if (period % 2 === 0) {
    return null;
  };

  if (!player.status.alive) {
    return null;
  };

  var config = game.config;
  var client = game.client;

  var guild = client.guilds.get(config["server-id"]);

  // Nighttime actions
  var channel = guild.channels.get(player.channel.id);

  channel.send(":knife: You may attack a player tonight.\n\nUse `" + config["command-prefix"] + "attack <alphabet/name>` to select your target.");

};
