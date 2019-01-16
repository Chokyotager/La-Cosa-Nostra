var lcn = require("../../../../../source/lcn.js");

// Register heal

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  var from = game.getPlayerById(message.author.id);

  if (from.misc.joat_rolled !== "watch") {
    message.channel.send(":x: You cannot use that command!");
    return null;
  };

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "watch <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);

  actions.delete(x => x.from === from.identifier && x.identifier === "jack_of_all_trades/watch");

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":four_leaf_clover: You have decided not to watch anyone tonight.");
    return null;
  };

  to = to.player;

  if (!to.isAlive()) {
    message.channel.send(":x: You cannot watch a dead player!" + rs.misc.sarcasm(true));
    return null;
  };

  if (to.id === message.author.id) {

    message.channel.send(":x: You cannot watch yourself!" + rs.misc.sarcasm(true));

    return null;

  } else {

    game.addAction("jack_of_all_trades/watch", ["cycle"], {
      name: "JOAT-watch",
      expiry: 1,
      from: message.author.id,
      to: to.id,
      priority: 10
    });

    var mention = to.getDisplayName();

  };

  message.channel.send(":four_leaf_clover: You have decided to watch **" + mention + "** tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
