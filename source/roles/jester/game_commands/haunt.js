// Register heal

var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  if (game.state !== "playing") {
    message.channel.send(":x: You cannot haunt a player now!");
    return null;
  };

  // Run checks, etc

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "haunt <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);
  var from = game.getPlayerById(message.author.id);

  if (from.misc.jester_haunted) {
    message.channel.send(":x: You have already used your haunt!");
    return null;
  };

  if (!from.misc.jester_lynched) {
    message.channel.send(":x: You may not haunt a player!");
    return null;
  };

  actions.delete(x => x.from === from.identifier && (x.identifier === "jester/haunt" || x.identifier === "jester/random_haunt"));

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":black_joker: You have decided not to haunt anyone. A player who has lynched you will be haunted at random.");

    game.addAction("jester/random_haunt", ["cycle"], {
      name: "Jester-random-haunt",
      expiry: 1,
      from: message.author.id,
      to: message.author.id,
      priority: -1
    });

    return null;
  };

  to = to.player;

  if (to.id === message.author.id) {

    message.channel.send(":x: You cannot haunt yourself!" + rs.misc.sarcasm(true));

    return null;

  };

  if (!to.isAlive()) {
    message.channel.send(":x: You cannot haunt a dead player!" + rs.misc.sarcasm(true));
    return null;
  };

  if (!from.misc.jester_lynchers.some(x => x.identifier === to.identifier)) {
    message.channel.send(":x: You may not haunt a player who did not vote you in the trial!");
    return null;
  };

  game.addAction("jester/haunt", ["cycle"], {
    name: "Jester-haunt",
    expiry: 1,
    from: message.author.id,
    to: to.id
  });

  var mention = to.getDisplayName();

  message.channel.send(":black_joker: You have decided to haunt **" + mention + "**.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = false;
module.exports.ALIVE_CANNOT_USE = true;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
