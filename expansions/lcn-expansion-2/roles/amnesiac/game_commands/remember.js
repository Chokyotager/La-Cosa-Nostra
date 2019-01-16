var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  var from = game.getPlayerById(message.author.id);

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "remember <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);

  actions.delete(x => x.from === from.identifier && x.identifier === "amnesiac/remember");

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":head_bandage: You have decided not to remember anyone's role tonight.");
    return null;
  };

  to = to.player;

  if (to.id === message.author.id) {

    message.channel.send(":x: You remember your own role!" + rs.misc.sarcasm(true));

    return null;

  } ;

  if (to.isAlive()) {

    message.channel.send(":x: You cannot remember the role of a living player!" + rs.misc.sarcasm(true));
    return null;

  } else {

    game.addAction("amnesiac/remember", ["cycle"], {
      name: "Amnesiac-remember",
      expiry: 1,
      from: message.author.id,
      to: to.id
    });

    var mention = to.getDisplayName();

  };

  message.channel.send(":head_bandage: You have decided to remember the role of **" + mention + "** tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
