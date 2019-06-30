var lcn = require("../../../../../source/lcn.js");

// Executes BEFORE introduction

var auxils = lcn.auxils;

module.exports = function (player) {

  var game = player.game;
  var config = game.config;

  player.misc.neighbourises_left = 2;

  // Set chat initiator
  player.misc.neighbour_lead = true;
  player.misc.neighbour_players = [player.identifier];

  createNeighbourChannels();

  game.addAction("neighbouriser/mediator", ["postcycle"], {
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

module.exports.DO_NOT_RUN_ON_GAME_START = false;
module.exports.DO_NOT_RUN_ON_ADDITION = false;
