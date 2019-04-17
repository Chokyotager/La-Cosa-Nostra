// Register heal

var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  var from = game.getPlayerById(message.author.id);

  var already_alerting = actions.exists(x => x.from === from.identifier && x.identifier === "veteran/alert");

  if (!already_alerting) {
    message.channel.send(":x: You have already decided not to go on alert tonight. Use `" + config["command-prefix"] + "alert` to choose to go on alert!");
    return null;
  };

  actions.delete(x => x.from === from.identifier && x.identifier === "veteran/alert");

  message.channel.send(":triangular_flag_on_post: You have decided not to go on alert tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
