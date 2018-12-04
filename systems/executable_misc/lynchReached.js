// Post when a lynch on someone is reached

var texts = require("./text/texts.js");
var format = require("./__formatter.js");

module.exports = async function (game, role) {

  var config = game.config;
  var client = game.client;

  var guild = client.guilds.get(config["server-id"]);

  var main_channel = guild.channels.find(x => x.name === config["channels"]["main"]);

  var message = texts.getting_lynched;

  message = message.replace(new RegExp("{;player}", "g"), role.getDisplayName());
  message = message.replace(new RegExp("{;votes}", "g"), game.getVotesRequired() + role.getVoteOffset());

  var nolynch_info = new String();

  if (game.config["game"]["lynch"]["no-lynch-option"]) {
    nolynch_info = " if the no-lynch vote does not preside";
  };

  message = message.replace(new RegExp("{;extra_nolynch_info}", "g"), nolynch_info);

  await main_channel.send(message);

};
