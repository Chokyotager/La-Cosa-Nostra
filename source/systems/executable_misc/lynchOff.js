// Post when a lynch on someone is reached

var texts = require("./text/texts.js");
var format = require("./__formatter.js");

module.exports = async function (game, role) {

  var config = game.config;
  var client = game.client;

  var guild = client.guilds.get(config["server-id"]);

  var main_channel = guild.channels.find(x => x.name === config["channels"]["main"]);
  
  var message = texts.lynch_off;

  message = message.replace(new RegExp("{;player}", "g"), role.getDisplayName());
  message = message.replace(new RegExp("{;votes}", "g"), game.getVotesRequired() + role.getVoteOffset());

  await main_channel.send(message);

};
