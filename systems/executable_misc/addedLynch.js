var texts = require("./text/texts.js");
var format = require("./__formatter.js");

module.exports = async function (game, from, to) {

  var client = game.client;
  var config = game.config;

  var guild = client.guilds.get(config["server-id"]);
  var main = guild.channels.find("name", config["channels"]["main"]);

  var voter = main.members.get(from);
  var voted = main.members.get(to);

  var message = texts.lynching;

  if (voted === undefined) {
    console.log("Undefined member on voted user. Debugging?");
    return null;
  };

  message = message.replace(new RegExp("{;voter}", "g"), voter.nickname !== null ? voter.nickname : voter.user.username);
  message = message.replace(new RegExp("{;voted}", "g"), voted.nickname !== null ? voted.nickname : voted.user.username);

  await main.send(message);

};
