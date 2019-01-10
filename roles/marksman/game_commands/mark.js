// Register heal

var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  var from = game.getPlayerById(message.author.id);

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "mark <alphabet/name/nobody> <alphabet/name>` instead!");
    return null;
  };

  actions.delete(x => x.from === from.identifier && x.identifier === "marksman/mark");

  var prot = game.getPlayerMatch(params[0]);

  if (prot.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":round_pushpin: You have decided not to mark anyone tonight.");
    return null;
  };

  prot = prot.player;

  if (params[1] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "mark <alphabet/name/nobody> <alphabet/name>` instead!");
    return null;
  };

  var target = game.getPlayerMatch(params[1]);

  if (target.score < 0.7) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "mark <alphabet/name/nobody> <alphabet/name>` instead!");
    return null;
  };

  target = target.player;

  if (!prot.isAlive() || !target.isAlive()) {
    message.channel.send(":x: Both your protégé and target have to be alive!");
    return null;
  };

  if (prot.identifier === from.identifier || target.identifier === from.identifier) {
    message.channel.send(":x: You cannot pick yourself as the protégé or the target!");
    return null;
  };

  if (prot.identifier === target.identifier) {
    message.channel.send(":x: Your protégé cannot be your target!");
    return null;
  };

  game.addAction("marksman/mark", ["cycle"], {
    name: "Marksman-mark",
    expiry: 1,
    from: message.author.id,
    to: prot.identifier,
    target: target.identifier
  });

  message.channel.send(":round_pushpin: You have decided to mark **" + prot.getDisplayName() + "** as your protégé and **" + target.getDisplayName() + "** as your target tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
