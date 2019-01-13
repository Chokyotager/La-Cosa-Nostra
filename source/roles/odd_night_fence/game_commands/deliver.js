// Register heal

var rs = require("../../../rolesystem/rolesystem.js");
var auxils = require("../../../systems/auxils.js");

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  if (game.getPeriod() % 4 !== 1) {
    return null;
  };

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "deliver <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);
  var from = game.getPlayerById(message.author.id);

  actions.delete(x => x.from === from.identifier && (x.identifier === "odd_night_fence/delivery" || x.identifier === "odd_night_fence/random_delivery"));

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":mailbox_closed: You have decided not to deliver a gun to anyone. A random player will be chosen instead.");

    game.addAction("odd_night_fence/random_delivery", ["cycle"], {
      name: "Odd-night-Fence-random-delivery",
      expiry: 1,
      from: message.author.id,
      to: message.author.id,
      priority: -1
    });

    return null;
  };

  to = to.player;

  if (from.misc.fence_log[0] === to.identifier) {
    message.channel.send(":x: You may not deliver a gun to the same person consecutively! Please re-pick your target or a random player will be chosen instead!");

    game.addAction("odd_night_fence/random_delivery", ["cycle"], {
      name: "Odd-night-Fence-random-delivery",
      expiry: 1,
      from: message.author.id,
      to: message.author.id,
      priority: -1
    });

    return null;
  };

  if (to.id === message.author.id) {

    message.channel.send(":x: You cannot deliver a gun to yourself!");

    return null;

  };

  if (!to.isAlive()) {
    message.channel.send(":x: You cannot deliver a gun to a dead player!" + rs.misc.sarcasm(true));
    return null;
  };

  game.addAction("odd_night_fence/delivery", ["cycle"], {
    name: "Odd-night-Fence-delivery",
    expiry: 1,
    from: message.author.id,
    to: to.id
  });

  var mention = to.getDisplayName();

  message.channel.send(":mailbox_closed: You have decided to deliver a gun to **" + mention + "** tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
