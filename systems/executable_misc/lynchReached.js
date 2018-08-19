// Post when a lynch on someone is reached

var texts = require("./text/texts.js");
var format = require("./__formatter.js");

module.exports = async function (game, role) {

  var config = game.config;
  var client = game.client;

  var guild = client.guilds.get(config["server-id"]);

  var main_channel = guild.channels.find("name", config["channels"]["main"]);

  var member = main_channel.members.get(role.id);

  if (member === undefined) {
    console.log("Undefined member on voted user. Debugging?");
    return null;
  };

  var message = texts.getting_lynched;

  message = message.replace(new RegExp("{;player}", "g"), member.displayName);
  message = message.replace(new RegExp("{;votes}", "g"), game.getVotesRequired() + role.getVoteOffset());

  await main_channel.send(message);

};
