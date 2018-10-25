var texts = require("./text/texts.js");
var format = require("./__formatter.js");

var pinMessage = require("./pinMessage.js");

module.exports = async function (game, broadcast) {
  // Post periodic log

  var config = game.config;
  var guild = game.client.guilds.get(config["server-id"]);

  var log = guild.channels.find(x => x.name === config["channels"]["log"]);
  var main = guild.channels.find(x => x.name === config["channels"]["main"]);

  if (broadcast === undefined) {
    broadcast = "{#no-summary}";
  };

  var sendable = texts.new_period;
  sendable = sendable.replace(new RegExp("{;summary}", "g"), broadcast);

  log.send(format(game, sendable));

  var pinnable = await main.send("**" + game.getFormattedDay() + "**    ~~                                                                                            ~~");
  await pinMessage(pinnable);

  if (game.period % 2 === 0) {
    await main.send(format(game, game.config["messages"]["daytime-quote"]));
  } else {
    await main.send(format(game, game.config["messages"]["nighttime-quote"]));
  };

};
