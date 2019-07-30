var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  var from = game.getPlayerById(message.author.id);

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "strike <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);

  actions.delete(x => x.from === from.identifier && x.identifier === "sorceress/strike");

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":zap: You have decided not to strike anyone with lightning tonight.");
    return null;
  };

  to = to.player;

  if (!to.isAlive()) {
    message.channel.send(":x: You cannot strike a dead player with lightning!" + rs.misc.sarcasm(true));
    return null;
  };

  if (to.id === message.author.id) {

    message.channel.send(":x: You cannot strike yourself with lightning!" + rs.misc.sarcasm(true));

    return null;

  } else {

    game.addAction("sorceress/strike", ["cycle"], {
      name: "Sorceress-strike",
      expiry: 1,
      from: message.author.id,
      to: to.id
    });

    var mention = to.getDisplayName();

  };

  message.channel.send(":zap: You have decided to strike **" + mention + "** with lightning tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
