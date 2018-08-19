module.exports = async function (game) {

  if (game.channels.mafia !== undefined) {

    var chat_id = game.channels.mafia.id;
    var channel = game.client.channels.get(chat_id);

    var read_perms = game.config["base-perms"]["read"];

    var players = game.players;
    for (var i = 0; i < players.length; i++) {
      if (players[i]["see-mafia-chat"]) {

        var player = channel.guild.members.get(players[i].id);
        await channel.overwritePermissions(player, read_perms);

      };
    };

  };

};
