var auxils = require("./../auxils.js");

module.exports = async function (game, channel_name, permissions, position=-1) {

  var config = game.config;
  var client = game.client;

  var guild = client.guilds.get(config["server-id"]);

  var spectator = guild.roles.find(x => x.name === config["permissions"]["spectator"]);
  var admin = guild.roles.find(x => x.name === config["permissions"]["admin"]);

  permissions = [{target: spectator, permissions: config["base-perms"]["read"]},
                 {target: admin, permissions: config["base-perms"]["manage"]}].concat(permissions);

  var category = config["categories"]["private"];
  var cat_channel = client.channels.find(x => x.name === category && x.type === "category");

  var channel = await guild.createChannel(channel_name, {type: "text", permissionOverwrites: [{id: guild.id, deny: ["READ_MESSAGES"]}], parent: cat_channel, position: 0});

  // {target, permissions}
  for (var i = 0; i < permissions.length; i++) {
    if (!permissions[i].target) {
      continue;
    };

    await channel.overwritePermissions(permissions[i].target, permissions[i].permissions);
  };

  game.setChannel(channel_name, channel);

  return channel;

};
