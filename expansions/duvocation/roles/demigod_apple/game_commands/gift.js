var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  var from = game.getPlayerById(message.author.id);

  if (game.isDay() && from.misc.day_gifts < 1) {
    return null;
  };

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "gift <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);

  actions.delete(x => x.from === from.identifier && x.identifier === "demigod_apple/gift");

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":apple: You have decided not to gift anyone juice " + (game.isDay() ? "today" : "tonight") + ".");
    return null;
  };

  to = to.player;

  if (!to.isAlive()) {
    message.channel.send(":x: Corpses cannot drink apple juice!" + rs.misc.sarcasm(true));
    return null;
  };

  if (to.id === message.author.id) {

    message.channel.send(":x: You can drink apple juice anytime, it would be a waste to do it now!");

    return null;

  } else if (to.misc.juice === "apple") {

    message.channel.send(":x: You already gifted that player juice!");

  } else {

    game.addAction("demigod_apple/gift", ["cycle"], {
      name: "demigod_apple-gift",
      expiry: 1,
      from: message.author.id,
      to: to.id
    });

    var mention = to.getDisplayName();

  };

  message.channel.send(":apple: You have decided to give **" + mention + "** apple juice " + (game.isDay() ? "today. Your target will receive the juice at the end of the day." : "tonight."));

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = false;
module.exports.DISALLOW_NIGHT = false;
