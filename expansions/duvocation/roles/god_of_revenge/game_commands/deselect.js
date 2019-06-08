var lcn = require("../../../../../source/lcn.js");

// Register heal

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  var from = game.getPlayerById(message.author.id);

  var already_alerting = actions.exists(x => x.from === from.identifier && x.identifier === "god_of_revenge/prepare");

  if (!already_alerting) {
    message.channel.send(":x: You have already decided not to prepare for an attack tonight. Use `" + config["command-prefix"] + "prepare` to prepare for an attack tonight!");
    return null;
  };

  actions.delete(x => x.from === from.identifier && x.identifier === "god_of_revenge/prepare");

  message.channel.send(":boom: You have decided not to prepare for an attack tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
