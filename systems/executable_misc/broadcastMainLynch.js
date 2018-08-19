// Broadcast the lynch to the main channel

module.exports = async function (game, roles) {

  var client = game.client;
  var config = game.config;

  var guild = client.guilds.get(config["server-id"]);
  var channel = guild.channels.find("name", config["channels"]["main"]);

  if (roles.length === 0) {
    // Nobody lynched
    await channel.send(config["messages"]["abstain-lynch"]);
    return null;
  };

  if (roles.length === 1) {

    // Singular lynch
    var lynched = formatRoleMessage(roles);
    var message = config["messages"]["singular-lynch"];

    await channel.send(message.replace(new RegExp("{;player}", "g"), lynched));
    return null;

  } else {

    // Plural lynch
    var lynched = formatRoleMessage(roles);
    var message = config["messages"]["plural-lynch"];

    await channel.send(message.replace(new RegExp("{;players}", "g"), lynched));
    return null;

  };

  function formatRoleMessage (roles) {

    var ret = new String();

    for (var i = 0; i < roles.length; i++) {

      ret += guild.members.get(roles[i].id).displayName;

      if (i < roles.length - 1) {
        ret += "**, **";
      } else if (i === roles.length) {
        ret += "** and **";
      };

    };

    return ret;

  };

};
