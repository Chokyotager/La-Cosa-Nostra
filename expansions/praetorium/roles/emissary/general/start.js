var lcn = require("../../../../../source/lcn.js");

// Executes BEFORE introduction

var auxils = lcn.auxils;

module.exports = function (player) {

  var game = player.game;
  var config = game.config;

  // Set chat initiator
  player.misc.emissary_lead = true;
  player.misc.emissary_players = [player.identifier];

  createEmissaryChannels();

  game.addAction("emissary/mediator", ["postcycle"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  // Always put lower alphabet first
  async function createEmissaryChannels () {

    var read_perms = config["base-perms"]["read"];

    var name = "emissary-" + player.alphabet;

    var channel = await game.createPrivateChannel(name, [
      {target: player.getDiscordUser(), permissions: read_perms}
    ]);

    player.misc.emissary_channel = channel.id;

    await game.sendPeriodPin(channel, "**This is the Emissary Chat.**\n\nMembers of the Praetorium may be recruited, and the chat is only open at night.");

    game.setChannel(name, channel);

  };

};

module.exports.DO_NOT_RUN_ON_GAME_START = false;
module.exports.DO_NOT_RUN_ON_ADDITION = false;
