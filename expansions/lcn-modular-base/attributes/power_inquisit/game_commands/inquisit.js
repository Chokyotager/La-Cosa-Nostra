var lcn = require("../../../../../source/lcn.js");

// Register heal

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "inquisit <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);
  var from = game.getPlayerById(message.author.id);

  rs.modular.clearModuleActions(game, from.identifier, "power");

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":speech_balloon: You have decided not to inquisit anyone tonight.");
    return null;
  };

  to = to.player;

  if (!to.isAlive()) {
    message.channel.send(":x: You cannot inquisit a dead player!" + rs.misc.sarcasm(true));
    return null;
  };

  if (to.id === message.author.id) {

    message.channel.send(":x: You cannot inquisit yourself!" + rs.misc.sarcasm(true));

    return null;

  };

  if (from.misc.neighbour_players.includes(to.identifier)) {
    message.channel.send(":x: That player has already been inquisited into your neighbourhood!");
    return null;
  };

  game.addAction("a/power_inquisit/inquisit", ["cycle"], {
    name: "Modular-inquisit",
    expiry: 1,
    priority: 4,
    from: message.author.id,
    meta: {type: "power"},
    to: to.id
  });

  var mention = to.getDisplayName();

  message.channel.send(":speech_balloon: You have decided to inquisit **" + mention + "** tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
