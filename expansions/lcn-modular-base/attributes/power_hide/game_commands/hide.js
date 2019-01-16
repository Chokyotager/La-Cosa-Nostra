var lcn = require("../../../../../source/lcn.js");

// Register heal

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "hide <on/off>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);
  var from = game.getPlayerById(message.author.id);

  rs.modular.clearModuleActions(game, from.identifier, "power");

  switch (params[0]) {

    case "on":
      game.addAction("a/power_hide/hide", ["cycle"], {
        name: "Modular-hide",
        expiry: 1,
        from: message.author.id,
        to: message.author.id,
        meta: {type: "power"},
        priority: 0.00001
      });

      message.channel.send(":runner: You have decided to hide tonight.");
      break;

    case "off":
      message.channel.send(":runner: You have decided not to hide tonight.");
      break;

    default:
      message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "hide <on/off>` instead!");

  };

  return null;

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
