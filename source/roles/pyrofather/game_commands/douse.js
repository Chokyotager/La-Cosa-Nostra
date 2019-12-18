var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "douse <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);
  var from = game.getPlayerById(message.author.id);

  actions.delete(x => x.from === from.identifier && (x.identifier === "pyrofather/douse_vote" || x.identifier === "pyrofather/ignite_vote"));

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":oil: You have decided not to douse nor ignite tonight.");
    return null;
  };

  to = to.player;

  if (!to.isAlive()) {
    message.channel.send(":x: You cannot vote to douse a dead player!" + rs.misc.sarcasm(true));
    return null;
  };

  if (to.id === message.author.id) {

    message.channel.send(":x: You cannot vote to douse yourself!" + rs.misc.sarcasm(true));

    return null;

  } else {

    game.addAction("pyrofather/douse_vote", ["cycle"], {
      name: "Pyrofaher-douse-vote",
      expiry: 1,
      from: message.author.id,
      to: to.id
    });

    var mention = to.getDisplayName();

  };

  message.channel.send(":oil: You have decided to vote to douse **" + mention + "** tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
