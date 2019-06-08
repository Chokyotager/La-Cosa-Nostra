var lcn = require("../../../../../source/lcn.js");

// Register heal

var rs = lcn.rolesystem;
var auxils = lcn.auxils;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  var from = game.getPlayerById(message.author.id);
  var forged = game.findAll(x => x.isAlive() && x.misc.forgery === game.getStep() && x.misc.forger === from.identifier);

  if (params.length < 1 || !params[0]) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "forge <\"retract\"/alphabet/name/nobody> <alphabet/name>` instead!");
    return null;
  };

  var player1 = game.getPlayerMatch(params[0]);

  if (params[0].toLowerCase() === "retract") {

    if (params[1]) {

      var player2 = game.getPlayerMatch(params[1]);

      if (player2.score < 0.7) {
        message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "forge <\"retract\"/alphabet/name/nobody> <alphabet/name>` instead!");
        return null;
      };

      player2 = player2.player;

      if (!(player2.misc.forgery === game.getStep() && player2.misc.forger === from.identifier)) {
        message.channel.send(":x: You are not forging the vote of that player!");
        return null;
      };

      forged = [player2];

    };

    if (forged.length < 1) {
      message.channel.send(":x: There are no forged votes from you to retract!");
      return null;
    };

    for (var i = 0; i < forged.length; i++) {

      game.addAction("god_of_lies/retract", ["instant"], {
        name: "GOL-retract",
        expiry: 1,
        from: message.author.id,
        to: forged[i].identifier
      });

    };

    forged = forged.map(x => "**" + x.getDisplayName() + "**");
    var forged_names = auxils.pettyFormat(forged);

    message.channel.send(":pencil: You have retracted the forged vote" + auxils.vocab("s", forged_names.length) + " from " + forged_names + ".");

    return null;

  };

  if (params.length < 2 || !params[0] || !params[1]) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "forge <\"retract\"/alphabet/name/nobody> <alphabet/name>` instead!");
    return null;
  };

  if (from.misc.forgeries_left < 1) {
    message.channel.send(":x: You have used up all your forgeries for today!");
    return null;
  };

  if (player1.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":pencil: You have decided not to forge any votes for now.");
    return null;
  };

  player1 = player1.player;

  var player2 = game.getPlayerMatch(params[1]);

  if (player2.score < 0.7) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "forge <\"retract\"/alphabet/name/nobody> <alphabet/name>` instead!");
    return null;
  };

  player2 = player2.player;

  if (!player1.isAlive() || !player2.isAlive()) {
    message.channel.send(":x: Both your targets have to be alive!");
    return null;
  };

  if (player1.identifier === from.identifier) {
    message.channel.send(":x: You cannot forge your own vote!");
    return null;
  };

  //if (player2.isVotedAgainstBy(player1.identifier)) {
  //  message.channel.send(":x: **" + player1.getDisplayName() + "** is already voting on **" + player2.getDisplayName() + "**!")
  //  return null;
  //};

  game.addAction("god_of_lies/forge", ["instant"], {
    name: "GOL-forge",
    expiry: 1,
    from: message.author.id,
    to: player1.identifier,
    target: player2.identifier,
  });

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = false;
module.exports.DISALLOW_NIGHT = true;
