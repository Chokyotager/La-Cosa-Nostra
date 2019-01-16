// Register heal

var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "influence <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);
  var from = game.getPlayerById(message.author.id);

  actions.delete(x => x.from === from.identifier && (x.identifier === "social_engineer/influence" || x.identifier === "social_engineer/block" || x.identifier === "social_engineer/no_action"));

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":ballot_box: You have decided not to block or influence the vote of anyone tonight.");

    game.addAction("social_engineer/no_action", ["cycle"], {
      name: "SE-no_action",
      expiry: 1,
      from: message.author.id,
      to: message.author.id
    });

    return null;
  };

  to = to.player;

  if (!to.isAlive()) {
    message.channel.send(":x: You cannot influence the vote of a dead player!" + rs.misc.sarcasm(true));

    game.addAction("social_engineer/no_action", ["cycle"], {
      name: "SE-no_action",
      expiry: 1,
      from: message.author.id,
      to: message.author.id
    });

    return null;
  };

  if (from.misc.se_influence_log[0] === to.identifier) {
    message.channel.send(":x: You cannot block or influence the vote of the same player consecutively!");

    game.addAction("social_engineer/no_action", ["cycle"], {
      name: "SE-no_action",
      expiry: 1,
      from: message.author.id,
      to: message.author.id
    });

    return null;
  };

  if (to.id === message.author.id) {

    var mention = "yourself";

  } else {

    var mention = to.getDisplayName();

  };

  game.addAction("social_engineer/influence", ["cycle"], {
    name: "SE-influence",
    expiry: 1,
    from: message.author.id,
    to: to.id
  });

  message.channel.send(":ballot_box: You have decided to influence the vote of **" + mention + "** tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
