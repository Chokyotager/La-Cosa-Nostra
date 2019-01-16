var lcn = require("../../../../../source/lcn.js");

// Register heal

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "disable <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);
  var from = game.getPlayerById(message.author.id);

  rs.modular.clearModuleActions(game, from.identifier, "power");

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":no_entry_sign: You have decided not to disable anyone tonight.");
    return null;
  };

  to = to.player;

  if (!to.isAlive()) {
    message.channel.send(":x: You cannot disable a dead player!" + rs.misc.sarcasm(true));
    return null;
  };

  if (to.id === message.author.id) {

    message.channel.send(":x: You cannot disable yourself!" + rs.misc.sarcasm(true));

    return null;

  } else {

    game.addAction("a/power_disable/disable", ["cycle"], {
      name: "Modular-disable",
      expiry: 1,
      from: message.author.id,
      to: to.id,
      meta: {type: "power"},
      priority: 2
    });

    var mention = to.getDisplayName();

  };

  message.channel.send(":no_entry_sign: You have decided to disable **" + mention + "** tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
