// Register heal

var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  var from = game.getPlayerById(message.author.id);
  //if (from.misc.vigilante_bullets < 1) {
  //  message.channel.send(":x: You do not have any bullets!");
  //  return null;
  //};

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "kill <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);

  actions.delete(x => x.from === from.identifier && x.identifier === "god_of_beasts/kill");

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(rs.misc.beasts(true) + " You have decided not to send your beasts out tonight.");
    from.misc.abstain = true;
    return null;
  };

  to = to.player;

  if (!to.isAlive()) {
    message.channel.send(":x: You cannot kill a dead player!" + rs.misc.sarcasm(true));
    return null;
  };

  if (to.id === message.author.id) {

    message.channel.send(":x: Your beasts will not attack you!" + rs.misc.sarcasm(true));

    return null;

  } else {

    game.addAction("god_of_beasts/kill", ["cycle"], {
      name: "god_of_beasts-kill",
      expiry: 1,
      from: message.author.id,
      to: to.id
    });

    var mention = to.getDisplayName();

  };

  message.channel.send(rs.misc.beasts(true) + " You have decided to kill **" + mention + "** tonight.");
  from.misc.abstain = false;

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
