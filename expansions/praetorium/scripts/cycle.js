module.exports = async function (game) {

  var cabinet_alive = game.findAll(x => x.role["win-condition"] === "praetorium" && x.isAlive());

  if (cabinet_alive.filter(x => x.role_identifier !== "praetor").length < 1) {

    // Destroy
    var praetorium_members = game.findAll(x => x.isAlive() && x.role.alignment === "praetorium");

    for (var i = 0; i < praetorium_members.length; i++) {

      var member = praetorium_members[i];

      if (member.role_identifier === "praetor") {

        game.kill(member, "__dethroned and executed__", "__dethroned and executed__", 1);

      } else {

        game.kill(member, "__executed__", "__executed__");

      };

    };

    return null;

  };

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
