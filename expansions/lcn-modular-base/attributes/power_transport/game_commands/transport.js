var lcn = require("../../../../../source/lcn.js");

// Register heal

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  var from = game.getPlayerById(message.author.id);

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "drive <alphabet/name/nobody> <alphabet/name>` instead!");
    return null;
  };

  rs.modular.clearModuleActions(game, from.identifier, "power");

  var player1 = game.getPlayerMatch(params[0]);

  if (player1.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":twisted_rightwards_arrows: You have decided not to transport anyone tonight.");
    return null;
  };

  player1 = player1.player;

  if (params[1] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "transport <alphabet/name/nobody> <alphabet/name>` instead!");
    return null;
  };

  var player2 = game.getPlayerMatch(params[1]);

  if (player2.score < 0.7) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "transport <alphabet/name/nobody> <alphabet/name>` instead!");
    return null;
  };

  player2 = player2.player;

  if (!player1.isAlive() || !player2.isAlive()) {
    message.channel.send(":x: Both your targets have to be alive!");
    return null;
  };

  if (player1.identifier === player2.identifier) {
    message.channel.send(":x: Your targets cannot be the same player!");
    return null;
  };

  game.addAction("a/power_transport/transport", ["cycle"], {
    name: "Modular-transport",
    expiry: 1,
    from: message.author.id,
    meta: {type: "power"},
    to: player1.identifier,
    target: player2.identifier,
    priority: 0.01
  });

  var p1_name = player1.identifier === from.identifier ? "yourself" : player1.getDisplayName();
  var p2_name = player2.identifier === from.identifier ? "yourself" : player2.getDisplayName();

  message.channel.send(":twisted_rightwards_arrows: You have decided to transport **" + p1_name + "** and **" + p2_name + "** tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
