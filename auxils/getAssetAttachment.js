var Discord = require("discord.js");
var assets = require("../systems/assets.js");

module.exports = function (asset_name) {
  var attachment = new Discord.Attachment(assets[asset_name], asset_name);
  return attachment;
};
