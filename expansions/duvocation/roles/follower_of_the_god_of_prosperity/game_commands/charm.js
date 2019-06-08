var lcn = require("../../../../../source/lcn.js");

var auxils = lcn.auxils;
var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  var from = game.getPlayerById(message.author.id);

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "charm <alphabet/username/nobody>` instead!");
    return null;
  };

  if (params.length > from.misc.charms_left) {
    message.channel.send(":x: You do not have sufficient charms for that!");
    return null;
  };

  actions.delete(x => x.from === from.identifier && x.identifier === "follower_of_the_god_of_prosperity/charm");

  var names = new Array();

  for (var i = 0; i < params.length; i++) {

    var parameter = params[i];

    var to = game.getPlayerMatch(parameter);

    if (to.score < 0.7 || parameter.toLowerCase() === "nobody") {
      message.channel.send(":four_leaf_clover: You have decided not to give out any charms tonight.");
      return null;
    };

    to = to.player;

    if (!to.isAlive()) {
      message.channel.send(":x: You cannot give charms to dead people!" + rs.misc.sarcasm(true));
      return null;
    };

    if (to.id === message.author.id) {

      game.addAction("follower_of_the_god_of_prosperity/charm", ["cycle"], {
        name: "Prosperity-charm",
        expiry: 1,
        priority: 0.0000000000000001,
        from: message.author.id,
        to: to.id
      });

      var mention = "yourself";

    } else {

      game.addAction("follower_of_the_god_of_prosperity/charm", ["cycle"], {
        name: "Prosperity-charm",
        expiry: 1,
        priority: 0.0000000000000001,
        from: message.author.id,
        to: to.id
      });

      var mention = to.getDisplayName();

    };

    names.push(mention);

  };

  message.channel.send(":four_leaf_clover: You have decided to give charms to " + auxils.pettyFormat(names.map(x => "**" + x + "**")) + " tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
