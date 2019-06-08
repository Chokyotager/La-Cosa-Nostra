var lcn = require("../../../../../source/lcn.js");

// Register heal

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "roleblock <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);
  var from = game.getPlayerById(message.author.id);

  rs.modular.clearModuleActions(game, from.identifier, "blessing");

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":pray: You have decided not to bless anyone tonight.");
    return null;
  };

  to = to.player;

  if (!to.isAlive()) {
    message.channel.send(":x: You cannot bless a dead player!" + rs.misc.sarcasm(true));
    return null;
  };

  if (to.id === message.author.id) {

    message.channel.send(":x: You cannot bless yourself!" + rs.misc.sarcasm(true));

    return null;

  } else {

    game.addAction("a/blessing_restraint/bless", ["cycle"], {
      name: "Modular-bless_restraint",
      expiry: 1,
      from: message.author.id,
      to: to.id,
      meta: {type: "blessing"},
      priority: 1
    });

    var mention = to.getDisplayName();

  };

  message.channel.send(":pray: You have decided to bless **" + mention + "** with restraint tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
