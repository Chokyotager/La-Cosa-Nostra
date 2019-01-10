var auxils = require("../auxils.js");

module.exports = async function (message, params, config) {

  await message.channel.send(":hourglass_flowing_sand: Creating game channels if they do not exist.");

  var channels = config.channels;
  var guild = message.client.guilds.find(x => x.id === config["server-id"]);

  var permissions = config.permissions;
  var base_perms = config["base-perms"];

  var channels_created = new Array();

  for (var key in channels) {

    if (key === "welcome-channel") {
      continue;
    };

    var out = await createChannel(channels[key], "text");
    if (out) {
      channels_created.push(out);
    };

  };

  var categories = config.categories;

  var categories_created = new Array();

  for (var key in categories) {

    var out = await createChannel(categories[key], "category");

    if (out) {
      categories_created.push(out);
    };

  };

  var all_channels = channels_created.concat(categories_created);

  await setPerms([permissions.admin, permissions.alive, permissions.dead, permissions.spectator, permissions.aftermath, permissions.pre], all_channels, base_perms["read"]);
  await setPerms(["@everyone"], all_channels, base_perms["deny"]);

  await message.channel.send(":ok: Created **" + channels_created.length + "** text channel" + auxils.vocab("s", channels_created.length) + " and **" + categories_created.length + "** category channel" + auxils.vocab("s", categories_created.length) + ".");

  async function createChannel (name, type="text") {

    if (guild.channels.some(x => x.name === name && x.type === type)) {

      return null;

    };

    var channel = await guild.createChannel(name, type);

    return channel;

  };

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
