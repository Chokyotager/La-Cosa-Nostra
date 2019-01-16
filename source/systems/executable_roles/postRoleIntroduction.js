var Discord = require("discord.js");
var pinMessage = require("../executable_misc/pinMessage.js");

module.exports = async function (player, stagger=800) {

  var client = player.game.client;
  var config = player.game.config;

  var flavour = player.game.getGameFlavour() || new Object();

  var flavours = flavour.flavours || new Object();
  var flavour_role = flavours[player.flavour_role] || new Object();

  var flavour_info = flavour.info || {"show-role-equivalent": false, "show-vanilla-banner": true};

  // Staggering prevents overload
  await new Promise(function(resolve, reject) {
    setTimeout(function () {
      resolve();
    }, Math.random() * stagger*player.game.players.length);
  });

  var role = player.role;

  var guild = client.guilds.get(config["server-id"]);
  var channel = guild.channels.get(player.channel.id);

  if (flavour_role.banner && flavour.assets[flavour_role.banner]) {

    // Flavour role card available
    var attachment = new Discord.Attachment(flavour.assets[flavour_role.banner], "role_card.png");

    // Post
    var message = await channel.send(undefined, attachment);
    await pinMessage(message);


  };

  if (role.role_card !== undefined && flavour_info["show-vanilla-banner"]) {

    // Role card available
    var attachment = new Discord.Attachment(await role.role_card, "role_card.png");

    // Post
    var message = await channel.send(undefined, attachment);
    await pinMessage(message);

  };

  var send = "**Your role:** {;role}{;true_role}\n\n**Alignment:** {;alignment}\n\n```fix\n{;description}```\n<@{;player_id}>";

  send = send.replace(/{;role}/g, cpl(flavour_role["name"] || role["role-name"]));

  if (flavour_info["show-role-category"] === false) {
    send = send.replace(/{;alignment}/g, cpl(role["alignment"]));
  } else {
    send = send.replace(/{;alignment}/g, cpl(role["alignment"] + "-" + cpl(role["class"])));
  };

  send = send.replace(/{;description}/g, flavour_role["description"] || role["description"]);
  send = send.replace(/{;player_id}/g, player.id);

  if (flavour && flavour_info["show-role-equivalent"] && flavour_role["name"] !== role["role-name"]) {
    send = send.replace(/{;true_role}/g, "\n\n**Vanilla role equivalent:** " + role["role-name"]);
  } else {
    send = send.replace(/{;true_role}/g, "");
  };

  var message = await channel.send(send);
  await pinMessage(message);

  var start_message = await channel.send("~~                                              ~~    **" + player.game.getFormattedDay() + "**         [*game start*]");
  await pinMessage(start_message);

  for (var i = 0; i < player.intro_messages.length; i++) {
    await channel.send(player.intro_messages[i]);
  };

  player.intro_messages = new Array();

};

function cpl (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
