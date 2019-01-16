var lcn = require("../../../../../source/lcn.js");

// Register heal

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "heal <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);
  var from = game.getPlayerById(message.author.id);

  actions.delete(x => x.from === from.identifier && x.identifier === "non_consecutive_doctor/doc_protect");

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":syringe: You have decided to protect nobody.");
    return null;
  };

  to = to.player;

  if (!to.isAlive()) {
    message.channel.send(":x: You cannot heal a dead player!" + rs.misc.sarcasm(true));
    return null;
  };

  if (from.misc.protect_log[0] === to.identifier) {
    message.channel.send(":x: You cannot heal a player twice in a row!");

    game.addAction("non_consecutive_doctor/no_action", ["cycle"], {
      name: "Non-Conseq-no_action",
      expiry: 1,
      from: message.author.id,
      to: message.author.id
    });

    return null;
  };

  if (to.id === message.author.id) {
    // Do stuff

    var mention = "yourself";

  } else {

    var mention = to.getDisplayName();

  };

  game.addAction("non_consecutive_doctor/doc_protect", ["cycle"], {
    name: "Doc-protect",
    expiry: 1,
    from: message.author.id,
    to: to.id
  });

  message.channel.send(":syringe: You have decided to heal **" + mention + "**.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
