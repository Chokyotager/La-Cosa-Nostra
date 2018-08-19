var Discord = require("Discord.js");

module.exports = async function (message, params, config) {
  var endpoint = "http://thecatapi.com/api/images/get";

  var loading = await message.channel.send(":cat: Performing CPR on a cat. Please wait.");

  var attachment = new Discord.Attachment(endpoint, "cat.gif");

  await message.channel.send("", attachment);
  loading.delete();
};
