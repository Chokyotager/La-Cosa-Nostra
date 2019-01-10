// Register heal

var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  var from = game.getPlayerById(message.author.id);

  if (from.misc.assassin_picked_target) {
    message.channel.send(":x: You already picked your target!");
    return null;
  };

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "pick <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);

  actions.delete(x => x.from === from.identifier && (x.identifier === "arsonist/douse" || x.identifier === "arsonist/ignite"));

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":dagger: You have decided not to pick a victim tonight.");
    return null;
  };

  to = to.player;

  if (!to.isAlive()) {
    message.channel.send(":x: You cannot pick a dead player!" + rs.misc.sarcasm(true));
    return null;
  };

  if (to.id === message.author.id) {

    message.channel.send(":x: You cannot pick yourself!" + rs.misc.sarcasm(true));

    return null;

  } else {

    game.addAction("assassin/pick_target", ["cycle"], {
      name: "Assassin-pick-target",
      expiry: 1,
      from: message.author.id,
      to: to.id
    });

    var mention = to.getDisplayName();

  };

  message.channel.send(":dagger: You have decided to pick **" + mention + "** as your victim.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
