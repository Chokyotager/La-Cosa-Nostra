var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;

  // Run checks, etc

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "extinguish <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);
  var from = game.getPlayerById(message.author.id);

  actions.delete(x => x.from === from.identifier && x.identifier === "bombproof_bomb_defuser/defuse");

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":scissors: You have decided to defuse bombs on nobody tonight.");
    return null;
  };

  to = to.player;

  if (!to.isAlive()) {
    message.channel.send(":x: You cannot defuse bombs on a dead player!" + rs.misc.sarcasm(true));
    return null;
  };

  if (to.id === message.author.id) {
    message.channel.send(":scissors: You have decided to defuse bombs on **yourself** tonight.");
  } else {
    message.channel.send(":scissors: You have decided to defuse bombs on **" + to.getDisplayName() + "** tonight.")
  };

  game.addAction("bombproof_bomb_defuser/defuse", ["cycle"], {
    name: "fireproof_firefighter-extinguish",
    expiry: 1,
    from: message.author.id,
    to: to.id
  });

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
