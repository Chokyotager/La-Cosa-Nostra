var lcn = require("../../../../../source/lcn.js");

// Executes BEFORE introduction

var auxils = lcn.auxils;

module.exports = function (player) {

  var game = player.game;
  var config = game.config;

  // Set chat initiator
  player.misc.cult_member = null;
  player.misc.cult_all_members = [player.identifier];

  createCultChannels();

  game.addAction("a/power_indoctrinate/mediator", ["postcycle"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  game.addAction("a/power_indoctrinate/mentor_death", ["killed"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  game.addAction("a/power_indoctrinate/lock_cult_chat_on_death", ["killed"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  // Always put lower alphabet first
  async function createCultChannels () {

    var read_perms = config["base-perms"]["read"];

    var name = "cult";

    var channel = await game.createPrivateChannel(name, [
      {target: player.getDiscordUser(), permissions: read_perms}
    ]);

    player.misc.cult_channel = channel.id;

    await game.sendPeriodPin(channel, "**This is the Cult Chat.**\n\nOnly one mentee can be recruited at any time. Members are to survive to see the Cult reach parity and eliminate all threats to itself to win. This chat is only open at night.");

    game.setChannel(name, channel);

  };

};

module.exports.DO_NOT_RUN_ON_GAME_START = false;
module.exports.DO_NOT_RUN_ON_ADDITION = false;
