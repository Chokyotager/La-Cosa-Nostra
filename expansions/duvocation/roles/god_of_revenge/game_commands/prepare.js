var lcn = require("../../../../../source/lcn.js");

// Register heal

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  var from = game.getPlayerById(message.author.id);

  if (from.misc.veteran_alerts_left < 1) {
    message.channel.send(":x: You do not have any attack preparations left!");
    return null;
  };

  var already_alerting = actions.exists(x => x.from === from.identifier && x.identifier === "god_of_revenge/prepare");

  if (already_alerting) {
    message.channel.send(":x: You have already decided to prepare for an attack tonight! Use `" + config["command-prefix"] + "deselect` to prepare for an attack.");
    return null;
  };

  message.channel.send(":boom: You have decided to prepare for an attack tonight.");

  game.addAction("god_of_revenge/prepare", ["cycle"], {
    name: "GOR-prepare",
    expiry: 1,
    from: message.author.id,
    to: message.author.id
  });

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
