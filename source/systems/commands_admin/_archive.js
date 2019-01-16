var auxils = require("../auxils.js");

module.exports = async function (message, params, config) {

  if (process.timer && ["pre-game", "playing"].includes(process.timer.game.state)) {
    await message.channel.send(":x: You may not archive a game when one is running or primed.");
    return null;
  };

  if (params.length < 1) {
    await message.channel.send(":x: Wrong syntax! Use `" + config["command-prefix"] + "_archive <name>` instead!");
    return null;
  };

  var permissions = config.permissions;
  var base_perms = config["base-perms"];

  await message.channel.send(":hourglass_flowing_sand: Archiving channels.");

  var client = message.client;
  var guild = client.guilds.find(x => x.id === config["server-id"]);

  var name = params.join(" ");

  var category = await guild.createChannel("Archive " + name, "category");

  var channels = new Array();

  for (var key in config.channels) {

    if (key === "welcome-channel") {
      continue;
    };

    var channel_name = config.channels[key];
    var channel = guild.channels.find(x => x.name === channel_name);

    if (!channel) {
      continue;
    };

    await channel.setName(name + "-" + channel_name);
    await channel.setParent(category);

    channels.push(channel);

  };

  var all_channels = Array.from(channels);
  all_channels.push(category);

  await setPerms([permissions.admin, permissions.spectator, permissions.aftermath, "@everyone"], all_channels, base_perms["read"]);
  await setPerms([permissions.alive, permissions.dead, permissions.pre], all_channels, base_perms["deny"]);

  await message.channel.send(":ok: Archived **" + channels.length + "** channels.");

  async function setPerms (roles, channels, perms) {
    for (var i = 0; i < channels.length; i++) {
      for (var j = 0; j < roles.length; j++) {

        var role = guild.roles.find(x => x.name === roles[j]);

        if (!role) {
          continue;
        };

        await channels[i].overwritePermissions(role, perms);

      };
    };
  };

};
