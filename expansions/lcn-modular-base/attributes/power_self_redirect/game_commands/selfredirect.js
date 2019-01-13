var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "selfredirect <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);
  var from = game.getPlayerById(message.author.id);

  rs.modular.clearModuleActions(game, from.identifier, "power");

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":leftwards_arrow_with_hook: You have decided not to self-redirect tonight.");
    return null;
  };

  to = to.player;

  if (!to.isAlive()) {
    message.channel.send(":x: You cannot self-redirect a dead player!" + rs.misc.sarcasm(true));
    return null;
  };

  if (to.id === message.author.id) {
    // Do stuff
    message.channel.send(":x: You cannot self-redirect yourself!");
    return null;

  } else {

    game.addAction("a/power_self_redirect/selfredirect", ["cycle"], {
      name: "Modular-selfredirect",
      expiry: 1,
      from: message.author.id,
      meta: {type: "power"},
      to: to.id,
      priority: 0.002
    });

    var mention = to.getDisplayName();

  };

  message.channel.send(":leftwards_arrow_with_hook: You have decided to redirect all actions on **" + mention + "** to yourself tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
