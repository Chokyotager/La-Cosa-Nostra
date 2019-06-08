var lcn = require("../../../../../source/lcn.js");

// Register heal

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "check <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);
  var from = game.getPlayerById(message.author.id);

  actions.delete(x => x.from === from.identifier && x.identifier === "a/investigation_contract/check");

  if (!game.actions.exists(x => x.identifier === "a/investigation_contract/standard_noresult" && x.from === from.identifier)) {

    game.addAction("a/investigation_contract/standard_noresult", ["cycle"], {
      name: "Standard-noresult",
      expiry: 1,
      from: message.author.id,
      to: message.author.id
    });

  };

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":mag: You have decided not to check anyone tonight.");
    return null;
  };

  to = to.player;

  if (!to.isAlive()) {
    message.channel.send(":x: You cannot check a dead player!" + rs.misc.sarcasm(true));
    return null;
  };

  if (to.id === message.author.id) {

    message.channel.send(":x: You cannot check yourself!" + rs.misc.sarcasm(true));

    return null;

  } else {

    game.actions.delete(x => x.identifier === "a/investigation_contract/standard_noresult" && x.from === from.identifier);

    game.addAction("a/investigation_contract/check", ["cycle"], {
      name: "Contract-investigation",
      expiry: 1,
      from: message.author.id,
      to: to.id
    });

    var mention = to.getDisplayName();

  };

  message.channel.send(":mag: You have decided to check **" + mention + "** tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
