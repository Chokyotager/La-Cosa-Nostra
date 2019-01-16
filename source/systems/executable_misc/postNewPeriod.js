var texts = require("./text/texts.js");
var format = require("./__formatter.js");

var pinMessage = require("./pinMessage.js");

module.exports = async function (game, broadcast) {
  // Post periodic log

  var config = game.config;
  var guild = game.client.guilds.get(config["server-id"]);

  var log = guild.channels.find(x => x.name === config["channels"]["log"]);
  var main = guild.channels.find(x => x.name === config["channels"]["main"]);
  var post = guild.channels.find(x => x.name === config["channels"]["whisper-log"]);

  if (broadcast === undefined) {
    broadcast = "{#no-summary}";
  };

  var sendable = texts.new_period;
  sendable = sendable.replace(new RegExp("{;summary}", "g"), broadcast);

  log.send(format(game, sendable));

  var main_pinnable = await main.send("**" + game.getFormattedDay() + "**    ~~                                                                                            ~~");
  var post_pinnable = await post.send("**" + game.getFormattedDay() + "**    ~~                                                                                            ~~");

  await pinMessage(main_pinnable);
  await pinMessage(post_pinnable);

  if (game.period % 2 === 0) {
    await main.send(format(game, game.config["messages"]["daytime-quote"]));
  } else {
    await main.send(format(game, game.config["messages"]["nighttime-quote"]));
  };

};
