var Discord = require("discord.js");

module.exports = async function (game, roles) {
  // Open up simple chats

  var config = game.config;
  var client = game.client;

  var flavour = game.getGameFlavour();

  if (!flavour) {
    return null;
  };

  var flavours = flavour.flavours;

  if (!flavour.info["post-role-card-and-description-on-death"]) {
    return null;
  };

  var guild = game.client.guilds.get(config["server-id"]);
  var roles_channel = guild.channels.find(x => x.name === config["channels"]["roles"]);

  for (var i = 0; i < roles.length; i++) {

    var role = roles[i];
    var flavour_role = flavours[role.flavour_role];

    var attachment = new Discord.Attachment(flavour.assets[flavour_role.banner], "role_card.png");

    await roles_channel.send(undefined, attachment);

    var sendable = "**{;flavour_role}**: {;info}\n```fix\n{;description}```";

    sendable = sendable.replace(/{;flavour_role}/g, role.getTrueFlavourRole(false));

    var info = new String();

    if (flavour.info["display-role-equivalent-on-death"]) {
      info += role.getRole() + "-equivalent; ";
    };

    info += cpl(role.role.alignment);

    if (flavour.info["show-role-category"]) {
      info += "-" + cpl(role.role.class);
    };

    sendable = sendable.replace(/{;info}/g, info);
    sendable = sendable.replace(/{;description}/g, flavour_role["description"] || role.role["description"]);

    await roles_channel.send(sendable);

  };

};

function cpl (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
