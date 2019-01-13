var lcn = require("../../../../../source/lcn.js");

// Register heal

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "selfwatch <on/off>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);
  var from = game.getPlayerById(message.author.id);

  rs.modular.clearModuleActions(game, from.identifier, "power");

  switch (params[0]) {

    case "on":
      game.addAction("a/power_self_watch/selfwatch", ["cycle"], {
        name: "Modular-selfwatch",
        expiry: 1,
        from: message.author.id,
        meta: {type: "power"},
        to: message.author.id,
        priority: 9
      });

      message.channel.send(":mag: You have decided to selfwatch tonight.");
      break;

    case "off":
      message.channel.send(":mag: You have decided not to selfwatch tonight.");
      break;

    default:
      message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "selfwatch <on/off>` instead!");

  };

  return null;

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
