var lcn = require("../../../../../source/lcn.js");

// Register heal

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "protect <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);
  var from = game.getPlayerById(message.author.id);

  if (from.misc.protections_left < 1) {
    message.channel.send(":x: You have no protections left!");
    return null;
  };

  actions.delete(x => x.from === from.identifier && x.identifier === "one_shot_doctor/protect");

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":shield: You have decided to protect nobody tonight.");
    return null;
  };

  to = to.player;

  if (!to.isAlive()) {
    message.channel.send(":x: You cannot heal a dead player!" + rs.misc.sarcasm(true));
    return null;
  };

  if (to.id === message.author.id) {

    message.channel.send(":x: You may not protect yourself.");
    return null;

  };

  game.addAction("one_shot_doctor/protect", ["cycle"], {
    name: "Doc-protect",
    expiry: 1,
    from: message.author.id,
    to: to.id
  });

  var mention = to.getDisplayName();

  message.channel.send(":shield: You have decided to protect **" + mention + "** tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
