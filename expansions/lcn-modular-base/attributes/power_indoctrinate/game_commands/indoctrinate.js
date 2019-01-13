var lcn = require("../../../../../source/lcn.js");

// Register heal

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "indoctrinate <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);
  var from = game.getPlayerById(message.author.id);

  rs.modular.clearModuleActions(game, from.identifier, "power");

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":candle: You have decided not to indoctrinate anyone tonight.");
    return null;
  };

  to = to.player;

  if (!to.isAlive()) {
    message.channel.send(":x: You cannot indoctrinate a dead player!" + rs.misc.sarcasm(true));
    return null;
  };

  if (to.id === message.author.id) {

    message.channel.send(":x: You cannot indoctrinate yourself!" + rs.misc.sarcasm(true));

    return null;

  };

  if (from.misc.cult_all_members.includes(to.identifier)) {
    message.channel.send(":x: That player has already been indoctrinate into your cult!");
    return null;
  };

  game.addAction("a/power_indoctrinate/indoctrinate", ["cycle"], {
    name: "Modular-indoctrinate",
    expiry: 1,
    priority: 3,
    from: message.author.id,
    meta: {type: "power"},
    to: to.id
  });

  var mention = to.getDisplayName();

  message.channel.send(":candle: You have decided to indoctrinate **" + mention + "** tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
