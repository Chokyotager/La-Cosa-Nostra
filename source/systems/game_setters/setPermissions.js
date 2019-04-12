var logger = process.logger;

module.exports = async function (client, config, roles) {
  // Set permissions to view channels

  logger.log(2, "Setting permissions.");

  var read_perms = config["base-perms"]["read"];
  var post_perms = config["base-perms"]["post"];

  for (var i = 0; i < roles.length; i++) {
    var alphabet = roles[i].alphabet.toLowerCase();

    var channel = client.channels.get(roles[i].channel.id);

    await setRoleOf(channel, roles[i].id, post_perms);

    // If Mafia chat is enabled
    if (config["game"]["mafia"]["chat"] && roles[i]["see-mafia-chat"]) {
      // Allow role to see channel
      await setRoleOf(channel, roles[i].id, read_perms);

      // Important addon
      roles[i].addSpecialChannel(channel);
    };

  };

};

async function setRoleOf (channel, id, perms) {

  var member = channel.guild.members.get(id);

  if (member) {
    await channel.overwritePermissions(member, perms);
  };

};
