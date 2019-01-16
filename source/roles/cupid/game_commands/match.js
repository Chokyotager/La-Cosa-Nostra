// Register heal

var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  var from = game.getPlayerById(message.author.id);

  if (from.misc.cupid_matches < 1) {
    message.channel.send(":x: You have already used up all your matches.");
    return null;
  };

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "mark <alphabet/name/nobody> <alphabet/name>` instead!");
    return null;
  };

  actions.delete(x => x.from === from.identifier && x.identifier === "cupid/match");

  var one = game.getPlayerMatch(params[0]);

  if (one.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":hearts: You have decided not to match anyone tonight.");
    return null;
  };

  one = one.player;

  if (params[1] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "match <alphabet/name/nobody> <alphabet/name>` instead!");
    return null;
  };

  var two = game.getPlayerMatch(params[1]);

  if (two.score < 0.7) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "match <alphabet/name/nobody> <alphabet/name>` instead!");
    return null;
  };

  two = two.player;

  if (!one.isAlive() || !two.isAlive()) {
    message.channel.send(":x: Both targets have to be alive!");
    return null;
  };

  if (one.identifier === two.identifier) {
    message.channel.send(":x: Both targets cannot be the same player!");
    return null;
  };

  game.addAction("cupid/match", ["cycle"], {
    name: "Cupid-match",
    expiry: 1,
    from: message.author.id,
    to: one.identifier,
    target: two.identifier
  });

  message.channel.send(":heart: You have decided to match **" + ((one.identifier === from.identifier) ? "yourself" : one.getDisplayName()) + "** with **" + ((two.identifier === from.identifier) ? "yourself" : two.getDisplayName()) + "** tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
