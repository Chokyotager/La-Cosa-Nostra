var logger = process.logger;

module.exports = async function (game, id1, id2, detailed_substitution=true) {

  var client = game.client;
  var config = game.config;

  var player = game.getPlayerById(id1);

  var bef_member = player.getGuildMember();
  player.substitute(id2);
  var aft_member = player.getGuildMember();

  logger.log(2, "Player %s substituted for %s.", id1, id2);

  if (!detailed_substitution) {
    return null;
  };

  var guild = client.guilds.get(config["server-id"]);

  var alive_role = guild.roles.find(x => x.name === config["permissions"]["alive"]);
  var pre_role = guild.roles.find(x => x.name === config["permissions"]["pre"]);
  var dead_role = guild.roles.find(x => x.name === config["permissions"]["dead"]);
  var spectator_role = guild.roles.find(x => x.name === config["permissions"]["spectator"]);
  var aftermath_role = guild.roles.find(x => x.name === config["permissions"]["aftermath"]);

  if (aft_member) {

    await removeRole(aft_member, [alive_role, pre_role, dead_role, spectator_role, aftermath_role]);

    var name = aft_member.displayName.replace(new RegExp("^(\[[A-z|0-9]{1,2}\] )*", "g"), "");

    if (player.isAlive()) {

      await aft_member.addRole(alive_role);

    } else {

      await aft_member.addRole(dead_role);

    };

    await aft_member.setNickname("[" + player.alphabet + "] " + name);

  };

  if (bef_member) {

    await removeRole(bef_member, [alive_role, pre_role, dead_role, spectator_role, aftermath_role]);

    var name = bef_member.displayName.replace(new RegExp("^(\[[A-z|0-9]{1,2}\] )*", "g"), "");

    if (name !== bef_member.displayName) {
      await bef_member.setNickname(name);
    };

  };

  if (!bef_member || !aft_member) {

    logger.log(4, "Non-existent substitution Discord user - skipping permission transfer.");
    return null;

  };


  // Complete permission transfer
  var channels = player.getSpecialChannels().map(x => guild.channels.find(y => y.id === x.id));

  var cache = new Array();

  for (var i = 0; i < channels.length; i++) {

    var channel = channels[i];

    var permissions = channel.memberPermissions(bef_member);

    if (!permissions) {
      continue;
    };

    cache.push(channel.overwritePermissions(aft_member, permissions.serialize()));

    var override = channel.permissionOverwrites.find(x => x.id === bef_member.id);
    if (override) {
      cache.push(override.delete());
    };

  };

  await Promise.all(cache);

};

async function removeRole (member, roles) {
  for (var i = 0; i < roles.length; i++) {

    if (!roles[i]) {
      continue;
    };

    if (member.roles.has(roles[i].id)) {
      await member.removeRole(roles[i]);
    };
  };
};
