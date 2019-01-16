var lcn = require("../../../../../source/lcn.js");

// Register heal

var rs = lcn.rolesystem;
var auxils = lcn.auxils;
var attributes = lcn.attributes;

var usable_powers = Object.values(attributes).filter(x => x.attribute.modular && x.attribute["modular-details"]["cluster"] === "power");

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  if (params.length < 1) {
    message.channel.send(":mag: You have decided not to use a power census tonight. Please use `" + config["command-prefix"] + "powercensus [power]` if you decide otherwise.");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);
  var from = game.getPlayerById(message.author.id);

  var power = params.join(" ");

  rs.modular.clearModuleActions(game, from.identifier, "power");

  var has_power = usable_powers.some(x => x.attribute.name.toLowerCase() === power.toLowerCase());

  if (!has_power) {
    message.channel.send(":x: The power `" + power + "` does not exist!")
    return null;
  };

  game.addAction("a/power_power_census/powercensus", ["cycle"], {
    name: "Modular-powercensus",
    expiry: 1,
    priority: 4,
    from: message.author.id,
    meta: {type: "power"},
    to: message.author.id,
    census: power,
    meta: {type: "power"}
  });

  message.channel.send(":mag: You have decided to perform a census on the power `" + power + "` tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
