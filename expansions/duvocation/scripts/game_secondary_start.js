var Discord = require("discord.js");

module.exports = async function (game) {

  var lcn = require("../../../source/lcn.js");
  var flavours = lcn.assets;

  var channel = game.getChannel("mafia");

  await channel.send("_ _\n:exclamation: You are informed that there are many __Followers of the 3-Faced God__ in attendance at the Duvocation.");

  var flavour = game.getGameFlavour();

  var role = flavour.roles["follower_of_3"][0];
  var role_card = flavour.assets[role.banner];

  await channel.send(new Discord.Attachment(role_card, "role-card.png"));
  await channel.send("```fix\n" + role.description + "```");

};
