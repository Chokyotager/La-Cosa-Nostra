module.exports = async function (game) {

  var envoys_alive = game.findAll(x => x.role.alignment === "envoy" && x.isAlive());

  if (!game.channels.envoys || envoys_alive.length < 1) {
    return null;
  };

  var channel = game.getChannel("envoys");

  await game.sendPin(channel, "~~                                              ~~    **" + game.getFormattedDay() + "**");

  var post_perms = game.config["base-perms"]["post"];
  var read_perms = game.config["base-perms"]["read"];

  if (game.isDay()) {

    // Lock channels
    for (var i = 0; i < envoys_alive.length; i++) {

      var member = envoys_alive[i].getGuildMember();

      if (!member) {
        continue;
      };

      await channel.overwritePermissions(member, read_perms);

    };

  } else {

    // Open channels
    for (var i = 0; i < envoys_alive.length; i++) {

      var member = envoys_alive[i].getGuildMember();

      if (!member) {
        continue;
      };

      await channel.overwritePermissions(member, post_perms);

    };

  };

};
