var lcn = require("../../../../../source/lcn.js");

// Register heal

var rs = lcn.rolesystem;
var auxils = lcn.auxils;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "visit <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);
  var from = game.getPlayerById(message.author.id);

  actions.delete(x => x.from === from.identifier && x.identifier === "fool/visit");

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":house_with_garden: You have decided not to visit anyone tonight.");

    return null;
  };

  to = to.player;

  if (to.id === message.author.id) {

    message.channel.send(":x: You cannot visit yourself!" + rs.misc.sarcasm(true));

    return null;

  };

  if (!to.isAlive()) {
    message.channel.send(":x: You cannot visit a dead player!" + rs.misc.sarcasm(true));
    return null;
  };

  game.addAction("fool/visit", ["cycle"], {
    name: "Fool-visit",
    expiry: 1,
    from: message.author.id,
    to: to.id
  });

  var mention = to.getDisplayName();

  message.channel.send(":house_with_garden: You have decided to visit **" + mention + "** tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
