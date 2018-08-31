module.exports = async function (game) {

  var client = game.client;
  var config = game.config;

  var guild = client.guilds.get(config["server-id"]);

  var alive = guild.roles.find(x => x.name === config["permissions"]["alive"]);
  var dead = guild.roles.find(x => x.name === config["permissions"]["dead"]);
  var spectator = guild.roles.find(x => x.name === config["permissions"]["spectator"]);
  var pre = guild.roles.find(x => x.name === config["permissions"]["pre"]);
  var post = guild.roles.find(x => x.name === config["permissions"]["aftermath"]);

  var players = game.players;

  for (var i = 0; i < players.length; i++) {

    var member = players[i].getGuildMember();

    if (!member) {
      continue;
    };

    await member.addRole(post);
    await removeRole(member, [alive, dead, pre]);

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
