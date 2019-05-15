var logger = process.logger;

module.exports = async function (game, role) {

  var client = game.client;
  var config = game.config;

  role.kill();

  // Remove alive role
  var guild = client.guilds.get(config["server-id"]);

  var alive_role = guild.roles.find(x => x.name === config["permissions"]["alive"]);
  var dead_role = guild.roles.find(x => x.name === config["permissions"]["dead"]);

  var member = guild.members.get(role.id);

  if (member === undefined) {
    logger.log(3, "Trying to kill undefined user. Debugging?");
    return null;
  };

  member.addRole(dead_role);
  member.removeRole(alive_role);

  // Remove read permissions from all special channels
  var special_channels = role.getSpecialChannels();
  var read_perms = game.config["base-perms"]["read"];

  for (var i = 0; i < special_channels.length; i++) {
    var channel = guild.channels.get(special_channels[i].id);

    if (!channel) {
      logger.log(4, "Removing read perms from undefined channel.");
      continue;
    };

    await channel.overwritePermissions(member, read_perms);
  };

};
