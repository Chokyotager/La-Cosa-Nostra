// Routines
// Runs every cycle

// Function should be synchronous

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

  channel.send(":pill: You may choose to heal a player tonight.\n\nYou have __" + player.misc.doc_self_heals + "__ self-heals left.\n\nUse `!heal <alphabet/name>` to select your target.");

};
