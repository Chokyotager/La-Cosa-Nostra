var lcn = require("../../../../../source/lcn.js");

// Register heal

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  if (params.length < 2) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "ridkill <alphabet/username/nobody> <role name>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);
  var from = game.getPlayerById(message.author.id);

  var guess = params.splice(1, Infinity).join(" ");

  rs.modular.clearModuleActions(game, from.identifier, "power");

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":bow_and_arrow: You have decided not to RID kill anyone tonight.");
    return null;
  };

  to = to.player;

  if (!to.isAlive()) {
    message.channel.send(":x: You cannot RID kill a dead player!" + rs.misc.sarcasm(true));
    return null;
  };

  if (to.id === message.author.id) {

    message.channel.send(":x: You cannot RID kill yourself!" + rs.misc.sarcasm(true));

    return null;

  } else {

    game.addAction("a/power_rid_kill/ridkill", ["cycle"], {
      name: "Modular-ridkill",
      expiry: 1,
      priority: 5,
      from: message.author.id,
      meta: {type: "power"},
      to: to.id,
      guess: guess
    });

    var mention = to.getDisplayName();

  };

  message.channel.send(":bow_and_arrow: You have decided to RID kill **" + mention + "** tonight with the role name guess: `" + guess + "` (case-insensitive).");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
