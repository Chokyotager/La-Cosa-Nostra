module.exports = async function (game) {

  var client = game.client;
  var config = game.config;

  var guild = client.guilds.get(config["server-id"]);

  var members = guild.members.array();

  var alive = guild.roles.find(x => x.name === config["permissions"]["alive"]);
  var dead = guild.roles.find(x => x.name === config["permissions"]["dead"]);
  var spectator = guild.roles.find(x => x.name === config["permissions"]["spectator"]);
  var pre = guild.roles.find(x => x.name === config["permissions"]["pre"]);
  var post = guild.roles.find(x => x.name === config["permissions"]["aftermath"]);

  for (var i = 0; i < game.players.length; i++) {
    var member = game.players[i].getGuildMember();

    if (member) {
      await member.addRole(post);
    };
  };

  for (var i = 0; i < members.length; i++) {
    await removeRole(members[i], [alive, dead, spectator, pre]);
  };

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
