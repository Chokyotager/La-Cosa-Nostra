// Executes BEFORE introduction

var auxils = require("../../../systems/auxils.js");

module.exports = function (player) {

  // Find pair
  // If multiple available, shuffle

  var game = player.game;
  var config = game.config;

  // Check if already matched
  if (player.misc.lover_matched) {

    game.addAction("lover/suicide", ["killed"], {
      from: player,
      to: player.misc.lover_matched,
      expiry: Infinity,
      tags: ["permanent"]
    });

    var lover = game.getPlayerByIdentifier(player.misc.lover_matched);
    player.addIntroMessage(":heart: Your lover is **" + lover.getDisplayName() + "**.");
    return null;
  };

  var others = game.findAll(x => x.role_identifier === "lover" && x.isAlive() && x.identifier !== player.identifier && x.misc.lover_matched === undefined);

  // Downright throw an error if there is no match
  if (others.length < 1) {
    var err = new Error("There should be an even number of Lovers in the game!");
    throw err;
  };

  var matched = auxils.cryptographicChoice(others);

  // Set chat initiator
  player.misc.lover_initiator = true;

  // Cross the properties
  player.misc.lover_matched = matched.identifier;
  matched.misc.lover_matched = player.identifier;

  game.addAction("lover/suicide", ["killed"], {
    from: player,
    to: player.misc.lover_matched,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.addIntroMessage(":heart: Your lover is **" + matched.getDisplayName() + "**.");

  createLoverChannels();

  // Always put lower alphabet first
  async function createLoverChannels () {

    var read_perms = config["base-perms"]["read"];

    var name = "lovers-" + player.alphabet + "-" + matched.alphabet;

    var channel = await game.createPrivateChannel(name, [
      {target: player.getDiscordUser(), permissions: read_perms},
      {target: matched.getDiscordUser(), permissions: read_perms}
    ]);

    player.misc.lover_channel = channel.id;
    matched.misc.lover_channel = channel.id;

    player.addSpecialChannel(channel);
    matched.addSpecialChannel(channel);

    await channel.send("**This is the Lovers' chat.**\n\nThis chat is open to both parties only at night.");

    game.setChannel(name, channel);

  };

};
