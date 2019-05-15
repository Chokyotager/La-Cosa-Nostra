var auxils = require("../auxils.js");
var crypto = require("crypto");
var flavours = require("../flavours.js");

var configModifier = require("../game_setters/configModifier.js");

module.exports = async function (message, params, config) {

  config = configModifier(config);

  var players = config.playing.players;
  var guild = message.client.guilds.find(x => x.id === config["server-id"]);

  if (!guild) {
    await message.channel.send(":x: The guild has been wrongly configured. Please change this in the config before initialising.");
    return null;
  };

  if (players !== "auto") {

    var names = new Array();

    for (var i = 0; i < players.length; i++) {

      var member = guild.members.find(x => x.id === players[i]);

      if (!member) {
        names.push("undef'd player (" + players[i] + ")");
        continue;
      };

      // Run
      names.push(member.displayName + " (" + players[i] + ")");

    };

  } else {

    var members = guild.members.filter(x => x.roles.some(y => y.name === config["permissions"]["pre"])).array();

    members.sort(function (a, b){
        if (a.displayName.toLowerCase() < b.displayName.toLowerCase()) { return -1; }
        if (a.displayName.toLowerCase() > b.displayName.toLowerCase()) { return 1; }
        return 0;
    });

    var names = members.map(x => x.displayName + " (" + x.id + ")");

  };

  await message.channel.send(":hourglass_flowing_sand: **SETUP AUDIT REPORT** :hourglass_flowing_sand:");

  // Server details
  await message.channel.send("_ _\n**:computer: Server Details :computer:**\n```fix\nServer Name: " + guild.name + "\nServer ID: " + guild.id + "\n```");

  // Registered players
  await message.channel.send("_ _\n**:spy: Registered Players (" + names.length + "/" + config.playing.roles.length + ") :spy:**\n```fix\n" + names.map((x, i) => (i + 1) + ". " + x).join("\n") + "\n\nShuffle roles on assign: " + config.playing.shuffle + "```");

  // Game details
  await message.channel.send("_ _\n**:game_die: Game Details :game_die:**\n```js\n" + JSON.stringify(config.game, auxils.jsonInfinityCensor, 3) + "```");

  // Timezone and cycles
  var timezone = config.time;
  await message.channel.send("_ _\n**:clock11: Timezone and Cycles :clock11:**\n```fix\nTimezone: UTC+" + timezone.timezone + "\nGame cycles: " + timezone.day+ " hours / " + timezone.night + " hours\n```");

  var hash = computeHash(config);
  await message.channel.send("_ _\n**:exclamation: Set-up Hash :exclamation:**\n**`" + hash + "`**\n\n*(Note that hashes will change if role determination uses random mechanics.)*");

  function computeHash (config) {

    var flavour = config.playing.flavour;

    var flavour_info = flavours[flavour];

    var order = [config.playing.roles, config.game, flavour, flavour_info];

    var hash = crypto.createHash("md5");
    for (var i = 0; i < order.length; i++) {
      var update = JSON.stringify(order[i], auxils.jsonInfinityCensor);

      if (!update) {
        update = "[X]";
      };

      hash.update(update);
    };

    return hash.digest("hex");

  };

};
