module.exports = async function (game, id) {

  var client = game.client;
  var config = game.config;

  var role = game.getPlayerById(id);

  var successful = role.lynch();

  if (!successful) {
    return null;
  };

  // Remove alive role
  var guild = client.guilds.get(config["server-id"]);

  var alive_role = guild.roles.find("name", config["permissions"]["alive"]);
  var dead_role = guild.roles.find("name", config["permissions"]["dead"]);

  var member = guild.members.get(role.id);

  if (member === undefined) {
    console.log("Undefined execution of voted user. Debugging?");
    return null;
  };

  member.addRole(dead_role);
  member.removeRole(alive_role);

  // Remove read permissions from all special channels
  var special_channels = role.getSpecialChannels();
  var read_perms = game.config["base-perms"]["read"];

  for (var i = 0; i < special_channels.length; i++) {
    var channel = guild.channels.get(special_channels[i].id);
    await channel.overwritePermissions(member, read_perms);
  };

  return successful;

};
