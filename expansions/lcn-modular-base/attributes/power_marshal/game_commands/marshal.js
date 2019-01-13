var lcn = require("../../../../../source/lcn.js");

// Register heal

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "marshal <on/off>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);
  var from = game.getPlayerById(message.author.id);

  rs.modular.clearModuleActions(game, from.identifier, "power");

  switch (params[0]) {

    case "on":
      game.addAction("a/power_marshal/marshal", ["cycle"], {
        name: "Modular-marshal",
        expiry: 1,
        from: message.author.id,
        meta: {type: "power"},
        to: message.author.id,
        priority: 5
      });

      message.channel.send(":octagonal_sign: You have decided to marshal the votes for tomorrow tonight.");
      break;

    case "off":
      message.channel.send(":octagonal_sign: You have decided not to marshal the votes for tomorrow tonight.");
      break;

    default:
      message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "marshal <on/off>` instead!");

  };

  return null;

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
