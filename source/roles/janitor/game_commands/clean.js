// Register heal

var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  var from = game.getPlayerById(message.author.id);

  if (from.misc.janitor_cleans_left < 1) {
    message.channel.send(":x: You have used up all your cleans!");
    return null;
  };

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "clean <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);

  actions.delete(x => x.from === from.identifier && x.identifier === "janitor/clean");

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":file_cabinet: You have decided not to clean anyone tonight.");
    return null;
  };

  to = to.player;

  if (!to.isAlive()) {
    message.channel.send(":x: You cannot clean a dead player!" + rs.misc.sarcasm(true));
    return null;
  };

  if (to.id === message.author.id) {

    var mention = "yourself";

  } else {

    var mention = to.getDisplayName();

  };

  game.addAction("janitor/clean", ["cycle"], {
    name: "Janitor-clean",
    expiry: 1,
    from: message.author.id,
    to: to.id
  });

  message.channel.send(":file_cabinet: You have decided to clean **" + mention + "** tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
