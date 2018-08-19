var texts = require("./text/texts.js");
var format = require("./__formatter.js");

module.exports = async function (game, broadcast) {
  // Post periodic log

  var config = game.config;
  var guild = game.client.guilds.get(config["server-id"]);

  var log = guild.channels.find("name", config["channels"]["log"]);
  var main = guild.channels.find("name", config["channels"]["main"]);

  if (broadcast === undefined) {
    broadcast = "{#no-summary}";
  };

  var sendable = texts.new_period;
  sendable = sendable.replace(new RegExp("{;summary}", "g"), broadcast);

  log.send(format(game, sendable));

  if (game.period % 2 === 0) {
    var message = await main.send(format(game, game.config["messages"]["daytime-quote"]));
  } else {
    var message = await main.send(format(game, game.config["messages"]["nighttime-quote"]));
  };

  game.createPeriodPin(message);

};
