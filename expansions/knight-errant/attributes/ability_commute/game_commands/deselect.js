// Register heal

var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  var from = game.getPlayerById(message.author.id);

  if (from.misc.commutes_left < 1) {
    return null;
  };

  var already_commuting = actions.exists(x => x.from === from.identifier && x.identifier === "a/ability/commute");

  if (!already_commuting) {
    message.channel.send(":x: You have already decided not to commute tonight. Use `" + config["command-prefix"] + "commute` to choose to commute tonight.");
    return null;
  };

  rs.modular.clearModuleActions(game, from.identifier, "ability");

  message.channel.send(":runner: You have decided not to commute tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
