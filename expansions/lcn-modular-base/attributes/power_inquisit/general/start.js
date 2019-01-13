var lcn = require("../../../../../source/lcn.js");

// Executes BEFORE introduction

var auxils = lcn.auxils;

module.exports = function (player) {

  var game = player.game;
  var config = game.config;

  // Set chat initiator
  player.misc.neighbour_lead = true;
  player.misc.neighbour_players = [player.identifier];

  createNeighbourChannels();

  game.addAction("a/power_inquisit/mediator", ["postcycle"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  game.addAction("a/power_inquisit/lock_neighbour_chat_on_death", ["killed"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  // Always put lower alphabet first
  async function createNeighbourChannels () {

    var read_perms = config["base-perms"]["read"];

    var name = "neighbourhood-" + player.alphabet;

    var channel = await game.createPrivateChannel(name, [
      {target: player.getDiscordUser(), permissions: read_perms}
    ]);

    player.misc.neighbour_channel = channel.id;

    await game.sendPeriodPin(channel, "**This is a Neighbourhood Chat.**\n\nNew members may be recruited, and the chat is only open at night.");

    game.setChannel(name, channel);

  };

};
