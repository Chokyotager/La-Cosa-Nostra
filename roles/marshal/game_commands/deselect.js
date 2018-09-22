// Register heal

var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  var from = game.getPlayerById(message.author.id);

  if (from.misc.marshal_uses < 1) {
    message.channel.send(":x: You do not have any vote marshals left!");
    return null;
  };

  var already_marshal = actions.exists(x => x.from === from.identifier && x.identifier === "marshal/marshal");

  if (!already_marshal) {
    message.channel.send(":x: You have not decided to marshal the votes for tomorrow! Use `" + config["command-prefix"] + "marshal` to initiate the vote marshal!");
    return null;
  };

  actions.delete(x => x.from === from.identifier && x.identifier === "marshal/marshal");

  message.channel.send(":octagonal_sign: You have decided not to marshal the votes for tomorrow.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
