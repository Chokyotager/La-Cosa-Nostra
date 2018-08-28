var Discord = require("Discord.js");
var pinMessage = require("../executable_misc/pinMessage.js");

module.exports = async function (player, stagger=200) {

  var client = player.game.client;
  var config = player.game.config;

  // Staggering prevents overload
  await new Promise(function(resolve, reject) {
    setTimeout(function () {
      resolve();
    }, Math.random() * stagger*player.game.players.length);
  });

  var role = player.role;

  var guild = client.guilds.get(config["server-id"]);
  var channel = guild.channels.get(player.channel.id);

  if (role.role_card !== undefined) {

    // Role card available
    var attachment = new Discord.Attachment(role.role_card, "role_card.png");

    // Post
    var message = await channel.send(undefined, attachment);
    await pinMessage(message);

  };

  var send = "**Your role:** {;role}\n\n**Alignment:** {;alignment}-{;class}\n\n```fix\n{;description}```\n<@{;player_id}>";

  send = send.replace(/{;role}/g, cpl(role["role-name"]));
  send = send.replace(/{;alignment}/g, cpl(role["alignment"]));
  send = send.replace(/{;class}/g, cpl(role["class"]));
  send = send.replace(/{;description}/g, role["description"]);
  send = send.replace(/{;player_id}/g, player.id);

  var message = await channel.send(send);
  await pinMessage(message);

  channel.send("~~                                              ~~    **" + player.game.getFormattedDay() + "**         [*game start*]");

};

function cpl (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
