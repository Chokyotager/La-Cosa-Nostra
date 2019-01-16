var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "choose <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);
  var from = game.getPlayerById(message.author.id);

  if (from.misc.oracle_last_target) {
    var target = game.getPlayerByIdentifier(from.misc.oracle_last_target);
    message.channel.send(":x: Your current target is **" + target.getDisplayName() + "**. You may not change this unless your target is dead!");
    return null;
  };

  actions.delete(x => x.from === from.identifier && x.identifier === "sentinel_oracle/choose");

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":eye_in_speech_bubble: You have decided not to choose anyone tonight.");
    return null;
  };

  to = to.player;

  if (!to.isAlive()) {
    message.channel.send(":x: You cannot choose a dead player!" + rs.misc.sarcasm(true));
    return null;
  };

  if (to.id === message.author.id) {

    message.channel.send(":x: You cannot choose yourself!" + rs.misc.sarcasm(true));

    return null;

  } else {

    game.addAction("sentinel_oracle/choose", ["cycle"], {
      name: "Oracle-choose",
      expiry: 1,
      from: message.author.id,
      to: to.id
    });

    var mention = to.getDisplayName();

  };

  message.channel.send(":eye_in_speech_bubble: You have decided to choose **" + mention + "** tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
