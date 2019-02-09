var auxils = require("./../auxils.js");

module.exports = async function (game, channel_name, permissions, position=-1) {

  var config = game.config;
  var client = game.client;

  var guild = client.guilds.get(config["server-id"]);

  var spectator = guild.roles.find(x => x.name === config["permissions"]["spectator"]);
  var admin = guild.roles.find(x => x.name === config["permissions"]["admin"]);

  permissions = [{target: spectator, permissions: config["base-perms"]["read"]},
                 {target: admin, permissions: config["base-perms"]["manage"]}].concat(permissions);

  var channel = await guild.createChannel(channel_name, "text", [{id: guild.id, deny: ["READ_MESSAGES"]}]);

  var category = config["categories"]["private"];
  var cat_channel = client.channels.find(x => x.name === category && x.type === "category");

  await channel.setParent(cat_channel.id);

  if (position >= 0) {
    await channel.setPosition(position);
  };

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
