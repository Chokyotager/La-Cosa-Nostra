module.exports = async function (game) {

  if (!game.channels.cabinet) {
    return null;
  };

  var channel = game.getChannel("cabinet");

  await game.sendPin(channel, "~~                                              ~~    **" + game.getFormattedDay() + "**");

  var post_perms = game.config["base-perms"]["post"];
  var read_perms = game.config["base-perms"]["read"];

  if (game.isDay()) {

    // Lock channels
    for (var i = 0; i < cabinet_alive.length; i++) {

      var member = cabinet_alive[i].getGuildMember();

      if (!member) {
        continue;
      };

      await channel.overwritePermissions(member, read_perms);

    };

  } else {

    // Open channels
    for (var i = 0; i < cabinet_alive.length; i++) {

      var member = cabinet_alive[i].getGuildMember();

      if (!member) {
        continue;
      };

      await channel.overwritePermissions(member, post_perms);

    };

  };

};
