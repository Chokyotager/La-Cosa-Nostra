module.exports = function (game) {
  var players = game.players;

  var config = game.config;
  var client = game.client;

  var guild = client.guilds.get(config["server-id"]);

  var members = guild.members;

  for (var i = 0; i < players.length; i++) {
    var exist = members.has(players[i].id);

    if (exist) {
      continue;
    };

    // Remove player from game

  };
};
