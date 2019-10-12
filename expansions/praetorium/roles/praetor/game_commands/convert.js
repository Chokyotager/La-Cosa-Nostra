// Register heal

var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "convert <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);
  var from = game.getPlayerById(message.author.id);

  actions.delete(x => x.from === from.identifier && (x.identifier === "praetor/convert" || x.identifier === "praetor/convert_checker"));

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":candle: You have decided not to convert anyone tonight.");
    return null;
  };

  to = to.player;

  if (!to.isAlive()) {
    message.channel.send(":x: You cannot convert a dead player!" + rs.misc.sarcasm(true));
    return null;
  };

  if (to.id === message.author.id) {

    message.channel.send(":x: You cannot convert yourself!" + rs.misc.sarcasm(true));

    return null;

  } else {

    game.addAction("praetor/convert", ["cycle"], {
      name: "Praetor-convert",
      expiry: 1,
      from: message.author.id,
      to: to.id
    });

    game.addAction("praetor/convert_checker", ["cycle"], {
      name: "Praetor-convert-checker",
      expiry: 1,
      priority: 15,
      from: message.author.id,
      to: to.id
    });

    var mention = to.getDisplayName();

  };

  message.channel.send(":candle: You have decided to convert **" + mention + "** tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
