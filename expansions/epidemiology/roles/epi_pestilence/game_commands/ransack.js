var lcn = require("../../../../../source/lcn.js");

// Register heal

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "ransack <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);
  var from = game.getPlayerById(message.author.id);

  actions.delete(x => x.from === from.identifier && (x.identifier === "epi_pestilence/ransack" || x.identifier === "epi_pestilence/self_ransack"));

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":skull: You have decided not to ransack anyone nor stay at home tonight.");
    return null;
  };

  to = to.player;

  if (!to.isAlive()) {
    message.channel.send(":x: You cannot ransack a dead player!" + rs.misc.sarcasm(true));
    return null;
  };

  if (to.id === message.author.id) {

    game.addAction("epi_pestilence/self_ransack", ["cycle"], {
      name: "epi_pestilence-self-ransack",
      expiry: 1,
      from: message.author.id,
      to: to.id
    });

    message.channel.send(":skull: You have decided to stay at home and attack anyone who visits you tonight.");

    return null;

  } else {

    game.addAction("epi_pestilence/ransack", ["cycle"], {
      name: "epi_pestilence-ransack",
      expiry: 1,
      from: message.author.id,
      to: to.id
    });

    var mention = to.getDisplayName();

  };

  message.channel.send(":skull: You have decided to ransack **" + mention + "** tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
