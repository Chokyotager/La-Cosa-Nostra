var Discord = require("discord.js");
var assets = require("../assets.js");

module.exports = async function (message, params, config) {

  var version_info = process.version_info;

  var update_name = version_info["update-name"];
  var version = version_info["version"];

  var repository = version_info.homepage;

  await message.channel.send(":sunflower: This bot is running on **" + update_name + " La Cosa Nostra " + version + "**.\nThe bot repository is located at <" + repository + ">.");
  await message.channel.send(new Discord.Attachment(await assets["version-banner.png"], "la-cosa-nostra.png"));

};
