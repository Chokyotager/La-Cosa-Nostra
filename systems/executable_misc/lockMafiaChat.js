module.exports = async function (game) {

  if (game.channels.mafia !== undefined) {

    var channel = game.getChannel("mafia");

    var read_perms = game.config["base-perms"]["read"];

    var mafia = game.findAll(x => x.see_mafia_chat === true);

    for (var i = 0; i < mafia.length; i++) {

      var member = mafia[i].getGuildMember();
      if (!member) {
        continue;
      };

      await channel.overwritePermissions(member, read_perms);
    };

  };

};
