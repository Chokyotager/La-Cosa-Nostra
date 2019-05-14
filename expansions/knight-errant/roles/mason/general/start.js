var lcn = require("../../../../../source/lcn.js");

// Executes BEFORE introduction

var auxils = lcn.auxils;

module.exports = function (player) {

  var game = player.game;
  var config = game.config;

  if (player.misc.paired) {
    return null;
  };

  // Form as many pairs as possible before forming triplets
  var available = game.findAll(x => x.role_identifier === "mason" && x.isAlive() && x.identifier !== player.identifier && !x.misc.paired);

  available = lcn.auxils.cryptographicShuffle(available);

  if (available.length < 1) {
    throw new Error("Unpairable number of masons!");
  };

  player.misc.mason_initiator = true;

  if (available.length === 2) {

    var group = [player].concat(available.splice(0, 2))

  } else {

    var group = [player].concat(available.splice(0, 1));

  };

  for (var i = 0; i < group.length; i++) {
    group[i].misc.paired = true;
  };

  createMasonChannels(group);

  // Always put lower alphabet first
  async function createMasonChannels (players) {

    var read_perms = config["base-perms"]["read"];

    players.sort((a, b) => {
      if (a.alphabet < b.alphabet) { return -1; }
      if (a.alphabet > b.alphabet) { return 1; }
      return 0;
    });

    var name = "masons-" + players.map(x => x.alphabet).join("-");

    var perms = players.map(x => {return {target: x.getDiscordUser(), permissions: read_perms}});

    var channel = await game.createPrivateChannel(name, perms);

    for (var i = 0; i < players.length; i++) {
      // Add channels
      players[i].misc.mason_channel = channel.id;

      players[i].addSpecialChannel(channel);

    };

    await channel.send("**This is the Masons' chat.**\n\nThis chat is open to involved parties only at night.");

    game.setChannel(name, channel);

  };

};
