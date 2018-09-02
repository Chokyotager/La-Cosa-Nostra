var auxils = require("./../auxils.js");

module.exports = async function (game, channel_name, permissions, position=-1) {

  var config = game.config;
  var client = game.client;

  var guild = client.guilds.get(config["server-id"]);

  var spectator = guild.roles.find(x => x.name === config["permissions"]["spectator"]);

  var read_perms = auxils.permsToArray(config["base-perms"]["read"]);

  var perms = [
    {id: guild.id, deny: ["READ_MESSAGES"]},
    {id: spectator.id, deny: read_perms.deny, allow: read_perms.allow}
  ];

  if (Array.isArray(permissions)) {
    perms = perms.concat(permissions);
  };

  var channel = await guild.createChannel(channel_name, "text", perms);

  var category = config["categories"]["private"];
  var cat_channel = client.channels.find(x => x.name === category && x.type === "category");

  await channel.setParent(cat_channel.id);

  if (position >= 0) {
    await channel.setPosition(position);
  };

  game.setChannel(channel_name, channel);

  return channel;

};
