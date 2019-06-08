var lcn = require("../../../../../source/lcn.js");

// Register heal

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  var from = game.getPlayerById(message.author.id);

  if (params.length < 2 || !params[0] || !params[1]) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "control <alphabet/name/nobody> <alphabet/name>` instead!");
    return null;
  };

  actions.delete(x => (x.from === from.identifier && (x.tags.includes("mafia_factional_side") || x.tags.includes("mafia_factional_main"))));

  var player1 = game.getPlayerMatch(params[0]);

  if (player1.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":dart: You have decided not to control anyone tonight.");
    return null;
  };

  player1 = player1.player;

  var player2 = game.getPlayerMatch(params[1]);

  if (player2.score < 0.7) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "control <alphabet/name/nobody> <alphabet/name>` instead!");
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

  if (player1.identifier === from.identifier) {
    message.channel.send(":x: You cannot redirect actions from yourself!");
    return null;
  };

  game.addAction("mafia_follower_of_the_chaos_god/control", ["cycle"], {
    name: "M-FOC-Control",
    expiry: 1,
    from: message.author.id,
    to: player1.identifier,
    target: player2.identifier,
    tags: ["mafia_factional_side"],
    priority: 0.01
  });

  var p1_name = player1.identifier === from.identifier ? "yourself" : player1.getDisplayName();
  var p2_name = player2.identifier === from.identifier ? "yourself" : player2.getDisplayName();

  message.channel.send(":dart: You have decided to redirect all actions from **" + p1_name + "** to **" + p2_name + "** tonight.");
  game.getChannel("mafia").send(":exclamation: **" + from.getDisplayName() + "** is redirecting all actions from **" + p1_name + "** to **" + p2_name + "** tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
