var Discord = require("discord.js");

module.exports = async function (message, params, config) {
  var endpoint = "http://thecatapi.com/api/images/get";

  var loading = await message.channel.send(":cat: Performing CPR on a cat. Please wait.");

  message.channel.startTyping();

  var attachment = new Discord.Attachment(endpoint, "cat.gif");

  await message.channel.send("", attachment);
  await loading.delete();
  await message.channel.stopTyping();
};
